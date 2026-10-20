const express = require("express");
const cors = require("cors");
const path = require("path");
const dotenv = require("dotenv");

// Load .env from backend directory and root directory explicitly
dotenv.config({ path: path.resolve(__dirname, "../../.env") });
dotenv.config({ path: path.resolve(__dirname, "../.env") });
dotenv.config({ path: path.resolve(process.cwd(), ".env") });

const { pool, testConnection } = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const shopRoutes = require("./routes/shopRoutes");
const branchRoutes = require("./routes/branchRoutes");
const serviceRoutes = require("./routes/serviceRoutes");
const staffRoutes = require("./routes/staffRoutes");
const staffServiceRoutes = require("./routes/staffServiceRoutes");
const workingHoursRoutes = require("./routes/workingHoursRoutes");
const blockedTimeRoutes = require("./routes/blockedTimeRoutes");
const availabilityRoutes = require("./routes/availabilityRoutes");
const appointmentRoutes = require("./routes/appointmentRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const customerRoutes = require("./routes/customerRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const adminOwnerRoutes = require("./routes/adminOwnerRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const reportRoutes = require("./routes/reportRoutes");
const contentRoutes = require("./routes/contentRoutes");
const customerAuthRoutes = require("./routes/customerAuthRoutes");
const customerDashboardRoutes = require("./routes/customerDashboardRoutes");
const barberRegistrationRoutes = require("./routes/barberRegistrationRoutes");
const subscriptionPaymentRoutes = require("./routes/subscriptionPaymentRoutes");
const subscriptionPlanRoutes = require("./routes/subscriptionPlanRoutes");
const publicShopRoutes = require("./routes/publicShopRoutes");
const subscriptionRoutes = require("./routes/subscriptionRoutes");
const settingsRoutes = require("./routes/settingsRoutes");
const stripeRoutes = require("./routes/stripeRoutes");
const contactRoutes = require("./routes/contactRoutes");
const barberTestimonialRoutes = require("./routes/barberTestimonialRoutes");
const adminBarberTestimonialRoutes = require("./routes/adminBarberTestimonialRoutes");

const app = express();

// Trust proxy for cPanel / Passenger / Reverse Proxy
app.set("trust proxy", true);

app.use(cors());

// Stripe raw webhook handling (must be before express.json())
app.use(
  "/api/stripe/webhook",
  express.raw({ type: "application/json" })
);
app.use(
  "/stripe/webhook",
  express.raw({ type: "application/json" })
);

app.use(express.json());

// Health check handler
const healthCheckHandler = async (req, res) => {
  let dbStatus = "connected";
  let dbMessage = "MySQL database is connected";
  try {
    const connection = await pool.getConnection();
    await connection.query("SELECT 1 AS healthy");
    connection.release();
  } catch (error) {
    dbStatus = "disconnected";
    dbMessage = error.message;
  }

  res.status(200).json({
    success: true,
    status: dbStatus === "connected" ? "healthy" : "degraded",
    message: "Swiss Barber Backend API is running",
    timestamp: new Date().toISOString(),
    uptime: Math.floor(process.uptime()),
    database: {
      status: dbStatus,
      message: dbMessage,
    },
    environment: process.env.NODE_ENV || "production",
  });
};

// Database test handler
const testDbHandler = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT 1 AS connected");
    res.json({
      success: true,
      message: "MySQL database is connected",
      data: rows,
    });
  } catch (error) {
    console.error("Test DB error:", error);
    res.status(500).json({
      success: false,
      message: "Database connection failed",
      error: error.message,
    });
  }
};

// Create unified API router
const apiRouter = express.Router();

// Register health check & test-db on router
apiRouter.get("/health", healthCheckHandler);
apiRouter.get("/test-db", testDbHandler);
apiRouter.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Swiss Barber Backend API is running",
    docs: "/api/health",
  });
});

// Register feature routes on router
apiRouter.use("/auth", authRoutes);
apiRouter.use("/shops", shopRoutes);
apiRouter.use("/branches", branchRoutes);
apiRouter.use("/services", serviceRoutes);
apiRouter.use("/staff", staffRoutes);
apiRouter.use("/staff", staffServiceRoutes);
apiRouter.use("/working-hours", workingHoursRoutes);
apiRouter.use("/blocked-times", blockedTimeRoutes);
apiRouter.use("/availability", availabilityRoutes);
apiRouter.use("/appointments", appointmentRoutes);
apiRouter.use("/notifications", notificationRoutes);
apiRouter.use("/customers", customerRoutes);
apiRouter.use("/dashboard", dashboardRoutes);
apiRouter.use("/reviews", reviewRoutes);
apiRouter.use("/admin/owners", adminOwnerRoutes);
apiRouter.use("/payments", paymentRoutes);
apiRouter.use("/reports", reportRoutes);
apiRouter.use("/content", contentRoutes);
apiRouter.use("/customer-auth", customerAuthRoutes);
apiRouter.use("/customer-dashboard", customerDashboardRoutes);
apiRouter.use("/barber-registration", barberRegistrationRoutes);
apiRouter.use("/subscription-payments", subscriptionPaymentRoutes);
apiRouter.use("/subscription-plans", subscriptionPlanRoutes);
apiRouter.use("/public/shops", publicShopRoutes);
apiRouter.use("/subscriptions", subscriptionRoutes);
apiRouter.use("/settings", settingsRoutes);
apiRouter.use("/stripe", stripeRoutes);
apiRouter.use("/contact", contactRoutes);
apiRouter.use("/barber-testimonials", barberTestimonialRoutes);
apiRouter.use("/admin/barber-testimonials", adminBarberTestimonialRoutes);

// Dual-mounting: Supports both /api/* AND direct /* routing (prevents Passenger BaseURI stripping 404s)
app.use("/api", apiRouter);
app.use("/", apiRouter);

// Fallback error handler
app.use((err, req, res, next) => {
  console.error("Server error:", err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal server error",
  });
});

const PORT = process.env.PORT || 5000;

// Immediate listener binding supporting Phusion Passenger and standalone port
if (typeof PhusionPassenger !== "undefined") {
  app.listen("passenger", () => {
    console.log("🚀 Swiss Barber API server running under Phusion Passenger");
  });
} else {
  app.listen(PORT, () => {
    console.log(`🚀 Swiss Barber API server running on port ${PORT}`);
  });
}

// Non-blocking background initial DB connection test
testConnection().catch((error) => {
  console.warn("⚠️ Initial DB connection test notice:", error.message);
});

module.exports = app;