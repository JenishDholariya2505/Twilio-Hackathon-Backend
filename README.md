# Twilio Hackathon Backend

A Node.js Express backend API for generating Twilio Voice access tokens with production-ready code structure. The main entry point is `index.js`.

## 🚀 Features

- ✅ Generate Twilio Voice access tokens
- ✅ Environment variable validation
- ✅ CORS support for cross-origin requests
- ✅ Comprehensive error handling and logging
- ✅ Health check endpoint
- ✅ Production-ready code structure
- ✅ JWT token generation with Voice grants

## 📋 Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Twilio account with:
  - Account SID
  - API Key
  - API Secret
  - TwiML App SID

## 🔧 Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

1. Copy the environment example file:

```bash
cp env.example .env
```

2. Edit `.env` with your Twilio credentials:

```env
TWILIO_ACCOUNT_SID=your_account_sid_here
TWILIO_API_KEY=your_api_key_here
TWILIO_API_SECRET=your_api_secret_here
TWILIO_TWIML_APP_SID=your_twiml_app_sid_here
PORT=3001
NODE_ENV=development
```

### 3. Get Twilio Credentials

1. **Account SID**: Found in your Twilio Console dashboard
2. **API Key & Secret**: Create in Twilio Console → Settings → API Keys
3. **TwiML App SID**: Create in Twilio Console → Voice → TwiML Apps

### 4. Start the Server

Development mode (with auto-restart):

```bash
npm run dev
```

Production mode:

```bash
npm start
```

The server will start on `http://localhost:3001`

## 🌐 API Endpoints

### Base URL: `http://localhost:3001`

| Method | Endpoint              | Description                                  |
| ------ | --------------------- | -------------------------------------------- |
| GET    | `/health`             | Health check and Twilio configuration status |
| GET    | `/token?identity=XYZ` | Generate Twilio Voice access token           |

### Health Check Response

```json
{
  "status": "healthy",
  "twilioConfigured": true,
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

### Token Endpoint Response

```json
{
  "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiIsImN0eSI6InR3aWxpby1mcGE7dj0xIn0...",
  "identity": "alice",
  "success": true,
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

## 🔑 Twilio Configuration

### Required Twilio Resources

1. **Account SID**: Found in your Twilio Console dashboard
2. **API Key & Secret**: Create in Twilio Console → Settings → API Keys
3. **TwiML App**: Create in Twilio Console → Voice → TwiML Apps

### TwiML App Configuration

Your TwiML App should have a Voice Configuration URL that handles incoming calls. Example:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<Response>
    <Say>Hello from Twilio Voice!</Say>
</Response>
```

## 🛠️ Development

### Available Scripts

```bash
# Install dependencies
npm install

# Run in development mode (with auto-restart)
npm run dev

# Run in production mode
npm start

# Run tests (if configured)
npm test
```

### Environment Variables

| Variable               | Description                          | Required |
| ---------------------- | ------------------------------------ | -------- |
| `TWILIO_ACCOUNT_SID`   | Your Twilio Account SID              | Yes      |
| `TWILIO_API_KEY`       | Your Twilio API Key                  | Yes      |
| `TWILIO_API_SECRET`    | Your Twilio API Secret               | Yes      |
| `TWILIO_TWIML_APP_SID` | Your TwiML App SID                   | Yes      |
| `PORT`                 | Server port (default: 3001)          | No       |
| `NODE_ENV`             | Environment (development/production) | No       |

## 🔒 Security Considerations

- Never commit `.env` files to version control
- Keep your Twilio API Secret secure
- Use environment variables for all sensitive data
- Consider implementing rate limiting for production
- Validate and sanitize all user inputs

## 🐛 Troubleshooting

### Common Issues

1. **"Missing required environment variables" error**

   - Check your `.env` file exists
   - Ensure all required variables are set
   - Verify variable names match exactly

2. **"Failed to generate access token" error**

   - Verify Twilio credentials are correct
   - Check TwiML App SID is valid
   - Ensure Twilio account is active

3. **CORS errors from frontend**
   - Backend includes CORS middleware
   - Check if frontend URL is allowed
   - Verify backend is running on correct port

### Debug Mode

The server includes detailed logging. Check the console output for debugging information.

## 📱 Integration with Frontend

This backend is designed to work with the React frontend that uses:

- `@twilio/voice-sdk` for device management
- `axios` for API calls
- Real-time connection status display

### Example Frontend Usage

```javascript
// Fetch token from backend
const response = await axios.get("http://localhost:3001/token", {
  params: { identity: "alice" },
});

// Initialize Twilio Device
const device = new Device(response.data.token);
```

## 📄 License

MIT License - see LICENSE file for details

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📞 Support

For Twilio-specific issues, refer to:

- [Twilio Voice SDK Documentation](https://www.twilio.com/docs/voice/sdks/javascript)
- [Twilio Console](https://console.twilio.com/)
- [Twilio Support](https://support.twilio.com/)
