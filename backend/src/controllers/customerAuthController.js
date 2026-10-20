const bcrypt = require("bcryptjs");
const { pool } = require("../config/db")
const jwt = require("jsonwebtoken");

const {
  sendCustomerOtp,
  verifyCustomerOtp,
  
} = require("../services/customerOtpService");

// Send OTP
const sendCode = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const result = await sendCustomerOtp({
      email,
      purpose: "booking_verification",
    });

    return res.status(200).json(result);
  } catch (error) {
    console.error("Send customer OTP error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to send verification code",
    });
  }
};

// Verify OTP
const verifyCode = async (req, res) => {
  try {
    const {
      email,
      code,
      shopId,
    } = req.body;

    if (!email || !code) {
      return res.status(400).json({
        success: false,
        message: "Email and verification code are required",
      });
    }

    if (!shopId) {
      return res.status(400).json({
        success: false,
        message: "Shop ID is required",
      });
    }

    const result = await verifyCustomerOtp({
      email,
      code,
      purpose: "booking_verification",
      shopId,
    });

    return res.status(200).json(result);
  } catch (error) {
    console.error("Verify customer OTP error:", error);

    return res.status(400).json({
      success: false,
      message: error.message || "Verification failed",
    });
  }
};
const crypto = require("crypto");

// Customer Login
const loginCustomer = async (req, res) => {
  try {
    const { email, password, shopId } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    let query = `
      SELECT
        id,
        shop_id,
        name,
        phone,
        email,
        password_hash,
        email_verified_at,
        dashboard_enabled
      FROM customers
      WHERE email = ?
    `;
    const params = [normalizedEmail];

    if (shopId) {
      query += ` AND shop_id = ?`;
      params.push(shopId);
    }

    query += ` ORDER BY dashboard_enabled DESC, id DESC LIMIT 1`;

    const [customers] = await pool.execute(query, params);

    if (customers.length === 0) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const customer = customers[0];

    if (!customer.dashboard_enabled) {
      return res.status(403).json({
        success: false,
        message: "Customer dashboard access is not enabled. Please set up your password first.",
      });
    }

    if (!customer.password_hash) {
      return res.status(401).json({
        success: false,
        message: "Customer account does not have a password configured yet. Please use the setup password link.",
      });
    }

    const passwordMatch = await bcrypt.compare(
      password,
      customer.password_hash
    );

    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    if (!customer.email_verified_at) {
      return res.status(403).json({
        success: false,
        message: "Please verify your email before logging in",
      });
    }

    const token = jwt.sign(
      {
        customerId: customer.id,
        shopId: customer.shop_id,
        email: customer.email,
        role: "customer",
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    return res.status(200).json({
      success: true,
      message: "Customer login successful",
      data: {
        token,
        expiresIn: "7d",
        customer: {
          id: customer.id,
          shopId: customer.shop_id,
          name: customer.name,
          phone: customer.phone,
          email: customer.email,
        },
      },
    });
  } catch (error) {
    console.error("Customer login error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Customer login failed",
    });
  }
};

// Verify Password Setup Token
const verifySetupToken = async (req, res) => {
  try {
    const { token, email } = req.query;

    if (!token || !email) {
      return res.status(400).json({
        success: false,
        message: "Token and email are required",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

    const [rows] = await pool.execute(
      `
      SELECT
        t.id,
        t.customer_id,
        t.expires_at,
        t.used_at,
        c.name,
        c.email
      FROM customer_password_setup_tokens t
      INNER JOIN customers c ON c.id = t.customer_id
      WHERE c.email = ?
        AND t.token_hash = ?
      ORDER BY t.id DESC
      LIMIT 1
      `,
      [normalizedEmail, tokenHash]
    );

    if (rows.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid setup token or email address.",
      });
    }

    const record = rows[0];

    if (record.used_at) {
      return res.status(400).json({
        success: false,
        message: "This setup link has already been used. Please log in directly.",
      });
    }

    if (new Date(record.expires_at) < new Date()) {
      return res.status(400).json({
        success: false,
        message: "This setup link has expired. Please request a new setup link.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Token is valid",
      data: {
        customerName: record.name,
        email: record.email,
      },
    });
  } catch (error) {
    console.error("Verify setup token error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to verify setup token",
    });
  }
};

// Setup Initial Customer Password
const setupPassword = async (req, res) => {
  try {
    const { token, email, password } = req.body;

    if (!token || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Token, email, and password are required.",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters long.",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

    const [rows] = await pool.execute(
      `
      SELECT
        t.id AS token_id,
        t.customer_id,
        t.expires_at,
        t.used_at,
        c.id,
        c.shop_id,
        c.name,
        c.email
      FROM customer_password_setup_tokens t
      INNER JOIN customers c ON c.id = t.customer_id
      WHERE c.email = ?
        AND t.token_hash = ?
      ORDER BY t.id DESC
      LIMIT 1
      `,
      [normalizedEmail, tokenHash]
    );

    if (rows.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid setup token or email address.",
      });
    }

    const record = rows[0];

    if (record.used_at) {
      return res.status(400).json({
        success: false,
        message: "This setup link has already been used.",
      });
    }

    if (new Date(record.expires_at) < new Date()) {
      return res.status(400).json({
        success: false,
        message: "This setup link has expired.",
      });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    // Update customer password & enable dashboard
    await pool.execute(
      `
      UPDATE customers
      SET
        password_hash = ?,
        dashboard_enabled = 1,
        email_verified_at = IFNULL(email_verified_at, CURRENT_TIMESTAMP),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
      `,
      [passwordHash, record.customer_id]
    );

    // Mark token as used
    await pool.execute(
      `
      UPDATE customer_password_setup_tokens
      SET used_at = CURRENT_TIMESTAMP
      WHERE id = ?
      `,
      [record.token_id]
    );

    return res.status(200).json({
      success: true,
      message: "Password set successfully! You can now sign in to your dashboard.",
    });
  } catch (error) {
    console.error("Setup password error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to set up password",
    });
  }
};

module.exports = {
  sendCode,
  verifyCode,
  loginCustomer,
  verifySetupToken,
  setupPassword,
};