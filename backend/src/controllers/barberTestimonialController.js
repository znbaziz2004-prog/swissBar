
const { pool } = require("../config/db");

/*
 * Find the authenticated user's shop.
 * Owners use barber_shops.owner_id.
 * Barbers use the staff table's user_id + shop_id relationship.
 */
const getUserShop = async (userId, role) => {
  let shops;

  if (role === "owner") {
    [shops] = await pool.query(
      `SELECT id, name
       FROM barber_shops
       WHERE owner_id = ?
       LIMIT 1`,
      [userId]
    );
  } else if (role === "barber") {
    [shops] = await pool.query(
      `SELECT bs.id, bs.name
       FROM staff s
       INNER JOIN barber_shops bs ON bs.id = s.shop_id
       WHERE s.user_id = ?
         AND s.status = 'active'
       LIMIT 1`,
      [userId]
    );
  } else {
    return null;
  }

  return shops[0] || null;
};

/*
 * Submit a shop testimonial from the owner or barber panel.
 */
const createTestimonial = async (req, res) => {
  try {
    const userId = req.user?.id;
    const role = req.user?.role;

    if (!userId || !["owner", "barber"].includes(role)) {
      return res.status(403).json({
        success: false,
        message: "Only shop owners and linked barbers can submit testimonials.",
      });
    }

    const testimonial =
      typeof req.body?.testimonial === "string"
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

    const shop = await getUserShop(userId, role);

    if (!shop) {
      return res.status(404).json({
        success: false,
        message: "No active shop is linked to this account.",
      });
    }

    // Check whether this shop already has a pending or approved testimonial.
    const [existing] = await pool.query(
      `SELECT id
       FROM barber_testimonials
       WHERE shop_id = ?
         AND status IN ('pending', 'approved')
       ORDER BY created_at DESC
       LIMIT 1`,
      [shop.id]
    );

    // If one exists, update it and send it for approval again.
    if (existing.length > 0) {
      const testimonialId = existing[0].id;

      await pool.query(
        `UPDATE barber_testimonials
         SET submitted_by = ?,
             testimonial = ?,
             status = 'pending',
             admin_feedback = NULL
         WHERE id = ?`,
        [userId, testimonial, testimonialId]
      );

      return res.status(200).json({
        success: true,
        message: "Testimonial updated and submitted for admin approval.",
        data: {
          id: testimonialId,
          shop_id: shop.id,
          shop_name: shop.name,
          testimonial,
          status: "pending",
        },
      });
    }

    // If no pending or approved testimonial exists, create a new one.
    const [result] = await pool.query(
      `INSERT INTO barber_testimonials
         (shop_id, submitted_by, testimonial, status)
       VALUES (?, ?, ?, 'pending')`,
      [shop.id, userId, testimonial]
    );

    return res.status(201).json({
      success: true,
      message: "Testimonial submitted for admin approval.",
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
 * View the latest testimonial for the user's linked shop.
 */
const getMyTestimonial = async (req, res) => {
  try {
    const userId = req.user?.id;
    const role = req.user?.role;

    if (!userId || !["owner", "barber"].includes(role)) {
      return res.status(403).json({
        success: false,
        message: "Only shop owners and linked barbers can view testimonials.",
      });
    }

    const shop = await getUserShop(userId, role);

    if (!shop) {
      return res.status(404).json({
        success: false,
        message: "No active shop is linked to this account.",
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
