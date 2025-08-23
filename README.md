# Twilio Node.js Project

A Node.js project with Twilio integration for sending SMS, making voice calls, and managing messages.

## Features

- 📱 Send SMS messages
- 📞 Make voice calls
- 📋 View message history
- 🔍 Health check endpoint
- 🛡️ Error handling and validation

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Twilio account with:
  - Account SID
  - Auth Token
  - Twilio phone number

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Configuration

1. Copy the environment example file:

```bash
cp env.example .env
```

2. Edit `.env` file with your Twilio credentials:

```env
TWILIO_ACCOUNT_SID=your_account_sid_here
TWILIO_AUTH_TOKEN=your_auth_token_here
TWILIO_PHONE_NUMBER=your_twilio_phone_number_here
PORT=3000
NODE_ENV=development
```

### 3. Get Twilio Credentials

1. Sign up at [Twilio Console](https://console.twilio.com/)
2. Get your Account SID and Auth Token from the dashboard
3. Purchase a phone number or use a trial number

### 4. Run the Application

Development mode (with auto-restart):

```bash
npm run dev
```

Production mode:

```bash
npm start
```

The server will start on `http://localhost:3000`

## API Endpoints

### Base URL

```
http://localhost:3000
```

### Endpoints

#### 1. Health Check

- **GET** `/health`
- Returns server status and Twilio configuration status

#### 2. Send SMS

- **POST** `/send-sms`
- **Body:**

```json
{
  "to": "+1234567890",
  "message": "Hello from Twilio!"
}
```

#### 3. Make Voice Call

- **POST** `/make-call`
- **Body:**

```json
{
  "to": "+1234567890",
  "twimlUrl": "https://your-domain.com/twiml"
}
```

#### 4. Get Message History

- **GET** `/messages`
- Returns last 20 messages

## Example Usage

### Using cURL

#### Send SMS:

```bash
curl -X POST http://localhost:3000/send-sms \
  -H "Content-Type: application/json" \
  -d '{
    "to": "+1234567890",
    "message": "Hello from Twilio!"
  }'
```

#### Make Call:

```bash
curl -X POST http://localhost:3000/make-call \
  -H "Content-Type: application/json" \
  -d '{
    "to": "+1234567890",
    "twimlUrl": "https://your-domain.com/twiml"
  }'
```

### Using JavaScript/Fetch

```javascript
// Send SMS
const sendSMS = async (to, message) => {
  const response = await fetch("http://localhost:3000/send-sms", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ to, message }),
  });
  return response.json();
};

// Make call
const makeCall = async (to, twimlUrl) => {
  const response = await fetch("http://localhost:3000/make-call", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ to, twimlUrl }),
  });
  return response.json();
};
```

## Error Handling

The API returns appropriate HTTP status codes and error messages:

- `400` - Bad Request (missing required fields)
- `500` - Internal Server Error (Twilio API errors)

## Security Notes

- Never commit your `.env` file to version control
- Keep your Twilio Auth Token secure
- Use environment variables for all sensitive data
- Consider implementing rate limiting for production use

## Troubleshooting

1. **Twilio not configured**: Check your `.env` file and ensure all Twilio credentials are correct
2. **Invalid phone number**: Ensure phone numbers are in E.164 format (+1234567890)
3. **Authentication errors**: Verify your Account SID and Auth Token
4. **Trial account limitations**: Trial accounts have restrictions on phone numbers and features

## License

MIT License
