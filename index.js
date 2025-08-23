const express = require("express");
const cors = require("cors");
const twilio = require("twilio");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Twilio configuration
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const apiKey = process.env.TWILIO_API_KEY;
const apiSecret = process.env.TWILIO_API_SECRET;
const twimlAppSid = process.env.TWILIO_TWIML_APP_SID;

// Validate required environment variables
const requiredEnvVars = [
  "TWILIO_ACCOUNT_SID",
  "TWILIO_API_KEY",
  "TWILIO_API_SECRET",
  "TWILIO_TWIML_APP_SID",
];
const missingVars = requiredEnvVars.filter((varName) => !process.env[varName]);

if (missingVars.length > 0) {
  console.error(
    "❌ Missing required environment variables:",
    missingVars.join(", ")
  );
  console.error(
    "Please check your .env file and ensure all required variables are set."
  );
  process.exit(1);
}

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({
    status: "healthy",
    twilioConfigured: !!(accountSid && apiKey && apiSecret && twimlAppSid),
    timestamp: new Date().toISOString(),
  });
});

// Generate Twilio Voice access token
app.get("/token", (req, res) => {
  try {
    const { identity } = req.query;

    if (!identity) {
      return res.status(400).json({
        error: "Missing required parameter: identity",
        message: "Please provide an identity parameter in the query string",
      });
    }

    // Create access token
    const accessToken = new twilio.jwt.AccessToken(
      accountSid,
      apiKey,
      apiSecret,
      { identity }
    );

    // Create Voice grant
    const voiceGrant = new twilio.jwt.AccessToken.VoiceGrant({
      outgoingApplicationSid: twimlAppSid,
      incomingAllow: true,
    });

    // Add Voice grant to token
    accessToken.addGrant(voiceGrant);

    // Generate token
    const token = accessToken.toJwt();

    res.json({
      token,
      identity,
      success: true,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error generating token:", error);
    res.status(500).json({
      error: "Failed to generate access token",
      message: error.message,
      success: false,
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Server error:", err.stack);
  res.status(500).json({
    error: "Internal server error",
    message: err.message,
    success: false,
  });
});

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({
    error: "Endpoint not found",
    message: `The requested endpoint ${req.originalUrl} does not exist`,
    success: false,
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Twilio Voice API server running on port ${PORT}`);
  console.log(
    `📱 Twilio configured: ${!!(
      accountSid &&
      apiKey &&
      apiSecret &&
      twimlAppSid
    )}`
  );
  console.log(`🌐 API available at: http://localhost:${PORT}`);
  console.log(
    `🔑 Token endpoint: http://localhost:${PORT}/token?identity=YOUR_IDENTITY`
  );
  console.log(`💚 Health check: http://localhost:${PORT}/health`);
});
