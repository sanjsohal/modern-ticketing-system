#!/bin/bash

# Quick Test Script for Idle Timeout Feature
# This script helps you test the idle timeout with short durations

echo "🔍 Testing Idle Timeout Feature"
echo "================================"
echo ""

# Create a temporary .env.local.test file
cat > .env.local.test << EOF
# Test Environment - Short Timeouts for Quick Testing
VITE_FIREBASE_API_KEY=your-local-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-local-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-local-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-local-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-local-sender-id
VITE_FIREBASE_APP_ID=your-local-app-id
VITE_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX

VITE_API_URL=http://localhost:3000
VITE_ENV=local
VITE_ENABLE_DEBUG=true
VITE_ENABLE_ANALYTICS=false

# SHORT TIMEOUTS FOR TESTING
VITE_IDLE_TIMEOUT=1
VITE_IDLE_WARNING_TIME=0.5
EOF

echo "✅ Created test environment configuration"
echo ""
echo "📋 Test Instructions:"
echo "--------------------"
echo "1. Backup your current .env.local file (if you have one)"
echo "2. Copy the test configuration:"
echo "   cp .env.local.test .env.local"
echo "3. Update Firebase credentials in .env.local"
echo "4. Start the dev server:"
echo "   npm run dev"
echo "5. Login to the application"
echo "6. Wait 30 seconds - warning should appear"
echo "7. Wait another 30 seconds - auto-logout should occur"
echo ""
echo "🔄 To restore normal timeouts:"
echo "   cp .env.example .env.local"
echo "   (then fill in your credentials)"
echo ""
echo "⏱️  Current Test Settings:"
echo "   - Idle Timeout: 1 minute"
echo "   - Warning Time: 30 seconds"
echo ""
echo "📝 Don't forget to restore your original .env.local after testing!"
