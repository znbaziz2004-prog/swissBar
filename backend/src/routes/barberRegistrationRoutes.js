const express = require("express");

const {
  registerBarber,
  getRegistrations,
  getRegistration,
  approveRegistration,
  rejectRegistration,
  validatePaymentToken,
} = require("../controllers/barberRegistrationController");

const router = express.Router();

// Public barber/shop registration
router.post("/register", registerBarber);
router.post("/validate-payment-token", validatePaymentToken);

module.exports = router;