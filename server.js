require("dotenv").config();
const express = require("express");
const cors = require("cors");
const twilio = require("twilio");
const { MessagingResponse } = twilio.twiml;

const app = express();
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Debug environment variables
console.log("=== Environment Check ===");
console.log(
  "TWILIO_ACCOUNT_SID:",
  process.env.TWILIO_ACCOUNT_SID ? "Set" : "MISSING"
);
console.log(
  "TWILIO_API_KEY_SID:",
  process.env.TWILIO_API_KEY_SID ? "Set" : "MISSING"
);
console.log(
  "TWILIO_API_KEY_SECRET:",
  process.env.TWILIO_API_KEY_SECRET ? "Set" : "MISSING"
);
console.log(
  "TWILIO_TWIML_APP_SID:",
  process.env.TWILIO_TWIML_APP_SID ? "Set" : "MISSING"
);
console.log("TWILIO_NUMBER:", process.env.TWILIO_NUMBER || "MISSING");
console.log("========================\n");

app.get("/token", (req, res) => {
  try {
    const AccessToken = twilio.jwt.AccessToken;
    const VoiceGrant = AccessToken.VoiceGrant;

    const token = new AccessToken(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_API_KEY_SID,
      process.env.TWILIO_API_KEY_SECRET,
      { identity: "user123" } // frontend identity
    );

    const voiceGrant = new VoiceGrant({
      outgoingApplicationSid: process.env.TWILIO_TWIML_APP_SID,
      incomingAllow: true,
    });

    token.addGrant(voiceGrant);

    res.send({ token: token.toJwt() });
  } catch (error) {
    console.error("Token generation error:", error);
    res.status(500).json({ error: "Failed to generate token" });
  }
});
app.post("/calls/forward", async (req, res) => {
  const { ConferenceSid, NewNumber, core_call_number } = req.body;

  const client_ = twilio(
    process.env.TWILIO_ACCOUNT_SID, // ACxxx
    process.env.TWILIO_AUTH_TOKEN // from Twilio console
  );

  try {
    const participant = await client_
      .conferences(ConferenceSid)
      .participants.create({
        to: NewNumber,
        from: core_call_number,
        earlyMedia: true,
        endConferenceOnExit: false,
        muted: false,
        hold: false,
        beep: "onEnter",
      });

    // participant.callSid
    // ConferenceSid
    const callSid = participant.callSid;

    // Step 2: Poll until status = in-progress or timeout
    let status = "queued";
    let attempts = 0;

    while (status !== "in-progress" && attempts < 10) {
      const call = await client_.calls(callSid).fetch();
      status = call.status; // ringing / in-progress / completed
      console.log("Current status:", status);

      if (status === "in-progress") break;

      // wait 2 sec before next check
      await new Promise((resolve) => setTimeout(resolve, 2000));
      attempts++;
    }

    res.json({
      success: true,
      sid: callSid,
      ConferenceSid: participant.conferenceSid,
      finalStatus: status,
    });
  } catch (err) {
    res.json({ success: false, error: err.message });
  }
  // try {
  //   const AccessToken = twilio.jwt.AccessToken;
  //   const VoiceGrant = AccessToken.VoiceGrant;

  //   const token = new AccessToken(
  //     process.env.TWILIO_ACCOUNT_SID,
  //     process.env.TWILIO_API_KEY_SID,
  //     process.env.TWILIO_API_KEY_SECRET,
  //     { identity: "user123" } // frontend identity
  //   );

  //   const voiceGrant = new VoiceGrant({
  //     outgoingApplicationSid: process.env.TWILIO_TWIML_APP_SID,
  //     incomingAllow: true,
  //   });

  //   token.addGrant(voiceGrant);

  //   res.send({ token: token.toJwt() });
  // } catch (error) {
  //   console.error("Token generation error:", error);
  //   res.status(500).json({ error: "Failed to generate token" });
  // }
});

app.post("/voice", (req, res) => {
  try {
    const { VoiceResponse } = require("twilio").twiml;
    const vr = new VoiceResponse();

    // Get the 'To' parameter from the request
    const to = req.body.To || req.query.To;

    if (!to) {
      console.error("No 'To' parameter provided");
      return res.status(400).send("Missing 'To' parameter");
    }

    console.log(`Incoming call request to: ${to}`);

    const dial = vr.dial({
      callerId: process.env.TWILIO_NUMBER, // your Twilio number
      timeout: 30, // 30 second timeout
    });

    // Handle different types of destinations
    if (to.startsWith("client:")) {
      // Client-to-client call
      dial.client(to.substring(7));
    } else if (to.match(/^\+?\d{7,15}$/)) {
      // PSTN call - allow numbers with or without +
      const cleanNumber = to.startsWith("+") ? to : `+${to}`;
      console.log(`Dialing number: ${cleanNumber}`);
      dial.number(cleanNumber);
    } else {
      console.error(`Invalid destination: ${to}`);
      return res.status(400).send("Invalid destination format");
    }

    res.type("text/xml");
    res.send(vr.toString());
  } catch (error) {
    console.error("Voice webhook error:", error);
    res.status(500).send("Internal server error");
  }
});

// DTMF handler for call forwarding
app.post("/dtmf-handler", (req, res) => {
  try {
    const { VoiceResponse } = require("twilio").twiml;
    const vr = new VoiceResponse();

    const digits = req.body.Digits;
    console.log(`DTMF received: ${digits}`);

    if (digits === "9") {
      // Call forwarding logic
      console.log("Call forwarding requested to +916353791329");

      vr.say("Call is being forwarded to the forwarding number");

      const dial = vr.dial({
        callerId: process.env.TWILIO_NUMBER,
        timeout: 30,
        action: "/call-status",
        method: "POST",
      });

      // Forward to another number (you can customize this)
      dial.number("+916353791329"); // Your forwarding number
    } else {
      // Continue with original call
      vr.say("Invalid option. Continuing with the call.");

      // You can add logic here to continue the original call
      const dial = vr.dial({
        callerId: process.env.TWILIO_NUMBER,
        timeout: 30,
      });

      // You might want to store the original number and dial it again
      // For now, we'll just say goodbye
      vr.say("Call ended.");
    }

    res.type("text/xml");
    res.send(vr.toString());
  } catch (error) {
    console.error("DTMF handler error:", error);
    res.status(500).send("Internal server error");
  }
});

// Call status handler
app.post("/call-status", (req, res) => {
  console.log("Call status:", req.body.CallStatus);
  res.sendStatus(200);
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    timestamp: new Date().toISOString(),
    env_check: {
      account_sid: !!process.env.TWILIO_ACCOUNT_SID,
      api_key: !!process.env.TWILIO_API_KEY_SID,
      api_secret: !!process.env.TWILIO_API_KEY_SECRET,
      twiml_app: !!process.env.TWILIO_TWIML_APP_SID,
      phone_number: !!process.env.TWILIO_NUMBER,
    },
  });
});
app.post("/send-sms", async (req, res) => {
  const { to, message } = req.body;

  try {
    const client_ = twilio(
      process.env.TWILIO_ACCOUNT_SID, // ACxxx
      process.env.TWILIO_AUTH_TOKEN // from Twilio console
    );
    const msg = await client_.messages.create({
      body: message,
      from: process.env.TWILIO_NUMBER, // your Twilio number (+1xxx)
      to, // must be verified if on Trial
    });

    res.json({ success: true, sid: msg.sid });
  } catch (err) {
    console.error("SMS Error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get("/call-logs", async (req, res) => {
  try {
    const client_ = twilio(
      process.env.TWILIO_ACCOUNT_SID, // ACxxx
      process.env.TWILIO_AUTH_TOKEN // from Twilio console
    );
    const calls = await client_.calls.list({
      startTimeAfter: new Date("2025-01-01"), // all calls after Jan 1 2025
      limit: 5000, // max Twilio allows in one request
    });
    res.json({ success: true, calls });
  } catch (err) {
    console.error("Error fetching call logs:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get("/message-logs", async (req, res) => {
  try {
    const client_ = twilio(
      process.env.TWILIO_ACCOUNT_SID, // ACxxx
      process.env.TWILIO_AUTH_TOKEN // from Twilio console
    );
    const messages = await client_.messages.list({
      limit: 5000, // max Twilio allows in one request
    });
    res.json({ success: true, messages });
  } catch (err) {
    console.error("Error fetching message logs:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Backend running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
  console.log(`Token endpoint: http://localhost:${PORT}/token`);
  console.log(`Voice webhook: http://localhost:${PORT}/voice`);
});
