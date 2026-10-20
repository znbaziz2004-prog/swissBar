const stripe = require("../config/stripe");
const { pool } = require("../config/db");

/*
|--------------------------------------------------------------------------
| Subscription Checkout
|--------------------------------------------------------------------------
*/

const createCheckoutSession = async (req, res) => {
  try {
    if (!stripe) {
      return res.status(503).json({
        success: false,
        message:
          "Stripe is not configured yet. Add STRIPE_SECRET_KEY to .env.",
      });
    }

    const { subscriptionId, locale } = req.body;

const supportedLocales = ["en", "de", "fr", "it"];

const stripeLocale = supportedLocales.includes(
  String(locale || "").toLowerCase()
)
  ? String(locale).toLowerCase()
  : "auto";

    if (!subscriptionId) {
      return res.status(400).json({
        success: false,
        message: "Subscription ID is required.",
      });
    }

    const [subscriptions] = await pool.query(
      `
      SELECT
        ss.id,
        ss.shop_id,
        ss.plan_id,
        ss.status,
        sp.name AS plan_name,
        sp.monthly_price,
        sp.currency,
        bs.name AS shop_name
      FROM shop_subscriptions ss
      JOIN subscription_plans sp
        ON sp.id = ss.plan_id
      JOIN barber_shops bs
        ON bs.id = ss.shop_id
      WHERE ss.id = ?
      LIMIT 1
      `,
      [Number(subscriptionId)]
    );

    if (subscriptions.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Subscription not found.",
      });
    }

    const subscription = subscriptions[0];
    // Verify that the logged-in user owns this shop
if (req.user?.role !== "super_admin") {
  const [ownedShops] = await pool.query(
    `SELECT id
     FROM barber_shops
     WHERE id = ?
       AND owner_id = ?
     LIMIT 1`,
    [subscription.shop_id, req.user?.id]
  );

  if (ownedShops.length === 0) {
    return res.status(403).json({
      success: false,
      message: "You do not have access to this subscription.",
    });
  }
}

// Only pending subscriptions can start checkout
if (subscription.status !== "pending") {
  return res.status(409).json({
    success: false,
    message: "This subscription is not pending payment.",
    data: {
      subscriptionStatus: subscription.status,
    },
  });
}

    const amount = Number(subscription.monthly_price);

    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid subscription amount.",
      });
    }

    const currency = (
      subscription.currency || "CHF"
    ).toLowerCase();

    const session = await stripe.checkout.sessions.create({
      
      mode: "payment",
      locale: stripeLocale,
      


      line_items: [
        {
          price_data: {
            currency,
            product_data: {
              name: `${subscription.plan_name} Subscription`,
              description: subscription.shop_name,
            },
            unit_amount: Math.round(amount * 100),
          },
          quantity: 1,
        },
      ],

      success_url: `${(process.env.APP_URL || "http://127.0.0.1:8000").replace(/\/$/, "")}/subscription/payment?success=true&session_id={CHECKOUT_SESSION_ID}`,
cancel_url: `${(process.env.APP_URL || "http://localhost:8000").replace(/\/$/, "")}/subscription/payment?cancelled=true`,
      metadata: {
        paymentType: "subscription",
        subscriptionId: String(subscription.id),
        shopId: String(subscription.shop_id),
        planId: String(subscription.plan_id),
      },
    });

    return res.status(200).json({
      success: true,
      message: "Stripe Checkout session created successfully.",
      data: {
        sessionId: session.id,
        checkoutUrl: session.url,
        subscriptionId: subscription.id,
        amount,
        currency: subscription.currency || "CHF",
      },
    });
  } catch (error) {
    console.error("Stripe Checkout Error:", error);

    return res.status(500).json({
      success: false,
      message: "Could not create Stripe Checkout session.",
      error: error.message,
    });
  }
};


/*
|--------------------------------------------------------------------------
| Appointment Checkout
|--------------------------------------------------------------------------
*/

const createAppointmentCheckoutSession = async (req, res) => {
  try {
    if (!stripe) {
      return res.status(503).json({
        success: false,
        message:
          "Stripe is not configured yet. Add STRIPE_SECRET_KEY to .env.",
      });
    }

    const { appointmentId } = req.body;

    if (!appointmentId) {
      return res.status(400).json({
        success: false,
        message: "Appointment ID is required.",
      });
    }

    /*
    |--------------------------------------------------------------------------
    | Get appointment
    |--------------------------------------------------------------------------
    */

    const [appointments] = await pool.query(
      `
      SELECT
        a.id,
        a.shop_id,
        a.customer_id,
        a.total_amount,
        a.currency,
        a.status,
        a.appointment_date,
        a.start_time,
        a.end_time,

        bs.name AS shop_name,

        c.name AS customer_name,
        c.email AS customer_email

      FROM appointments a

      INNER JOIN barber_shops bs
        ON bs.id = a.shop_id

      INNER JOIN customers c
        ON c.id = a.customer_id

      WHERE a.id = ?

      LIMIT 1
      `,
      [Number(appointmentId)]
    );

    if (appointments.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found.",
      });
    }

    const appointment = appointments[0];

    /*
    |--------------------------------------------------------------------------
    | Shop Access
    |--------------------------------------------------------------------------
    */

    if (
      req.user.role !== "super_admin" &&
      req.shopId !== appointment.shop_id
    ) {
      return res.status(403).json({
        success: false,
        message: "You do not have access to this appointment.",
      });
    }

    /*
    |--------------------------------------------------------------------------
    | Validate Amount
    |--------------------------------------------------------------------------
    */

    const amount = Number(appointment.total_amount);

    if (!Number.isFinite(amount) || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid appointment payment amount.",
      });
    }

    const currency = (
      appointment.currency || "CHF"
    ).toLowerCase();

    /*
    |--------------------------------------------------------------------------
    | Prevent Duplicate Active Payment
    |--------------------------------------------------------------------------
    */

    const [existingPayments] = await pool.query(
      `
      SELECT
        id,
        status
      FROM payments
      WHERE appointment_id = ?
        AND status IN ('pending', 'paid')
      ORDER BY id DESC
      LIMIT 1
      `,
      [appointment.id]
    );

    if (existingPayments.length > 0) {
      return res.status(409).json({
        success: false,
        message:
          "An active payment already exists for this appointment.",
        data: {
          paymentId: existingPayments[0].id,
          status: existingPayments[0].status,
        },
      });
    }

    /*
    |--------------------------------------------------------------------------
    | Create Stripe Checkout Session
    |--------------------------------------------------------------------------
    */

    const session = await stripe.checkout.sessions.create({
      
      mode: "payment",
      locale: stripeLocale,

      customer_email:
        appointment.customer_email || undefined,

      line_items: [
        {
          price_data: {
            currency,

            product_data: {
              name: `${appointment.shop_name} Appointment`,

              description:
                `${appointment.appointment_date} at ${appointment.start_time}`,
            },

            unit_amount: Math.round(amount * 100),
          },

          quantity: 1,
        },
      ],
      

      success_url:
        `${(process.env.ADMIN_PANEL_URL || process.env.APP_URL || "http://localhost:5173").replace(/\/$/, "")}/admin/payments?success=true&session_id={CHECKOUT_SESSION_ID}`,

      cancel_url:
        `${(process.env.ADMIN_PANEL_URL || process.env.APP_URL || "http://localhost:5173").replace(/\/$/, "")}/admin/payments?cancelled=true`,

      metadata: {
        paymentType: "appointment",
        appointmentId: String(appointment.id),
        shopId: String(appointment.shop_id),
        customerId: String(appointment.customer_id),
      },
    });

    /*
    |--------------------------------------------------------------------------
    | Create Pending Payment Record
    |--------------------------------------------------------------------------
    */

    await pool.query(
      `
      INSERT INTO payments
      (
        appointment_id,
        amount,
        currency,
        method,
        status,
        transaction_reference
      )
      VALUES (?, ?, ?, 'stripe', 'pending', ?)
      `,
      [
        appointment.id,
        amount,
        appointment.currency || "CHF",
        session.id,
      ]
    );

    return res.status(200).json({
      success: true,
      message:
        "Appointment Stripe Checkout session created successfully.",

      data: {
        sessionId: session.id,
        checkoutUrl: session.url,
        appointmentId: appointment.id,
        amount,
        currency: appointment.currency || "CHF",
        customerEmail: appointment.customer_email,
      },
    });

  } catch (error) {
    console.error(
      "Appointment Stripe Checkout Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Could not create appointment Stripe Checkout session.",
      error: error.message,
    });
  }
};
// Reconcile an existing successful Stripe subscription payment
const reconcileSubscriptionPayment = async (req, res) => {
  try {
    if (!stripe) {
      return res.status(503).json({
        success: false,
        message: "Stripe is not configured.",
      });
    }

    const { sessionId } = req.body;

    if (!sessionId || !sessionId.startsWith("cs_test_")) {
      return res.status(400).json({
        success: false,
        message: "A valid Stripe test Checkout Session ID is required.",
      });
    }

    // Retrieve the existing session from Stripe
    const session =
      await stripe.checkout.sessions.retrieve(sessionId);

    if (
      session.payment_status !== "paid" ||
      session.status !== "complete"
    ) {
      return res.status(400).json({
        success: false,
        message: "Stripe confirms this session is not paid and complete.",
      });
    }

    if (session.metadata?.paymentType !== "subscription") {
      return res.status(400).json({
        success: false,
        message: "This session is not a subscription payment.",
      });
    }

    const subscriptionId = Number(
      session.metadata.subscriptionId
    );

    if (!subscriptionId) {
      return res.status(400).json({
        success: false,
        message: "Subscription ID is missing from Stripe metadata.",
      });
    }

    const [rows] = await pool.query(
      `SELECT
         ss.id,
         ss.shop_id,
         ss.plan_id,
         sp.monthly_price,
         sp.currency
       FROM shop_subscriptions ss
       JOIN subscription_plans sp
         ON sp.id = ss.plan_id
       WHERE ss.id = ?
       LIMIT 1`,
      [subscriptionId]
    );

    if (!rows.length) {
      return res.status(404).json({
        success: false,
        message: "Subscription not found.",
      });
    }

    const subscription = rows[0];
    // Verify Stripe metadata matches the database subscription
if (
  Number(session.metadata.shopId) !== Number(subscription.shop_id) ||
  Number(session.metadata.planId) !== Number(subscription.plan_id)
) {
  return res.status(400).json({
    success: false,
    message: "Stripe session does not match this subscription.",
  });
}

// Verify the logged-in user owns this shop
if (req.user?.role !== "super_admin") {
  const [ownedShops] = await pool.query(
    `SELECT id
     FROM barber_shops
     WHERE id = ?
       AND owner_id = ?
     LIMIT 1`,
    [subscription.shop_id, req.user?.id]
  );

  if (ownedShops.length === 0) {
    return res.status(403).json({
      success: false,
      message: "You do not have access to this subscription payment.",
    });
  }
}

// Verify payment amount and currency

    // Verify payment amount and currency
    const expectedAmount = Math.round(
      Number(subscription.monthly_price) * 100
    );

    const expectedCurrency = (
      subscription.currency || "CHF"
    ).toLowerCase();

    if (
      session.amount_total !== expectedAmount ||
      session.currency !== expectedCurrency
    ) {
      return res.status(400).json({
        success: false,
        message: "Payment amount or currency does not match the plan.",
      });
    }

    const transactionReference =
      session.payment_intent || session.id;

    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();

      const [existing] = await connection.query(
        `SELECT id
         FROM subscription_payments
         WHERE transaction_reference = ?
         LIMIT 1`,
        [transactionReference]
      );

      if (!existing.length) {
        await connection.query(
          `INSERT INTO subscription_payments
           (
             subscription_id,
             amount,
             currency,
             status,
             payment_method,
             transaction_reference,
             paid_at
           )
           VALUES (?, ?, ?, 'paid', 'stripe', ?, NOW())`,
          [
            subscriptionId,
            Number(session.amount_total) / 100,
            session.currency.toUpperCase(),
            transactionReference,
          ]
        );
      }

      await connection.query(
        `UPDATE shop_subscriptions
         SET status = 'active',
             start_date = COALESCE(start_date, CURDATE()),
             updated_at = NOW()
         WHERE id = ?`,
        [subscriptionId]
      );

      await connection.commit();

      return res.status(200).json({
        success: true,
        message: existing.length
          ? "Payment was already recorded; subscription is active."
          : "Existing Stripe payment verified and recorded.",
        data: {
          subscriptionId,
          sessionId: session.id,
          amount: Number(session.amount_total) / 100,
          currency: session.currency.toUpperCase(),
          paymentRecorded: true,
        },
      });
    } catch (dbError) {
      await connection.rollback();
      throw dbError;
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error(
      "Subscription Reconciliation Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Could not reconcile the Stripe payment.",
      error: error.message,
    });
  }
};
const reconcileRegistrationPayment = async (req, res) => {
  try {
    if (!stripe) {
      return res.status(503).json({
        success: false,
        message: "Stripe is not configured.",
      });
    }

    const { sessionId } = req.body;
    const user = req.user;

    if (
      !user ||
      user.role !== "owner" ||
      user.purpose !== "registration_payment" ||
      !user.id ||
      !user.shopId ||
      !user.subscriptionId
    ) {
      return res.status(403).json({
        success: false,
        message: "Valid registration payment token required.",
      });
    }

    if (
      typeof sessionId !== "string" ||
      !sessionId.startsWith("cs_test_")
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid Stripe test session ID.",
      });
    }

    const session =
      await stripe.checkout.sessions.retrieve(sessionId);

    if (
      session.payment_status !== "paid" ||
      session.status !== "complete"
    ) {
      return res.status(400).json({
        success: false,
        message: "Payment has not been completed.",
      });
    }

    const subscriptionId = Number(user.subscriptionId);
    const shopId = Number(user.shopId);

    if (
      session.metadata?.paymentType !== "subscription" ||
      Number(session.metadata.subscriptionId) !== subscriptionId ||
      Number(session.metadata.shopId) !== shopId
    ) {
      return res.status(400).json({
        success: false,
        message: "Stripe session does not match this registration.",
      });
    }

    const [rows] = await pool.query(
      `SELECT
         ss.id,
         ss.shop_id,
         ss.plan_id,
         sp.monthly_price,
         sp.currency
       FROM shop_subscriptions ss
       JOIN subscription_plans sp ON sp.id = ss.plan_id
       JOIN barber_shops bs ON bs.id = ss.shop_id
       WHERE ss.id = ?
         AND ss.shop_id = ?
         AND bs.owner_id = ?
       LIMIT 1`,
      [subscriptionId, shopId, Number(user.id)]
    );

    if (!rows.length) {
      return res.status(404).json({
        success: false,
        message: "Registration subscription not found.",
      });
    }

    const subscription = rows[0];

    if (
      session.amount_total !==
        Math.round(Number(subscription.monthly_price) * 100) ||
      session.currency !==
        String(subscription.currency || "CHF").toLowerCase()
    ) {
      return res.status(400).json({
        success: false,
        message: "Payment amount or currency does not match the plan.",
      });
    }

    const transactionReference =
      session.payment_intent || session.id;

    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();

      const [existing] = await connection.query(
        `SELECT id, subscription_id
         FROM subscription_payments
         WHERE transaction_reference = ?
         LIMIT 1`,
        [transactionReference]
      );

      if (
        existing.length &&
        Number(existing[0].subscription_id) !== subscriptionId
      ) {
        await connection.rollback();

        return res.status(409).json({
          success: false,
          message: "This payment has already been used.",
        });
      }

      if (!existing.length) {
        await connection.query(
          `INSERT INTO subscription_payments
           (
             subscription_id,
             amount,
             currency,
             status,
             payment_method,
             transaction_reference,
             paid_at
           )
           VALUES (?, ?, ?, 'paid', 'stripe', ?, NOW())`,
          [
            subscriptionId,
            Number(session.amount_total) / 100,
            session.currency.toUpperCase(),
            transactionReference,
          ]
        );
      }

      await connection.query(
        `UPDATE shop_subscriptions
         SET status = 'active',
             start_date = COALESCE(start_date, CURDATE()),
             updated_at = NOW()
         WHERE id = ?`,
        [subscriptionId]
      );

      await connection.commit();

      return res.json({
        success: true,
        message: "Registration payment verified.",
        data: {
          subscriptionId,
          sessionId: session.id,
          paymentRecorded: true,
          approvalStatus: "pending",
        },
      });
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error(
      "Registration payment reconciliation error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Could not verify registration payment.",
    });
  }
};


module.exports = {
  createCheckoutSession,
  createAppointmentCheckoutSession,
  reconcileSubscriptionPayment,
  reconcileRegistrationPayment,
};