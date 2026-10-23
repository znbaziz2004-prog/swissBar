
const express = require("express");

const {
  createContactMessage,
  getContactMessages,
  updateContactMessageStatus,
} = require("../controllers/contactController");

const authMiddleware = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const router = express.Router();

// Public: Website contact form
router.post("/", createContactMessage);

// Super Admin: Get all contact messages
router.get(
  "/admin",
  authMiddleware,
  authorizeRoles("super_admin"),
  getContactMessages
);

// Super Admin: Update message status
router.patch(
  "/admin/:id/status",
  authMiddleware,
  authorizeRoles("super_admin"),
  updateContactMessageStatus
);

module.exports = router;
