const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const {
  createTestimonial,
  getMyTestimonial,
} = require("../controllers/barberTestimonialController");

const {
  getApprovedTestimonials,
  translateExistingTestimonials,
} = require("../controllers/adminBarberTestimonialController");

// Shop owner submits a testimonial
router.post("/", authMiddleware, createTestimonial);

// Shop owner views their own testimonial and its status
router.get("/my", authMiddleware, getMyTestimonial);

// Public: Get approved platform testimonials
router.get("/public", getApprovedTestimonials);

// Super Admin: Translate existing approved testimonials
router.post(
  "/translate-existing",
  authMiddleware,
  authorizeRoles("super_admin"),
  translateExistingTestimonials
);

module.exports = router;