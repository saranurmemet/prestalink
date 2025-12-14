# 🚀 PRESTALINK DEPLOYMENT INSTRUCTIONS

**Status:** ✅ Code pushed to GitHub (commit: c75d978)  
**Repository:** https://github.com/memetsaranur/PrestaLink  
**Branch:** main

---

## 📊 DISCOVERY RESULTS

### Repository Structure
```
Frontend:    /frontend        (Next.js 14.2.11)
Backend:     /backend         (Express.js + Node.js)
Database:    MongoDB Atlas (required)
```

### API Configuration
```
Backend Routes:   /api/auth, /api/jobs, /api/applications, /api/notifications, /api/admin
API Prefix:       /api
NEXT_PUBLIC_API_URL: Must be set to: https://prestalink-backend-xxxxx.onrender.com/api
```

### Deployment Targets
```
Frontend Platform:  Vercel (vercel.json configured)
Backend Platform:   Render (render.yaml configured)
Database:           MongoDB Atlas (cloud)
```

### Security Checks ✅
- ✅ No hardcoded production URLs in frontend code
- ✅ Auth hydration guard in place (hasHydrated flag)
- ✅ Protected routes wait for hydration before redirect
- ✅ CORS: Explicit origins only (no wildcards with credentials)
- ✅ PWA: Auth endpoints excluded from service worker cache
- ✅ vercel.json: Now environment-driven (no hardcoded URLs)
- ✅ .gitignore: Secrets not tracked (.env*.local excluded)

---

## 🔧 REQUIRED ENVIRONMENT VARIABLES

### Backend (Render Dashboard)

**Generate these values:**

```
NODE_ENV = production

MONGO_URI = mongodb+srv://prestalink-admin:PASSWORD@cluster-name.xxxxx.mongodb.net/prestalink?retryWrites=true&w=majority
  → Source: MongoDB Atlas connection string
  → Replace PASSWORD with actual MongoDB password

JWT_SECRET = (generate 32+ random characters)
  → Run: openssl rand -hex 32
  → Or: https://www.random.org/strings/

CLIENT_URL = https://prestalink.vercel.app
  → Set AFTER frontend is deployed on Vercel
  → Must match frontend domain EXACTLY

PORT = 5000
  → Keep this value
```

### Frontend (Vercel Dashboard)

**Set for ALL environments (Production, Preview, Development):**

```
NEXT_PUBLIC_API_URL = https://prestalink-backend-xxxxx.onrender.com/api
  → Set AFTER backend is deployed on Render
  → Replace xxxxx with your actual Render service ID
  → Must include /api suffix
  → Must match backend domain exactly
```

---

## 📋 PHASE 1: MONGODB ATLAS SETUP (5 min)

1. Go to https://www.mongodb.com/cloud/atlas
2. Click "Create Cluster"
3. Select **Free M0 Sandbox** tier
4. Choose region: **Frankfurt** (recommended for Europe)
5. Click "Create Cluster"
6. Wait for cluster to initialize (~3 min)

### Create Database User

7. Clusters → Security → Database Access
8. "Add Database User"
   - Username: `prestalink-admin`
   - Password: Generate strong password (save it!)
   - User Privileges: Read and write to any database
9. "Add User"

### Create Network Access

10. Clusters → Security → Network Access
11. "Add IP Address" → Select "Allow Access from Anywhere" (0.0.0.0/0)
12. Click "Add Entry"
13. Click "Confirm"

### Get Connection String

14. Clusters → Connect → Drivers → Python (or copy URI)
15. Copy connection string:
    ```
    mongodb+srv://prestalink-admin:PASSWORD@cluster-name.xxxxx.mongodb.net/?retryWrites=true&w=majority
    ```
16. Replace `PASSWORD` with your actual password
17. Add `/prestalink` before `?`:
    ```
    mongodb+srv://prestalink-admin:PASSWORD@cluster-name.xxxxx.mongodb.net/prestalink?retryWrites=true&w=majority
    ```

**SAVE THIS AS MONGO_URI** - you'll need it for Render

---

## 🐳 PHASE 2: RENDER BACKEND DEPLOYMENT (15 min)

### Create Render Service

1. Go to https://render.com
2. Click "New +"  → "Web Service"
3. Connect GitHub:
   - "Public Git Repository"
   - Paste: `https://github.com/memetsaranur/PrestaLink.git`
   - Click "Continue"

### Configure Service

4. **Name:** `prestalink-backend`
5. **Region:** Europe (Frankfurt)
6. **Root Directory:** `backend/`
7. **Runtime:** Node
8. **Build Command:** `npm install`
9. **Start Command:** `node server.js`
10. **Plan:** Free (if available, else Starter)

### Set Environment Variables

11. Scroll to "Environment"
12. Add these variables:
    ```
    NODE_ENV = production
    MONGO_URI = mongodb+srv://prestalink-admin:PASSWORD@cluster-name.xxxxx.mongodb.net/prestalink?retryWrites=true&w=majority
    JWT_SECRET = (32+ random characters - generate new!)
    CLIENT_URL = (LEAVE BLANK FOR NOW - update after frontend deployed)
    PORT = 5000
    ```

### Deploy

13. Click "Create Web Service"
14. Wait for deployment (~ 10-15 min)
15. When complete, you'll see a URL like: `https://prestalink-backend-xxxxx.onrender.com`

**SAVE THIS BACKEND URL** - you'll need it for Vercel

### Verify Backend is Running

```bash
curl https://prestalink-backend-xxxxx.onrender.com/
# Expected response: {"message":"Prestalink API is running"}
```

---

## ⚡ PHASE 3: VERCEL FRONTEND DEPLOYMENT (10 min)

1. Go to https://vercel.com
2. Click "Add New..." → "Project"
3. Connect GitHub:
   - Select `PrestaLink` repository
   - Click "Import"

### Configure Project

4. **Framework Preset:** Next.js (auto-detected)
5. **Root Directory:** `frontend/`
6. Project name: Keep default or customize
7. Click "Deploy"
8. Wait for initial deployment to complete

### Set Environment Variables

9. Go to Settings → Environment Variables
10. Add this variable:
    ```
    NEXT_PUBLIC_API_URL = https://prestalink-backend-xxxxx.onrender.com/api
    (Replace xxxxx with your Render backend ID)
    ```
11. Set for: **Production**, **Preview**, **Development** (all)
12. Click "Save"

### Redeploy Frontend

13. Go to Deployments
14. Click "..." on latest deployment
15. Select "Redeploy"
16. Wait for redeploy to complete (~ 5 min)

**SAVE THIS FRONTEND URL** (usually https://prestalink.vercel.app)

---

## 🔗 PHASE 4: UPDATE BACKEND CORS (2 min)

Now that frontend is deployed, update backend CORS:

1. Go to Render → `prestalink-backend` → Environment
2. Find: `CLIENT_URL`
3. Set value to: `https://prestalink.vercel.app` (or your actual Vercel domain)
4. Click "Save"
5. Render auto-redeploys backend (~2 min)

---

## ✅ POST-DEPLOYMENT VERIFICATION (MANDATORY)

All 8 tests must PASS before considering deployment successful.

### Test 1: Backend Health Check
```bash
curl https://prestalink-backend-xxxxx.onrender.com/
Expected: HTTP 200
Expected body: {"message":"Prestalink API is running"}
```
✅ **PASS** if response is 200 with that message

### Test 2: Frontend Loads
```
Open: https://prestalink.vercel.app in browser
Expected: Login page appears, no errors in console
```
✅ **PASS** if page loads without 404 or error

### Test 3: CORS is Working
```
1. Open frontend: https://prestalink.vercel.app
2. Open DevTools → Network tab
3. Try to login (enter any credentials)
4. Look at the POST request to /api/auth/user/login
5. Check Response Headers
Expected Header: Access-Control-Allow-Origin: https://prestalink.vercel.app
```
✅ **PASS** if CORS header matches your frontend domain

### Test 4: Refresh Stability (CRITICAL - Auth Hydration)
```
1. Open: https://prestalink.vercel.app
2. Login (use valid credentials)
3. Once on dashboard, press F5 five times rapidly
Expected: You stay on dashboard every time
NOT expected: Redirect to login page
```
✅ **PASS** if dashboard persists on all 5 refreshes

### Test 5: Close/Reopen Persistence
```
1. Dashboard is open: https://prestalink.vercel.app/user/dashboard
2. Close browser tab COMPLETELY
3. Open NEW browser tab
4. Go to: https://prestalink.vercel.app
Expected: Dashboard loads immediately (no login page)
Reason: localStorage persistence should keep you logged in
```
✅ **PASS** if dashboard loads without login

### Test 6: Protected Routes Work
```
1. Clear localStorage completely:
   - DevTools → Application tab → Local Storage
   - Delete all entries (especially prestalink-auth)
2. Manually navigate to: https://prestalink.vercel.app/user/dashboard
Expected: Redirected to login page
```
✅ **PASS** if login page appears after clearing localStorage

### Test 7: API URL is Correct
```
1. Open frontend: https://prestalink.vercel.app
2. Login to dashboard
3. DevTools → Network tab
4. Trigger any API call (e.g., navigate to Jobs page)
5. Click on one of the API requests
6. Check the Request URL
Expected URL: https://prestalink-backend-xxxxx.onrender.com/api/...
NOT expected: http://localhost:5000/api/...
NOT expected: https://prestalink.vercel.app/api/api/...
```
✅ **PASS** if URL matches backend domain with /api prefix

### Test 8: Console is Clean
```
1. Open frontend: https://prestalink.vercel.app
2. DevTools → Console tab
3. Perform some actions (login, navigate, etc.)
Expected: No errors, no warnings
Specifically NOT:
  - CORS errors
  - 401/403 errors (except after logout)
  - "Cannot find..." errors
  - "localhost" or hardcoded URL errors
```
✅ **PASS** if console has no errors/warnings

---

## 🎯 SUCCESS CHECKLIST

Mark as COMPLETE only when ALL 8 tests pass:

- [ ] Test 1: Backend health check passes
- [ ] Test 2: Frontend loads
- [ ] Test 3: CORS headers correct
- [ ] Test 4: Refresh stability (F5 × 5, stays on dashboard)
- [ ] Test 5: Close/reopen persistence (stays logged in)
- [ ] Test 6: Protected routes redirect correctly
- [ ] Test 7: API URL uses production backend (not localhost)
- [ ] Test 8: Console has no errors/warnings

✅ **When all 8 PASS:** Deployment is SUCCESSFUL

---

## 🐛 TROUBLESHOOTING

### Problem: CORS Error in Console
**Error:** "Access to XMLHttpRequest has been blocked by CORS policy"

**Fix:**
1. Check Render → `prestalink-backend` → Environment
2. Verify `CLIENT_URL` matches frontend domain EXACTLY
3. Render should auto-redeploy (wait 2 min)
4. Hard refresh frontend (Ctrl+Shift+R on Windows)

### Problem: Redirect Loop on Refresh
**Symptom:** Press F5 on dashboard → redirected to login

**Cause:** Auth hydration issue or `hasHydrated` not working

**Fix:**
1. Check frontend code has `hasHydrated` guard (should be there)
2. Redeploy frontend:
   - Vercel → Deployments → Redeploy
3. Clear browser cache completely:
   - DevTools → Application → Clear Site Data
4. Hard refresh (Ctrl+Shift+R)

### Problem: Cannot Reach API (404)
**Error:** API requests returning 404

**Fix:**
1. Verify backend is running:
   ```bash
   curl https://prestalink-backend-xxxxx.onrender.com/
   ```
2. Check `NEXT_PUBLIC_API_URL` in Vercel is correct:
   - Must end with `/api` (not `/api/api`)
   - Must match backend domain exactly
3. Redeploy frontend if URL was wrong

### Problem: /api/api in URL
**Error:** Requests going to `/api/api/...` instead of `/api/...`

**Cause:** `NEXT_PUBLIC_API_URL` incorrectly includes `/api/api`

**Fix:**
1. Vercel → Settings → Environment Variables
2. Edit `NEXT_PUBLIC_API_URL`
3. Must be: `https://prestalink-backend-xxxxx.onrender.com/api`
4. NOT: `https://prestalink-backend-xxxxx.onrender.com/api/api`
5. Save and redeploy frontend

### Problem: Cannot Connect to MongoDB
**Error:** Backend crashes or cannot connect

**Fix:**
1. Verify MongoDB cluster is online:
   - https://www.mongodb.com/cloud/atlas → Clusters
2. Check `MONGO_URI` in Render environment:
   - Must have correct password
   - Must have correct cluster name
3. Verify network access:
   - MongoDB Atlas → Network Access → Should show 0.0.0.0/0
4. Render → `prestalink-backend` → Logs to see specific error

---

## 📞 QUICK REFERENCE

| Component | Domain | Status Check |
|-----------|--------|--------------|
| Frontend | https://prestalink.vercel.app | Open in browser |
| Backend | https://prestalink-backend-xxxxx.onrender.com | `curl /` → JSON response |
| Database | MongoDB Atlas | https://cloud.mongodb.com |
| GitHub | https://github.com/memetsaranur/PrestaLink | Browse repo |

| Environment Variable | Where Set | Value |
|----------------------|-----------|-------|
| NEXT_PUBLIC_API_URL | Vercel | https://prestalink-backend-xxxxx.onrender.com/api |
| MONGO_URI | Render | mongodb+srv://prestalink-admin:PASSWORD@... |
| JWT_SECRET | Render | (32+ random chars) |
| CLIENT_URL | Render | https://prestalink.vercel.app |

---

## 📋 DEPLOYMENT TIMELINE

| Phase | Duration | What |
|-------|----------|------|
| Phase 1 | 5 min | MongoDB Atlas setup |
| Phase 2 | 15 min | Render backend deploy |
| Phase 3 | 10 min | Vercel frontend deploy |
| Phase 4 | 2 min | Update backend CORS |
| Tests | 15 min | Run 8 verification tests |
| **TOTAL** | **~47 min** | **Full deployment** |

---

## 🚀 NEXT STEPS

1. **Follow Phases 1-4 above** in order
2. **Run all 8 post-deployment tests**
3. **If all pass:** Deployment is complete ✅
4. **If any fail:** See troubleshooting section

---

**Status:** Ready to deploy  
**Last Updated:** December 14, 2025  
**Commit:** c75d978 (pushed to GitHub)
