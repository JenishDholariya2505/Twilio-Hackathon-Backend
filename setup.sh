#!/bin/bash

echo "🚀 Setting up Twilio Hackathon Backend..."

# Check if .env file exists
if [ ! -f .env ]; then
    echo "📝 Creating .env file from template..."
    cp env.example .env
    echo "✅ .env file created!"
    echo "⚠️  Please edit .env file with your Twilio credentials:"
    echo "   - TWILIO_ACCOUNT_SID"
    echo "   - TWILIO_API_KEY"
    echo "   - TWILIO_API_SECRET"
    echo "   - TWILIO_TWIML_APP_SID"
else
    echo "✅ .env file already exists"
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

echo "✅ Setup complete!"
echo ""
echo "🎯 Next steps:"
echo "1. Edit .env file with your Twilio credentials"
echo "2. Run 'npm run dev' to start the development server (index.js)"
echo "3. Test the API at http://localhost:3001/health"
echo ""
echo "📚 For more information, see README.md"
