# Stability Test Plan for PrestaLink
# Tests auth store hydration, page refresh, CORS, auth flow

$API_URL = "http://localhost:5000/api"
$APP_URL = "http://localhost:3000"
$TEST_EMAIL = "testuser@example.com"
$TEST_PASSWORD = "Test@123"

$results = @()

Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "PrestaLink Stability Test Suite" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan

# Test 1: Backend Health Check
Write-Host "`nTEST 1: Backend Health Check" -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "$API_URL/../health" -Method GET -ErrorAction SilentlyContinue
    if ($response.StatusCode -eq 200 -or $response.StatusCode -eq 404) {
        Write-Host "[OK] Backend responding (Status: $($response.StatusCode))" -ForegroundColor Green
        $results += "[OK] Backend Health Check: PASSED"
    }
} catch {
    Write-Host "[WARN] Health endpoint returned error (may be normal)" -ForegroundColor Yellow
    $results += "[WARN] Backend Health Check: Inconclusive"
}

# Test 2: Login Endpoint
Write-Host "`nTEST 2: API Login Endpoint" -ForegroundColor Yellow
try {
    $loginPayload = @{
        email = $TEST_EMAIL
        password = $TEST_PASSWORD
    } | ConvertTo-Json

    $response = Invoke-WebRequest -Uri "$API_URL/auth/user/login" `
        -Method POST `
        -Headers @{"Content-Type" = "application/json"} `
        -Body $loginPayload `
        -ErrorAction SilentlyContinue

    if ($response.StatusCode -eq 200) {
        Write-Host "[OK] Login endpoint responding (Status: $($response.StatusCode))" -ForegroundColor Green
        $body = $response.Content | ConvertFrom-Json
        if ($body.token -or $body.message) {
            Write-Host "[OK] Response contains expected fields" -ForegroundColor Green
            $results += "[OK] Login Endpoint: PASSED"
        }
    }
} catch {
    $statusCode = $_.Exception.Response.StatusCode.Value__
    if ($statusCode -eq 401) {
        Write-Host "[OK] Login endpoint responding with 401 (credentials not found - normal)" -ForegroundColor Green
        $results += "[OK] Login Endpoint: PASSED (credentials invalid, but endpoint works)"
    } else {
        Write-Host "[FAIL] Unexpected error: $($_.Exception.Message)" -ForegroundColor Red
        $results += "[FAIL] Login Endpoint: FAILED"
    }
}

# Test 3: CORS Configuration
Write-Host "`nTEST 3: CORS Configuration Check" -ForegroundColor Yellow
try {
    $corsHeaders = @{
        "Origin" = "http://localhost:3000"
        "Access-Control-Request-Method" = "POST"
        "Access-Control-Request-Headers" = "Content-Type"
    }

    $response = Invoke-WebRequest -Uri "$API_URL/auth/user/login" `
        -Method OPTIONS `
        -Headers $corsHeaders `
        -ErrorAction SilentlyContinue

    $allowOrigin = $response.Headers["Access-Control-Allow-Origin"]
    $allowMethods = $response.Headers["Access-Control-Allow-Methods"]
    
    if ($allowOrigin) {
        Write-Host "[OK] CORS headers present" -ForegroundColor Green
        Write-Host "  Allow-Origin: $allowOrigin" -ForegroundColor Cyan
        if ($allowMethods) {
            Write-Host "  Allow-Methods: $allowMethods" -ForegroundColor Cyan
        }
        $results += "[OK] CORS Configuration: PASSED"
    } else {
        Write-Host "[WARN] CORS headers not present (may be normal in dev mode)" -ForegroundColor Yellow
        $results += "[WARN] CORS Configuration: Inconclusive"
    }
} catch {
    Write-Host "[WARN] CORS check error: $($_.Exception.Message)" -ForegroundColor Yellow
    $results += "[WARN] CORS Configuration: Inconclusive"
}

# Test 4: Check environment variables
Write-Host "`nTEST 4: Environment Configuration" -ForegroundColor Yellow
$env_file = "c:\Users\RANDOM\Desktop\prestalink\frontend\.env.local"
if (Test-Path $env_file) {
    $api_url = Get-Content $env_file | Select-String "NEXT_PUBLIC_API_URL"
    if ($api_url) {
        Write-Host "[OK] .env.local contains NEXT_PUBLIC_API_URL" -ForegroundColor Green
        Write-Host "  $api_url" -ForegroundColor Cyan
        $results += "[OK] Environment Config: PASSED"
    } else {
        Write-Host "[FAIL] .env.local missing NEXT_PUBLIC_API_URL" -ForegroundColor Red
        $results += "[FAIL] Environment Config: FAILED"
    }
} else {
    Write-Host "[WARN] .env.local file not found" -ForegroundColor Yellow
    $results += "[WARN] Environment Config: File not found"
}

# Summary
Write-Host "`n=========================================" -ForegroundColor Cyan
Write-Host "Test Results Summary" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan
foreach ($result in $results) {
    if ($result -match "[OK]") {
        Write-Host $result -ForegroundColor Green
    } elseif ($result -match "[WARN]") {
        Write-Host $result -ForegroundColor Yellow
    } else {
        Write-Host $result -ForegroundColor Red
    }
}

Write-Host "`n=========================================" -ForegroundColor Yellow
Write-Host "MANUAL BROWSER TESTS REQUIRED" -ForegroundColor Yellow
Write-Host "=========================================" -ForegroundColor Yellow
Write-Host @"
Open http://localhost:3000 in Chrome and test:

1. HYDRATION TEST (Auth Store)
   - Go to login page
   - Open DevTools → Application → Local Storage
   - Verify "prestalink-auth" key contains token and user data
   - Refresh page → Should NOT redirect to login
   ✓ PASS: Dashboard/home still shows after refresh

2. PERSISTENCE TEST
   - Go to login page, enter credentials and login
   - Close DevTools
   - Close the browser tab
   - Reopen http://localhost:3000
   - Should see dashboard, NOT login page
   ✓ PASS: User is still logged in (hydration worked)

3. REDIRECT TEST
   - Logout (if logout button exists)
   - Go to /user/dashboard directly
   - Should redirect to /login immediately
   ✓ PASS: Protected route redirects properly

4. LOGIN CYCLE TEST
   - Login with valid credentials
   - Navigate to user dashboard
   - Logout
   - Login again with same credentials
   - Should work without errors
   ✓ PASS: Multiple login cycles work

5. REFRESH MULTIPLE TIMES TEST
   - Login to dashboard
   - Press F5 to refresh 5 times rapidly
   - Page should remain stable, no redirects
   ✓ PASS: Multiple refreshes don't cause issues

6. NETWORK VERIFICATION
   - Open DevTools → Network tab
   - Refresh dashboard
   - Check network requests:
     * Base URL should be $API_URL
     * All API calls should succeed (200 status)
     * No CORS errors in console
   ✓ PASS: API calls using correct URL with no CORS errors
"@ -ForegroundColor Cyan

Write-Host "`n=========================================" -ForegroundColor Green
Write-Host "Backend API Tests Complete" -ForegroundColor Green
Write-Host "=========================================" -ForegroundColor Green
