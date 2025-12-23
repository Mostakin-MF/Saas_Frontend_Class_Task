#!/bin/bash
# EventHub Project - Setup & Run Guide

echo "======================================"
echo "  EventHub - Event Management SaaS   "
echo "======================================"
echo ""

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    echo "✅ Dependencies installed"
    echo ""
fi

echo "🚀 Starting development server..."
echo ""
echo "📍 Application URLs:"
echo "  • Home:          http://localhost:3000"
echo "  • Login:         http://localhost:3000/auth/login"
echo "  • Register:      http://localhost:3000/auth/register"
echo "  • Attendees:     http://localhost:3000/attendee"
echo ""
echo "📚 Documentation:"
echo "  • Start here:    GETTING_STARTED.md"
echo "  • Full guide:    PROJECT_DOCUMENTATION.md"
echo "  • File structure: PROJECT_STRUCTURE.md"
echo ""

npm run dev
