# Twilio Call Troubleshooting Guide

## Error 31005: "Error sent from gateway in HANGUP"

This error typically occurs due to several common issues. Here's how to fix them:

### 1. Environment Variables Setup

Create a `.env` file in your root directory with these variables:

```env
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_API_KEY_SID=SKxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_API_KEY_SECRET=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_TWIML_APP_SID=APxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_NUMBER=+1234567890
PORT=3001
```

### 2. Twilio Console Setup

1. **Create API Key**: Go to Console > Settings > API Keys

   - Create a new API Key
   - Save both the SID and Secret

2. **Create TwiML App**: Go to Console > Voice > TwiML Apps

   - Create a new TwiML App
   - Set the Voice Request URL to: `https://your-domain.com/voice`
   - Method: HTTP POST

3. **Verify Phone Number**: Go to Console > Phone Numbers
   - Make sure your number has Voice capability enabled
   - Set the Voice webhook to your TwiML App

### 3. Common Causes of Error 31005

#### A. Invalid Phone Number Format

- Use international format: `+91XXXXXXXXXX`
- No spaces or special characters

#### B. Twilio Account Issues

- Check if your Twilio account has sufficient credits
- Verify the account is not suspended

#### C. Network/Firewall Issues

- Some corporate networks block WebRTC
- Try using a different network (mobile hotspot)

#### D. Browser Issues

- Use Chrome, Firefox, or Safari
- Enable microphone permissions
- Clear browser cache

### 4. Testing Steps

1. **Check Environment Variables**:

   ```bash
   curl http://localhost:3001/health
   ```

2. **Test Token Generation**:

   ```bash
   curl http://localhost:3001/token
   ```

3. **Check Browser Console** for detailed error messages

### 5. Debug Mode

Enable detailed logging by setting in your browser console:

```javascript
localStorage.setItem("twilio-debug", "true");
```

### 6. Alternative Solutions

If the error persists:

1. **Use a different Twilio region**:

   ```javascript
   const d = new Device(token, {
     edge: "ashburn", // or 'dublin', 'sydney', etc.
   });
   ```

2. **Check your TwiML App configuration**:

   - Make sure the webhook URL is accessible
   - Verify the webhook returns valid TwiML

3. **Test with a simple number first**:
   - Try calling a Twilio test number: `+15005550006`

### 7. Getting Help

If you're still having issues:

1. Check Twilio logs in your Console
2. Verify all environment variables are set correctly
3. Test with the Twilio CLI: `twilio phone-numbers:list`

## Quick Fix Checklist

- [ ] `.env` file exists with all required variables
- [ ] Twilio API Key is created and active
- [ ] TwiML App is configured with correct webhook URL
- [ ] Phone number has Voice capability enabled
- [ ] Account has sufficient credits
- [ ] Using supported browser with microphone permissions
- [ ] Network allows WebRTC connections
