const express = require("express");

const {
  createCheckoutSession,
  createAppointmentCheckoutSession,
  reconcileSubscriptionPayment,
  reconcileRegistrationPayment,
  
} = require("../controllers/stripeController");

const {
  handleStripeWebhook,
} = require("../controllers/stripeWebhookController");

const authMiddleware = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const router = express.Router();

// Subscription Payment
router.post(
  "/create-checkout-session",
  authMiddleware,
  createCheckoutSession
);

// Reconcile Existing Subscription Payment
router.post(
  "/reconcile-subscription-payment",
  authMiddleware,
  authorizeRoles("super_admin", "owner"),
  reconcileSubscriptionPayment
);

router.post(
  "/reconcile-registration-payment",
  authMiddleware,
  reconcileRegistrationPayment
);

// Appointment Payment
router.post(
  "/create-appointment-checkout",
  authMiddleware,
  createAppointmentCheckoutSession
);

// Stripe Webhook
router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  handleStripeWebhook
);

module.exports = router;