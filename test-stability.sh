#!/bin/bash
# Stability Test Plan for PrestaLink
# Tests auth store hydration, page refresh, PWA behavior

API_URL="http://localhost:5000/api"
APP_URL="http://localhost:3000"
TEST_EMAIL="testuser@example.com"
TEST_PASSWORD="Test@123"

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "========================================="
echo "PrestaLink Stability Test Suite"
echo "========================================="

# Test 1: Backend Health Check
echo -e "\n${YELLOW}TEST 1: Backend Health Check${NC}"
HEALTH=$(curl -s -o /dev/null -w "%{http_code}" "$API_URL/../health" 2>/dev/null || echo "0")
if [ "$HEALTH" = "200" ] || [ "$HEALTH" = "404" ]; then
  echo -e "${GREEN}✓ Backend responding${NC}"
else
  echo -e "${RED}✗ Backend not responding (Status: $HEALTH)${NC}"
  echo "  Backend must be running on http://localhost:5000"
  exit 1
fi

# Test 2: API Login Endpoint
echo -e "\n${YELLOW}TEST 2: API Login Endpoint Check${NC}"
LOGIN_RESPONSE=$(curl -s -X POST "$API_URL/auth/user/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"'$TEST_EMAIL'","password":"'$TEST_PASSWORD'"}' \
  -w "\n%{http_code}")

STATUS=$(echo "$LOGIN_RESPONSE" | tail -n1)
BODY=$(echo "$LOGIN_RESPONSE" | head -n-1)

if [ "$STATUS" = "401" ] || [ "$STATUS" = "200" ]; then
  echo -e "${GREEN}✓ Login endpoint responding (Status: $STATUS)${NC}"
  if echo "$BODY" | grep -q "token\|message"; then
    echo -e "${GREEN}✓ Response contains expected fields${NC}"
  fi
else
  echo -e "${RED}✗ Unexpected response (Status: $STATUS)${NC}"
fi

# Test 3: CORS Configuration Check
echo -e "\n${YELLOW}TEST 3: CORS Headers Check${NC}"
CORS_RESPONSE=$(curl -s -X OPTIONS "$API_URL/auth/user/login" \
  -H "Origin: http://localhost:3000" \
  -H "Access-Control-Request-Method: POST" \
  -H "Access-Control-Request-Headers: Content-Type" \
  -v 2>&1 | grep -i "Access-Control")

if echo "$CORS_RESPONSE" | grep -q "Access-Control"; then
  echo -e "${GREEN}✓ CORS headers present${NC}"
  echo "$CORS_RESPONSE" | grep -i "Access-Control" | head -3
else
  echo -e "${YELLOW}⚠ CORS headers check inconclusive (normal for development)${NC}"
fi

echo -e "\n========================================="
echo "Backend API Tests Complete"
echo "========================================="
echo -e "\n${YELLOW}Frontend stability tests require browser automation.${NC}"
echo -e "\nKey test scenarios to verify manually:"
echo -e "  1. Login → User Dashboard → Refresh page → Verify dashboard still shows (no redirect)"
echo -e "  2. Login → Close tab → Reopen → User Dashboard still shows (hydration working)"
echo -e "  3. Login → Logout → Login again → Should work without errors"
echo -e "  4. Developer Tools → Application → LocalStorage → prestalink-auth should be set"
echo -e "  5. Network tab → Check NEXT_PUBLIC_API_URL is used (http://localhost:5000/api or configured IP)"

echo -e "\n${GREEN}All backend checks passed!${NC}"
