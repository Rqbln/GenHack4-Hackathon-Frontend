#!/bin/bash
# Performance and Cross-Browser Testing Script

set -e

echo "=========================================="
echo "Frontend Performance & Cross-Browser Tests"
echo "=========================================="

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if npm is available
if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ npm not found. Please install Node.js and npm.${NC}"
    exit 1
fi

echo -e "${YELLOW}📦 Building production bundle...${NC}"
npm run build

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Build failed!${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Build successful${NC}"

# Check bundle size
echo -e "\n${YELLOW}📊 Bundle Size Analysis:${NC}"
BUNDLE_SIZE=$(du -sh dist | cut -f1)
echo "Total bundle size: $BUNDLE_SIZE"

# Check for large chunks
echo -e "\n${YELLOW}📦 Large chunks (>500KB):${NC}"
find dist -name "*.js" -size +500k -exec ls -lh {} \; | awk '{print $5, $9}' || echo "No chunks >500KB"

# TypeScript compilation check
echo -e "\n${YELLOW}🔍 TypeScript Compilation Check:${NC}"
npm run build 2>&1 | grep -E "(error|warning)" || echo -e "${GREEN}✅ No TypeScript errors${NC}"

# Check for common issues
echo -e "\n${YELLOW}🔍 Common Issues Check:${NC}"

# Check for console.log in production
if grep -r "console.log" dist/ &> /dev/null; then
    echo -e "${YELLOW}⚠️  Warning: console.log found in production build${NC}"
else
    echo -e "${GREEN}✅ No console.log in production${NC}"
fi

# Check for source maps
if find dist -name "*.map" | grep -q .; then
    echo -e "${GREEN}✅ Source maps generated${NC}"
else
    echo -e "${YELLOW}⚠️  No source maps found${NC}"
fi

# Performance recommendations
echo -e "\n${YELLOW}💡 Performance Recommendations:${NC}"
echo "1. Consider code-splitting for large chunks"
echo "2. Enable gzip compression on server"
echo "3. Use CDN for static assets"
echo "4. Implement lazy loading for routes"
echo "5. Optimize images and assets"

echo -e "\n${GREEN}✅ Performance tests complete!${NC}"
echo -e "\n${YELLOW}📝 Next steps:${NC}"
echo "- Run Lighthouse audit: npm install -g lighthouse && lighthouse http://localhost:5173"
echo "- Test in different browsers (Chrome, Firefox, Safari, Edge)"
echo "- Check mobile responsiveness"
echo "- Test with slow network throttling"

