const express = require("express");
const cors = require("cors");
require("dotenv").config();

// Twilio configuration
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

// Initialize Twilio client
const twilio = require("twilio");
const client = twilio(accountSid, authToken);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get("/", (req, res) => {
  res.json({
    message: "Twilio Node.js API is running!",
    status: "success",
    timestamp: new Date().toISOString(),
  });
});

// Send SMS endpoint
app.post("/send-sms", async (req, res) => {
  try {
    const { to, message } = req.body;

    if (!to || !message) {
      return res.status(400).json({
        error: "Missing required fields: to and message",
      });
    }

    const smsResponse = await client.messages.create({
      body: message,
      from: twilioPhoneNumber,
      to: to,
    });

    res.json({
      success: true,
      message: "SMS sent successfully",
      sid: smsResponse.sid,
      status: smsResponse.status,
    });
  } catch (error) {
    console.error("Error sending SMS:", error);
    res.status(500).json({
      error: "Failed to send SMS",
      details: error.message,
    });
  }
});

// Make voice call endpoint
app.post("/make-call", async (req, res) => {
  try {
    const { to, twimlUrl } = req.body;

    if (!to || !twimlUrl) {
      return res.status(400).json({
        error: "Missing required fields: to and twimlUrl",
      });
    }

    const callResponse = await client.calls.create({
      url: twimlUrl,
      from: twilioPhoneNumber,
      to: to,
    });

    res.json({
      success: true,
      message: "Call initiated successfully",
      sid: callResponse.sid,
      status: callResponse.status,
    });
  } catch (error) {
    console.error("Error making call:", error);
    res.status(500).json({
      error: "Failed to make call",
      details: error.message,
    });
  }
});

// Get message history
app.get("/messages", async (req, res) => {
  try {
    const messages = await client.messages.list({
      limit: 20,
    });

    res.json({
      success: true,
      messages: messages.map((msg) => ({
        sid: msg.sid,
        from: msg.from,
        to: msg.to,
        body: msg.body,
        status: msg.status,
        dateCreated: msg.dateCreated,
      })),
    });
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({
      error: "Failed to fetch messages",
      details: error.message,
    });
  }
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({
    status: "healthy",
    twilioConfigured: !!(accountSid && authToken),
    timestamp: new Date().toISOString(),
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: "Something went wrong!",
    message: err.message,
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📱 Twilio configured: ${!!(accountSid && authToken)}`);
  console.log(`🌐 API available at: http://localhost:${PORT}`);
});
