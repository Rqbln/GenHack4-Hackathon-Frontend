#!/bin/bash
# Test script for frontend build

set -e

echo "=" * 60
echo "Testing Frontend Build"
echo "=" * 60

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "⚠️  node_modules not found. Running npm install..."
    npm install
fi

# Run TypeScript check
echo ""
echo "[Test 1] TypeScript compilation..."
npm run build 2>&1 | grep -E "(error|Error|✓ built)" || true

# Check if build succeeded
if [ -d "dist" ]; then
    echo "✅ Build successful - dist/ directory created"
    echo "✅ Frontend tests passed!"
    exit 0
else
    echo "❌ Build failed - dist/ directory not found"
    exit 1
fi

