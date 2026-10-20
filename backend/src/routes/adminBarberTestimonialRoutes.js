const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const {
  getAllTestimonials,
  updateTestimonialStatus,
   translateExistingTestimonials,
} = require("../controllers/adminBarberTestimonialController");

// Super Admin can view all testimonials
router.get(
  "/",
  authMiddleware,
  authorizeRoles("super_admin"),
  getAllTestimonials
);

// Translate existing approved testimonials (Super Admin only)
router.post(
  "/translate-existing",
  authMiddleware,
  authorizeRoles("super_admin"),
  translateExistingTestimonials
);

// Super Admin can approve or reject a testimonial
router.patch(
  "/:id/status",
  authMiddleware,
  authorizeRoles("super_admin"),
  updateTestimonialStatus
);



module.exports = router;