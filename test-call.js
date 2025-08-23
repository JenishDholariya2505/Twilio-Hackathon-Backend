require("dotenv").config();
const assert = (c, msg) => {
  if (!c) {
    console.error(msg);
    process.exit(1);
  }
};

const { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_NUMBER, VOICE_URL } =
  process.env;

assert(TWILIO_ACCOUNT_SID, "Missing TWILIO_ACCOUNT_SID");
assert(TWILIO_AUTH_TOKEN, "Missing TWILIO_AUTH_TOKEN");
assert(TWILIO_NUMBER, "Missing TWILIO_NUMBER (use E.164 like +12813240758)");
assert(VOICE_URL, "Missing VOICE_URL (your /voice or TwiML Bin)");

const client = require("twilio")(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

(async () => {
  try {
    const call = await client.calls.create({
      to: "+919687424831", // destination
      from: TWILIO_NUMBER, // MUST be your Twilio voice number
      url: VOICE_URL, // your /voice endpoint or TwiML Bin
    });
    console.log("Created Call SID:", call.sid);
  } catch (e) {
    console.error("FAIL", e.code, e.message);
  }
})();
