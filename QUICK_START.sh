#!/bin/bash
# Coffee House Management System - Quick Start Script

echo "☕ Coffee House Management System - Quick Start"
echo "================================================"
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Prerequisites:${NC}"
echo "✓ MySQL 8.0+ running"
echo "✓ Node.js 18+ installed"
echo ""

# Database
echo -e "${BLUE}Step 1: Database Setup${NC}"
echo "Run in MySQL Terminal:"
echo "  mysql -u root -p"
echo "  source docs/database_schema.sql"
echo ""

# Backend
echo -e "${BLUE}Step 2: Backend Setup (Terminal 1)${NC}"
cd backend
echo "  cd backend"
echo "  cp .env.example .env"
echo "  npm install"
echo "  npm run dev"
echo ""

# Frontend
echo -e "${BLUE}Step 3: Frontend Setup (Terminal 2)${NC}"
cd ../frontend
echo "  cd frontend"
echo "  cp .env.example .env"
echo "  npm install"
echo "  npm run dev"
echo ""

echo -e "${GREEN}✅ Ready!${NC}"
echo "Access the app at: http://localhost:5173"
echo ""
echo -e "${YELLOW}Demo Credentials:${NC}"
echo "  Email: manager@coffee.local"
echo "  (Password: check database)"
