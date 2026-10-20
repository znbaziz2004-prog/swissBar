const { pool } = require("../config/db");

/*
 * Get the authenticated owner's shop
 */
const getOwnedShop = async (userId) => {
  const [shops] = await pool.query(
    `SELECT id, name
     FROM barber_shops
     WHERE owner_id = ?
     LIMIT 1`,
    [userId]
  );

  return shops[0] || null;
};

/*
 * Submit testimonial for Swiss Barber
 */
const createTestimonial = async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId || req.user?.role !== "owner") {
      return res.status(403).json({
        success: false,
        message: "Only shop owners can submit testimonials.",
      });
    }

    const testimonial =
      typeof req.body.testimonial === "string"
        ? req.body.testimonial.trim()
        : "";

    if (!testimonial) {
      return res.status(400).json({
        success: false,
        message: "Please enter your testimonial.",
      });
    }

    if (testimonial.length > 2000) {
      return res.status(400).json({
        success: false,
        message: "Testimonial cannot exceed 2000 characters.",
      });
    }

    const shop = await getOwnedShop(userId);

    if (!shop) {
      return res.status(404).json({
        success: false,
        message: "No shop is linked to this account.",
      });
    }

    const [existing] = await pool.query(
      `SELECT id
       FROM barber_testimonials
       WHERE shop_id = ?
         AND status IN ('pending', 'approved')
       LIMIT 1`,
      [shop.id]
    );

    if (existing.length) {
      return res.status(409).json({
        success: false,
        message:
          "Your shop already has a pending or approved testimonial.",
      });
    }

    const [result] = await pool.query(
      `INSERT INTO barber_testimonials
         (shop_id, submitted_by, testimonial, status)
       VALUES (?, ?, ?, 'pending')`,
      [shop.id, userId, testimonial]
    );

    return res.status(201).json({
      success: true,
      message: "Testimonial submitted for approval.",
      data: {
        id: result.insertId,
        shop_id: shop.id,
        shop_name: shop.name,
        testimonial,
        status: "pending",
      },
    });
  } catch (error) {
    console.error("Create testimonial error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to submit testimonial.",
    });
  }
};

/*
 * Get the authenticated owner's testimonial
 */
const getMyTestimonial = async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId || req.user?.role !== "owner") {
      return res.status(403).json({
        success: false,
        message: "Only shop owners can view their testimonial.",
      });
    }

    const shop = await getOwnedShop(userId);

    if (!shop) {
      return res.status(404).json({
        success: false,
        message: "No shop is linked to this account.",
      });
    }

    const [rows] = await pool.query(
      `SELECT id, shop_id, submitted_by, testimonial,
              status, admin_feedback, created_at, updated_at
       FROM barber_testimonials
       WHERE shop_id = ?
       ORDER BY created_at DESC
       LIMIT 1`,
      [shop.id]
    );

    return res.json({
      success: true,
      data: {
        testimonial: rows[0] || null,
      },
    });
  } catch (error) {
    console.error("Get testimonial error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch testimonial.",
    });
  }
};

module.exports = {
  createTestimonial,
  getMyTestimonial,
};