const express = require("express");

const {
  sendCode,
  verifyCode,
  loginCustomer,
  verifySetupToken,
  setupPassword,
} = require("../controllers/customerAuthController");

const router = express.Router();

// Send email verification code
router.post("/send-code", sendCode);

// Verify email verification code
router.post("/verify-code", verifyCode);

// Customer Login
router.post("/login", loginCustomer);

// Verify initial setup token
router.get("/verify-setup-token", verifySetupToken);

// Set initial customer password
router.post("/setup-password", setupPassword);

module.exports = router;