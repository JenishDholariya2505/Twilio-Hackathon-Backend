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

// API Documentation Page
app.get("/", (req, res) => {
  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Twilio Backend API Documentation</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            background: linear-gradient(135deg, #a8e6cf 0%, #7fcdcd 50%, #b8e6b8 100%);
            min-height: 100vh;
        }
        
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
        }
        
        .header {
            text-align: center;
            color: white;
            margin-bottom: 40px;
        }
        
        .header h1 {
            font-size: 3rem;
            margin-bottom: 10px;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
        }
        
        .header p {
            font-size: 1.2rem;
            opacity: 0.9;
        }
        
        .api-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
            gap: 25px;
            margin-bottom: 40px;
        }
        
        .api-card {
            background: linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 255, 248, 0.95) 100%);
            border-radius: 20px;
            padding: 30px;
            box-shadow: 
                0 8px 25px rgba(168, 230, 207, 0.2),
                0 4px 10px rgba(0, 0, 0, 0.05),
                inset 0 1px 0 rgba(255, 255, 255, 0.8);
            transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            border: 2px solid rgba(168, 230, 207, 0.15);
            position: relative;
            overflow: hidden;
        }
        
        .api-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 4px;
            background: linear-gradient(90deg, #4ade80, #22c55e, #16a34a);
            border-radius: 20px 20px 0 0;
        }
        
        .api-card:hover {
            transform: translateY(-8px) scale(1.02);
            box-shadow: 
                0 20px 50px rgba(168, 230, 207, 0.3),
                0 10px 20px rgba(0, 0, 0, 0.1),
                inset 0 1px 0 rgba(255, 255, 255, 0.9);
            border-color: rgba(168, 230, 207, 0.4);
        }
        
        .method {
            display: inline-block;
            padding: 8px 16px;
            border-radius: 25px;
            font-weight: bold;
            font-size: 0.9rem;
            margin-bottom: 15px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            text-transform: uppercase;
            letter-spacing: 0.5px;
            position: relative;
            overflow: hidden;
        }
        
        .method::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
            transition: left 0.5s;
        }
        
        .method:hover::before {
            left: 100%;
        }
        
        .get { background: #4ade80; color: #000; }
        .post { background: #22c55e; color: white; }
        .put { background: #16a34a; color: white; }
        .delete { background: #ef4444; color: white; }
        
        .endpoint {
            font-family: 'Courier New', monospace;
            font-size: 1.2rem;
            font-weight: bold;
            color: #16a34a;
            margin-bottom: 20px;
            word-break: break-all;
            padding: 12px 16px;
            background: rgba(168, 230, 207, 0.1);
            border-radius: 10px;
            border-left: 4px solid #22c55e;
            position: relative;
        }
        
        .endpoint::after {
            content: '🔗';
            position: absolute;
            right: 10px;
            top: 50%;
            transform: translateY(-50%);
            font-size: 1rem;
        }
        
        .description {
            color: #666;
            margin-bottom: 15px;
            line-height: 1.5;
        }
        
        .params {
            background: linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%);
            border-radius: 12px;
            padding: 20px;
            margin-bottom: 20px;
            border: 2px solid rgba(168, 230, 207, 0.2);
            box-shadow: inset 0 2px 4px rgba(168, 230, 207, 0.1);
            position: relative;
        }
        
        .params::before {
            content: '📋';
            position: absolute;
            top: -10px;
            left: 15px;
            background: white;
            padding: 5px 10px;
            border-radius: 15px;
            font-size: 0.9rem;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }
        
        .params h4 {
            color: #333;
            margin-bottom: 10px;
            font-size: 1rem;
        }
        
        .param-item {
            display: flex;
            justify-content: space-between;
            margin-bottom: 8px;
            padding: 5px 0;
            border-bottom: 1px solid #e9ecef;
        }
        
        .param-name {
            font-weight: bold;
            color: #16a34a;
            font-family: 'Courier New', monospace;
        }
        
        .param-type {
            color: #666;
            font-size: 0.9rem;
        }
        
        .response {
            background: linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%);
            border-radius: 12px;
            padding: 20px;
            border-left: 4px solid #22c55e;
            box-shadow: inset 0 2px 4px rgba(168, 230, 207, 0.1);
            position: relative;
        }
        
        .response::before {
            content: '📤';
            position: absolute;
            top: -10px;
            left: 15px;
            background: white;
            padding: 5px 10px;
            border-radius: 15px;
            font-size: 0.9rem;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }
        
        .response h4 {
            color: #16a34a;
            margin-bottom: 15px;
            font-size: 1.1rem;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        
        .response pre {
            background: rgba(255, 255, 255, 0.8);
            padding: 15px;
            border-radius: 8px;
            border: 1px solid rgba(168, 230, 207, 0.2);
            font-size: 0.9rem;
            line-height: 1.4;
            overflow-x: auto;
        }
        
        .status-section {
            background: linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 255, 248, 0.95) 100%);
            border-radius: 20px;
            padding: 30px;
            box-shadow: 
                0 10px 30px rgba(168, 230, 207, 0.3),
                0 4px 10px rgba(0, 0, 0, 0.05);
            margin-bottom: 30px;
            border: 2px solid rgba(168, 230, 207, 0.2);
            position: relative;
            overflow: hidden;
        }
        
        .status-section::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 4px;
            background: linear-gradient(90deg, #4ade80, #22c55e, #16a34a);
        }
        
        .status-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin-top: 20px;
        }
        
        .status-item {
            text-align: center;
            padding: 25px;
            background: linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(248, 255, 248, 0.9) 100%);
            border-radius: 15px;
            border: 2px solid rgba(168, 230, 207, 0.3);
            box-shadow: 0 4px 15px rgba(168, 230, 207, 0.2);
            transition: all 0.3s ease;
            position: relative;
            overflow: hidden;
        }
        
        .status-item::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 3px;
            background: linear-gradient(90deg, #4ade80, #22c55e);
            opacity: 0;
            transition: opacity 0.3s ease;
        }
        
        .status-item:hover::before {
            opacity: 1;
        }
        
        .status-item:hover {
            transform: translateY(-3px);
            box-shadow: 0 8px 25px rgba(168, 230, 207, 0.3);
        }
        
        .status-item.success {
            border-color: #22c55e;
            background: #f0fdf4;
        }
        
        .status-item.error {
            border-color: #ef4444;
            background: #fef2f2;
        }
        
        .status-icon {
            font-size: 2rem;
            margin-bottom: 10px;
        }
        
        .footer {
            text-align: center;
            color: white;
            margin-top: 40px;
            padding: 20px;
            opacity: 0.8;
        }
        
        @media (max-width: 768px) {
            .header h1 {
                font-size: 2rem;
            }
            
            .api-grid {
                grid-template-columns: 1fr;
            }
            
            .container {
                padding: 10px;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🚀 Twilio Backend API</h1>
            <p>Complete API Documentation for Twilio Voice & SMS Integration</p>
        </div>
        
        <div class="status-section">
            <h2>📊 API Status</h2>
            <div class="status-grid">
                <div class="status-item success">
                    <div class="status-icon">✅</div>
                    <h3>Server Running</h3>
                    <p>Port: ${process.env.PORT || 3001}</p>
                </div>
                <div class="status-item ${
                  process.env.TWILIO_ACCOUNT_SID ? "success" : "error"
                }">
                    <div class="status-icon">${
                      process.env.TWILIO_ACCOUNT_SID ? "✅" : "❌"
                    }</div>
                    <h3>Twilio Account</h3>
                    <p>${
                      process.env.TWILIO_ACCOUNT_SID ? "Configured" : "Missing"
                    }</p>
                </div>
                <div class="status-item ${
                  process.env.TWILIO_API_KEY_SID ? "success" : "error"
                }">
                    <div class="status-icon">${
                      process.env.TWILIO_API_KEY_SID ? "✅" : "❌"
                    }</div>
                    <h3>API Key</h3>
                    <p>${
                      process.env.TWILIO_API_KEY_SID ? "Configured" : "Missing"
                    }</p>
                </div>
                <div class="status-item ${
                  process.env.TWILIO_NUMBER ? "success" : "error"
                }">
                    <div class="status-icon">${
                      process.env.TWILIO_NUMBER ? "✅" : "❌"
                    }</div>
                    <h3>Phone Number</h3>
                    <p>${process.env.TWILIO_NUMBER || "Missing"}</p>
                </div>
            </div>
        </div>
        
        <div class="api-grid">
            <!-- Token Generation -->
            <div class="api-card">
                <span class="method get">GET</span>
                <div class="endpoint">/token</div>
                <div class="description">Generate Twilio Voice access token for client-side authentication</div>
                <div class="response">
                    <h4>Response:</h4>
                    <pre>{
  "token": "eyJhbGciOiJIUzI1NiIs..."
}</pre>
                </div>
            </div>
            
            <!-- Health Check -->
            <div class="api-card">
                <span class="method get">GET</span>
                <div class="endpoint">/health</div>
                <div class="description">Check server health and environment configuration status</div>
                <div class="response">
                    <h4>Response:</h4>
                    <pre>{
  "status": "OK",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "env_check": { ... }
}</pre>
                </div>
            </div>
            
            <!-- Send SMS -->
            <div class="api-card">
                <span class="method post">POST</span>
                <div class="endpoint">/send-sms</div>
                <div class="description">Send SMS message to a phone number</div>
                <div class="params">
                    <h4>Parameters:</h4>
                    <div class="param-item">
                        <span class="param-name">to</span>
                        <span class="param-type">string (required)</span>
                    </div>
                    <div class="param-item">
                        <span class="param-name">message</span>
                        <span class="param-type">string (required)</span>
                    </div>
                </div>
                <div class="response">
                    <h4>Response:</h4>
                    <pre>{
  "success": true,
  "sid": "SM1234567890abcdef"
}</pre>
                </div>
            </div>
            
            <!-- Call Forward -->
            <div class="api-card">
                <span class="method post">POST</span>
                <div class="endpoint">/calls/forward</div>
                <div class="description">Forward a call to a new participant in a conference</div>
                <div class="params">
                    <h4>Parameters:</h4>
                    <div class="param-item">
                        <span class="param-name">ConferenceSid</span>
                        <span class="param-type">string (required)</span>
                    </div>
                    <div class="param-item">
                        <span class="param-name">NewNumber</span>
                        <span class="param-type">string (required)</span>
                    </div>
                    <div class="param-item">
                        <span class="param-name">core_call_number</span>
                        <span class="param-type">string (required)</span>
                    </div>
                </div>
                <div class="response">
                    <h4>Response:</h4>
                    <pre>{
  "success": true,
  "callSid": "CA1234567890abcdef"
}</pre>
                </div>
            </div>
            
            <!-- Voice Webhook -->
            <div class="api-card">
                <span class="method post">POST</span>
                <div class="endpoint">/voice</div>
                <div class="description">Handle incoming voice calls and generate TwiML response</div>
                <div class="params">
                    <h4>Parameters:</h4>
                    <div class="param-item">
                        <span class="param-name">From</span>
                        <span class="param-type">string</span>
                    </div>
                    <div class="param-item">
                        <span class="param-name">To</span>
                        <span class="param-type">string</span>
                    </div>
                    <div class="param-item">
                        <span class="param-name">CallSid</span>
                        <span class="param-type">string</span>
                    </div>
                </div>
                <div class="response">
                    <h4>Response:</h4>
                    <pre>&lt;Response&gt;
  &lt;Say&gt;Hello from Twilio!&lt;/Say&gt;
&lt;/Response&gt;</pre>
                </div>
            </div>
            
            <!-- DTMF Handler -->
            <div class="api-card">
                <span class="method post">POST</span>
                <div class="endpoint">/dtmf-handler</div>
                <div class="description">Handle DTMF (keypad) input during calls</div>
                <div class="params">
                    <h4>Parameters:</h4>
                    <div class="param-item">
                        <span class="param-name">Digits</span>
                        <span class="param-type">string</span>
                    </div>
                    <div class="param-item">
                        <span class="param-name">CallSid</span>
                        <span class="param-type">string</span>
                    </div>
                </div>
                <div class="response">
                    <h4>Response:</h4>
                    <pre>&lt;Response&gt;
  &lt;Say&gt;You pressed: {digits}&lt;/Say&gt;
&lt;/Response&gt;</pre>
                </div>
            </div>
            
            <!-- Call Status -->
            <div class="api-card">
                <span class="method post">POST</span>
                <div class="endpoint">/call-status</div>
                <div class="description">Handle call status webhooks from Twilio</div>
                <div class="params">
                    <h4>Parameters:</h4>
                    <div class="param-item">
                        <span class="param-name">CallStatus</span>
                        <span class="param-type">string</span>
                    </div>
                    <div class="param-item">
                        <span class="param-name">CallSid</span>
                        <span class="param-type">string</span>
                    </div>
                </div>
                <div class="response">
                    <h4>Response:</h4>
                    <pre>200 OK</pre>
                </div>
            </div>
            
            <!-- Call Logs -->
            <div class="api-card">
                <span class="method get">GET</span>
                <div class="endpoint">/call-logs</div>
                <div class="description">Retrieve call history and logs from Twilio</div>
                <div class="response">
                    <h4>Response:</h4>
                    <pre>{
  "success": true,
  "calls": [
    {
      "sid": "CA1234567890abcdef",
      "from": "+1234567890",
      "to": "+0987654321",
      "status": "completed",
      "duration": 120
    }
  ]
}</pre>
                </div>
            </div>
            
            <!-- Message Logs -->
            <div class="api-card">
                <span class="method get">GET</span>
                <div class="endpoint">/message-logs</div>
                <div class="description">Retrieve SMS message history and logs from Twilio</div>
                <div class="response">
                    <h4>Response:</h4>
                    <pre>{
  "success": true,
  "messages": [
    {
      "sid": "SM1234567890abcdef",
      "from": "+1234567890",
      "to": "+0987654321",
      "body": "Hello World",
      "status": "delivered"
    }
  ]
}</pre>
                </div>
            </div>
        </div>
        
        <div class="footer">
            <p>🚀 Twilio Backend API | Built with Node.js & Express</p>
            <p>Environment: ${process.env.NODE_ENV || "development"} | Port: ${
    process.env.PORT || 3001
  }</p>
        </div>
    </div>
</body>
</html>`;

  res.send(html);
});

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
