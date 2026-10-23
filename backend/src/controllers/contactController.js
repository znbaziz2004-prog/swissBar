
const { pool } = require("../config/db");

/*
|--------------------------------------------------------------------------
| Public: Submit Contact Message
|--------------------------------------------------------------------------
*/
const createContactMessage = async (req, res) => {
  try {
    const { name, phone, email, message } = req.body;

    if (
      !name?.trim() ||
      !phone?.trim() ||
      !email?.trim() ||
      !message?.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "Name, phone, email and message are required.",
      });
    }

    await pool.query(
      `INSERT INTO contact_messages (name, phone, email, message)
       VALUES (?, ?, ?, ?)`,
      [
        name.trim(),
        phone.trim(),
        email.trim().toLowerCase(),
        message.trim(),
      ]
    );

    return res.status(201).json({
      success: true,
      message: "Your message has been sent successfully.",
    });
  } catch (error) {
    console.error("Create contact message error:", error);

    return res.status(500).json({
      success: false,
      message: "Could not send your message.",
    });
  }
};

/*
|--------------------------------------------------------------------------
| Super Admin: Get All Contact Messages
|--------------------------------------------------------------------------
*/
const getContactMessages = async (req, res) => {
  try {
    const [messages] = await pool.query(
      `SELECT id, name, phone, email, message, status,
              created_at, updated_at
       FROM contact_messages
       ORDER BY created_at DESC`
    );

    return res.json({
      success: true,
      data: { messages },
    });
  } catch (error) {
    console.error("Get contact messages error:", error);

    return res.status(500).json({
      success: false,
      message: "Could not load contact messages.",
    });
  }
};

/*
|--------------------------------------------------------------------------
| Super Admin: Update Message Status
|--------------------------------------------------------------------------
*/
const updateContactMessageStatus = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { status } = req.body;

    if (!Number.isInteger(id) || id < 1) {
      return res.status(400).json({
        success: false,
        message: "Invalid contact message ID.",
      });
    }

    if (!["new", "read", "replied"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Status must be new, read or replied.",
      });
    }

    const [result] = await pool.query(
      `UPDATE contact_messages
       SET status = ?
       WHERE id = ?`,
      [status, id]
    );

    if (result.affectedRows === 0) {
      const [rows] = await pool.query(
        "SELECT id FROM contact_messages WHERE id = ?",
        [id]
      );

      if (rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Contact message not found.",
        });
      }
    }

    return res.json({
      success: true,
      message: "Contact message status updated successfully.",
    });
  } catch (error) {
    console.error("Update contact message status error:", error);

    return res.status(500).json({
      success: false,
      message: "Could not update contact message status.",
    });
  }
};

module.exports = {
  createContactMessage,
  getContactMessages,
  updateContactMessageStatus,
};
