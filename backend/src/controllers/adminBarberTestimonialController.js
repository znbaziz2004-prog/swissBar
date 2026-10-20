const { pool } = require("../config/db");
const translateTestimonial = require("../utils/translateTestimonial");

// Get all testimonials for Super Admin
const getAllTestimonials = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT
        bt.id,
        bt.shop_id,
        bt.submitted_by,
        bt.testimonial,
        bt.status,
        bt.admin_feedback,
        bt.created_at,
        bt.updated_at,
        bs.name AS shop_name,
        u.name AS owner_name,
        u.email AS owner_email
      FROM barber_testimonials bt
      JOIN barber_shops bs ON bs.id = bt.shop_id
      JOIN users u ON u.id = bt.submitted_by
      ORDER BY
        CASE
          WHEN bt.status = 'pending' THEN 0
          ELSE 1
        END,
        bt.created_at DESC
    `);

    return res.status(200).json({
      success: true,
      data: { testimonials: rows },
    });
  } catch (error) {
    console.error("Get All Barber Testimonials Error:", error);

    return res.status(500).json({
      success: false,
      message: "Could not fetch testimonials.",
    });
  }
};

// Approve or reject a testimonial
const updateTestimonialStatus = async (req, res) => {
  try {
    const testimonialId = Number(req.params.id);
    const { status, admin_feedback } = req.body;

    if (!Number.isInteger(testimonialId) || testimonialId <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid testimonial ID.",
      });
    }

    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Status must be approved or rejected.",
      });
    }

    const feedback =
      typeof admin_feedback === "string"
        ? admin_feedback.trim()
        : null;
        // Generate translations when a testimonial is approved
if (status === "approved") {
  const [testimonialRows] = await pool.query(
    `SELECT testimonial
     FROM barber_testimonials
     WHERE id = ?
     LIMIT 1`,
    [testimonialId]
  );

  if (!testimonialRows.length) {
    return res.status(404).json({
      success: false,
      message: "Testimonial not found.",
    });
  }

  const translations = await translateTestimonial(
    testimonialRows[0].testimonial
  );

  await pool.query(
    `UPDATE barber_testimonials
     SET testimonial_translations = ?
     WHERE id = ?`,
    [JSON.stringify(translations), testimonialId]
  );
}

    const [result] = await pool.query(
      `UPDATE barber_testimonials
       SET status = ?, admin_feedback = ?
       WHERE id = ?`,
      [status, feedback || null, testimonialId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Testimonial not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: `Testimonial ${status} successfully.`,
    });
  } catch (error) {
    console.error("Update Barber Testimonial Status Error:", error);

    return res.status(500).json({
      success: false,
      message: "Could not update testimonial status.",
    });
  }
};
const translateExistingTestimonials = async (req, res) => {
  try {
    const translateTestimonial = require("../utils/translateTestimonial");

    const [rows] = await pool.query(
      `SELECT id, testimonial
       FROM barber_testimonials
       WHERE status = 'approved'
         AND (
           testimonial_translations IS NULL
           OR testimonial_translations = '{}'
         )`
    );

    let updated = 0;

    for (const row of rows) {
      const translations = await translateTestimonial(
  row.testimonial
);

translations.rm = translations.rm || row.testimonial;

      await pool.query(
        `UPDATE barber_testimonials
         SET testimonial_translations = ?
         WHERE id = ?`,
        [JSON.stringify(translations), row.id]
      );

      updated++;
    }

    return res.status(200).json({
      success: true,
      message: "Existing testimonials processed.",
      updated,
    });
  } catch (error) {
    console.error("Translate Existing Testimonials Error:", error);

    return res.status(500).json({
      success: false,
      message: "Could not translate existing testimonials.",
      error: error.message,
    });
  }
};

const getApprovedTestimonials = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT
          bt.id,
          bt.testimonial,
          bt.testimonial_translations,
          bt.created_at,
          bs.name AS shop_name
       FROM barber_testimonials bt
       JOIN barber_shops bs ON bs.id = bt.shop_id
       WHERE bt.status = 'approved'
       ORDER BY bt.created_at DESC`
    );

    const testimonials = rows.map((row) => {
      let translations = row.testimonial_translations || {};

      if (typeof translations === "string") {
        try {
          translations = JSON.parse(translations);
        } catch {
          translations = {};
        }
      }

      return {
        id: row.id,
        testimonial: row.testimonial,
        translations,
        created_at: row.created_at,
        shop_name: row.shop_name,
      };
    });

    return res.status(200).json({
      success: true,
      data: { testimonials },
    });
  } catch (error) {
    console.error("Get Approved Testimonials Error:", error);

    return res.status(500).json({
      success: false,
      message: "Could not fetch approved testimonials.",
    });
  }
};


module.exports = {
  getAllTestimonials,
  updateTestimonialStatus,
  getApprovedTestimonials,
  translateExistingTestimonials,
};