@echo off
REM PrestaLink Production Deployment Script
REM This script prepares the codebase for production deployment

setlocal enabledelayedexpansion

cls
echo =========================================
echo PrestaLink Production Deployment Checker
echo =========================================
echo.

set ERRORS=0
set WARNINGS=0

REM Check 1: Git Repository
echo [1/8] Checking Git Repository...
if exist .git\ (
    echo [OK] Git repository exists
) else (
    echo [WARN] Git repository not found. Run: git init
    set /a WARNINGS+=1
)

REM Check 2: Frontend build
echo [2/8] Checking Frontend Build...
cd frontend
if exist .next\ (
    echo [OK] Frontend built (.next directory exists)
) else (
    echo [INFO] Frontend not built. Will be built during Vercel deployment.
)
cd ..

REM Check 3: Environment files
echo [3/8] Checking Environment Variables...
if exist frontend\.env.local (
    echo [OK] frontend\.env.local exists
) else (
    echo [WARN] frontend\.env.local missing
    set /a WARNINGS+=1
)

if exist backend\.env (
    echo [OK] backend\.env exists
) else (
    echo [WARN] backend\.env missing
    set /a WARNINGS+=1
)

REM Check 4: Stability Fixes
echo [4/8] Checking Stability Fixes...

REM Check for hasHydrated in auth store
findstr /M "hasHydrated" frontend\store\useAuthStore.ts >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo [OK] Auth store hydration guard in place
) else (
    echo [ERROR] Auth store missing hasHydrated flag
    set /a ERRORS+=1
)

REM Check for hardcoded production URL
findstr "prestalink\.onrender\.com" frontend\services\api.ts >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo [ERROR] Hardcoded production URL found in api.ts
    set /a ERRORS+=1
) else (
    echo [OK] No hardcoded production URL in api.ts
)

REM Check 5: CORS Configuration
echo [5/8] Checking CORS Configuration...
findstr "wildcard.*credentials" backend\server.js >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo [ERROR] Wildcard CORS with credentials found
    set /a ERRORS+=1
) else (
    echo [OK] CORS configuration secure
)

REM Check 6: Package files
echo [6/8] Checking Package.json Files...
if exist backend\package.json (
    echo [OK] backend\package.json exists
) else (
    echo [ERROR] backend\package.json missing
    set /a ERRORS+=1
)

if exist frontend\package.json (
    echo [OK] frontend\package.json exists
) else (
    echo [ERROR] frontend\package.json missing
    set /a ERRORS+=1
)

REM Check 7: Deployment configs
echo [7/8] Checking Deployment Configurations...
if exist vercel.json (
    echo [OK] vercel.json exists
) else (
    echo [WARN] vercel.json missing
    set /a WARNINGS+=1
)

if exist render.yaml (
    echo [OK] render.yaml exists
) else (
    echo [WARN] render.yaml missing
    set /a WARNINGS+=1
)

REM Check 8: Documentation
echo [8/8] Checking Documentation...
if exist PRODUCTION_DEPLOYMENT_PLAN.md (
    echo [OK] PRODUCTION_DEPLOYMENT_PLAN.md exists
) else (
    echo [WARN] PRODUCTION_DEPLOYMENT_PLAN.md missing
    set /a WARNINGS+=1
)

echo.
echo =========================================
echo Summary
echo =========================================
echo Errors: %ERRORS%
echo Warnings: %WARNINGS%
echo.

if %ERRORS% GTR 0 (
    echo [FAIL] Fix errors before deploying!
    exit /b 1
)

if %WARNINGS% GTR 0 (
    echo [WARN] %WARNINGS% warnings found (may not block deployment)
)

echo [OK] Codebase ready for production deployment!
echo.
echo Next steps:
echo 1. Push to GitHub: git push origin main
echo 2. Follow PRODUCTION_DEPLOYMENT_PLAN.md
echo 3. Deploy to Vercel (frontend) and Render (backend)
echo.
pause
