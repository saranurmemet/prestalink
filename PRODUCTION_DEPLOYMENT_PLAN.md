# 🚀 PRESTALINK PRODUCTION DEPLOYMENT PLAN

**Status:** READY FOR DEPLOYMENT ✅  
**Date:** December 14, 2025  
**Deployment Target:** Vercel (Frontend) + Render (Backend) + MongoDB Atlas (Database)

---

## ✅ PRE-DEPLOYMENT VERIFICATION

### Stability Checks (All Pass ✅)
- [x] Auth store has `hasHydrated` flag - routes wait for hydration
- [x] Protected routes DON'T redirect before hydration completes
- [x] No hardcoded production URLs in code (removed `prestalink.onrender.com` fallbacks)
- [x] API client uses ONLY `NEXT_PUBLIC_API_URL` environment variable
- [x] Backend CORS configured with explicit origins (NO wildcard with credentials)
- [x] Service worker disabled in dev, auth endpoints excluded from cache
- [x] All hardcoded URLs removed from utils and error handlers

---

## 📊 DISCOVERED DEPLOYMENT CONFIGURATION

### Frontend
- **Framework:** Next.js 14.2.11
- **Root Directory:** `frontend/`
- **Build Command:** `npm run build`
- **Start Command:** `npm start`
- **Target Platform:** Vercel
- **Expected Domain:** `https://prestalink.vercel.app`

### Backend
- **Framework:** Express.js (Node.js)
- **Root Directory:** `backend/`
- **Start Command:** `node server.js`
- **Health Check:** GET `/` (returns JSON)
- **Target Platform:** Render.com
- **Expected Domain:** `https://prestalink-backend.onrender.com`
- **Service Name:** `prestalink-backend` (from render.yaml)

### Database
- **Type:** MongoDB Atlas (Cloud)
- **Connection Method:** Connection String (Render environment variable)
- **Database Name:** `prestalink`

---

## 🔑 REQUIRED ENVIRONMENT VARIABLES

### Backend (Render Environment Variables)

**Must Set in Render Dashboard:**

```
NODE_ENV = production

MONGO_URI = mongodb+srv://prestalink-admin:PASSWORD@cluster-name.xxxxx.mongodb.net/prestalink?retryWrites=true&w=majority
(Obtain from MongoDB Atlas Connection String)

JWT_SECRET = (Generate strong 32+ character secret - DO NOT reuse from .env)

CLIENT_URL = https://prestalink.vercel.app
(Must exactly match frontend Vercel domain)

PORT = 5000
(Keep this - Render expects port 5000)
```

### Frontend (Vercel Environment Variables)

**Must Set in Vercel Dashboard → Settings → Environment Variables:**

```
NEXT_PUBLIC_API_URL = https://prestalink-backend.onrender.com/api
(Set for: Production, Preview, Development)
```

---

## 📋 STEP-BY-STEP DEPLOYMENT

### PHASE 1: DATABASE SETUP (MongoDB Atlas)

**Duration:** 5 minutes

1. **Create MongoDB Atlas Account**
   - Go to: https://www.mongodb.com/cloud/atlas
   - Sign up (free tier available)
   - Create organization and project

2. **Create Cluster**
   - Click "Create a Deployment"
   - Select "M0 FREE" (Shared)
   - Cloud Provider: AWS
   - Region: Select closest to your location (Frankfurt recommended for Europe)
   - Cluster Name: `prestalink-cluster`
   - Click "Create Deployment"
   - Wait 3-5 minutes for cluster creation

3. **Create Database User**
   - Left menu: "Database Access"
   - "Add New Database User"
   - Authentication: Password
   - Username: `prestalink-admin`
   - Password: Generate strong password (32+ characters, copy to notepad)
   - Database Privileges: "Read and write to any database"
   - Click "Add User"

4. **Allow Network Access**
   - Left menu: "Network Access"
   - "Add IP Address"
   - Select "Allow Access from Anywhere" (0.0.0.0/0)
   - This is required for Render to connect
   - Click "Confirm"

5. **Get Connection String**
   - Left menu: "Clusters" → "Database"
   - Click "Connect" button on your cluster
   - Choose "Drivers"
   - Driver: Node.js, Version: 5.5+
   - Copy connection string: `mongodb+srv://prestalink-admin:<PASSWORD>@cluster-xxxxx.mongodb.net/?retryWrites=true&w=majority`
   - Replace `<PASSWORD>` with your password from step 3
   - Add `/prestalink` before `?` to specify database name
   - **FINAL STRING:** `mongodb+srv://prestalink-admin:PASSWORD@cluster-xxxxx.mongodb.net/prestalink?retryWrites=true&w=majority`

✅ **Save:** MONGO_URI (full connection string with password)

---

### PHASE 2: BACKEND DEPLOYMENT (Render)

**Duration:** 10-15 minutes (includes deployment time)

**Prerequisites:** GitHub account with repo pushed

1. **Push Code to GitHub**
   ```powershell
   cd C:\Users\RANDOM\Desktop\prestalink
   
   # Initialize git (if not already done)
   git init
   git add .
   git commit -m "Production-ready: All fixes applied"
   
   # Create GitHub repo named 'prestalink' and push
   git remote add origin https://github.com/YOUR_USERNAME/prestalink.git
   git branch -M main
   git push -u origin main
   ```

2. **Create Render Account**
   - Go to: https://render.com
   - Sign up (free account)
   - Choose "GitHub" authentication

3. **Deploy Backend Service**
   - Click "New +" → "Web Service"
   - Select your `prestalink` GitHub repository
   - Settings:
     - **Name:** `prestalink-backend`
     - **Region:** Europe (Frankfurt)
     - **Branch:** main
     - **Root Directory:** `backend`
     - **Environment:** Node
     - **Build Command:** `npm install` (from render.yaml)
     - **Start Command:** `node server.js` (from render.yaml)
     - **Plan:** Free
   - Click "Create Web Service"

4. **Add Environment Variables in Render**
   - After service creation, go to "Environment" tab
   - Add each variable:
     
     ```
     NODE_ENV = production
     ```
     
     ```
     MONGO_URI = mongodb+srv://prestalink-admin:PASSWORD@cluster-xxxxx.mongodb.net/prestalink?retryWrites=true&w=majority
     ```
     (Replace PASSWORD with your MongoDB password)
     
     ```
     JWT_SECRET = (Generate: use https://www.random.org/strings/ or: openssl rand -hex 32)
     ```
     Example: `a7f2d8e1b9c3f5a2d8e1b9c3f5a2d8e1b9c3f5a2d8e1b9c3f5a2d8e1b9c3f5`
     
     ```
     CLIENT_URL = https://prestalink.vercel.app
     ```
     (Update this AFTER frontend is deployed - for now use temporary)
     
     ```
     PORT = 5000
     ```

5. **Monitor Deployment**
   - Render dashboard shows deployment progress
   - Wait for "Live" status (green checkmark)
   - You'll get a URL: `https://prestalink-backend-xxxxx.onrender.com`

6. **Test Backend**
   ```powershell
   # Test health check
   Invoke-WebRequest -Uri "https://prestalink-backend-xxxxx.onrender.com/" -Method GET
   
   # Should return: {"message":"Prestalink API is running"}
   ```

✅ **Save:** `BACKEND_URL = https://prestalink-backend-xxxxx.onrender.com`

---

### PHASE 3: FRONTEND DEPLOYMENT (Vercel)

**Duration:** 5-10 minutes

1. **Create Vercel Account**
   - Go to: https://vercel.com
   - Sign up (free account)
   - Choose "GitHub" authentication

2. **Deploy Frontend**
   - Click "New Project"
   - Select your `prestalink` GitHub repository
   - Settings (auto-detected):
     - **Framework:** Next.js (auto-selected)
     - **Root Directory:** `frontend`
     - **Build Command:** `npm run build`
     - **Output Directory:** `.next`
   - Click "Deploy"
   - Wait 5-10 minutes for deployment

3. **Add Environment Variables in Vercel**
   - After deployment, go to Project → Settings → Environment Variables
   - Add:
     ```
     NEXT_PUBLIC_API_URL = https://prestalink-backend-xxxxx.onrender.com/api
     ```
     (Replace xxxxx with actual Render service name from Phase 2)
   - Set for: **Production, Preview, Development** (all three)
   - Click "Save"

4. **Trigger Redeployment**
   - After adding env variables, go to "Deployments"
   - Click the three dots on latest deployment
   - Select "Redeploy"
   - Wait for new deployment to complete

5. **Test Frontend**
   - Open: `https://prestalink.vercel.app`
   - Should load login page (not error)
   - Open DevTools → Network tab
   - Should see API calls to `https://prestalink-backend-xxxxx.onrender.com/api`

✅ **Save:** `FRONTEND_URL = https://prestalink.vercel.app`

---

### PHASE 4: BACKEND FINAL CONFIGURATION

**Duration:** 2 minutes

Now that frontend URL is known, update backend CLIENT_URL:

1. **Go to Render Dashboard**
   - Select `prestalink-backend` service
   - Click "Environment"
   - Edit `CLIENT_URL`:
     ```
     https://prestalink.vercel.app
     ```
   - Click "Save"

2. **Automatic Redeploy**
   - Render will redeploy backend automatically
   - Wait for "Live" status again

✅ Now both services have correct domain configurations!

---

## 🧪 POST-DEPLOYMENT STABILITY TESTS

### Test 1: Backend Connectivity ✅
```powershell
# Health check
Invoke-WebRequest -Uri "https://prestalink-backend-xxxxx.onrender.com/" -Method GET

# Should return: {"message":"Prestalink API is running"}
```

### Test 2: Frontend Loads ✅
- Open: `https://prestalink.vercel.app`
- Should see login page
- No console errors

### Test 3: CORS Working ✅
- Login page → DevTools → Network tab
- Click "Login" with test credentials
- Check POST `/api/auth/user/login` request
- Status should be: 401 (credentials invalid is OK)
- Headers should have: `Access-Control-Allow-Origin: https://prestalink.vercel.app`

### Test 4: Hydration Stable ✅
1. Login with valid credentials
2. Dashboard loads
3. Press F5 (refresh page)
   - ✅ PASS: Dashboard still shows (NOT redirected to login)
4. Repeat F5 five more times rapidly
   - ✅ PASS: Always stays on dashboard

### Test 5: Persistence ✅
1. Dashboard is open
2. Close browser tab completely
3. Open new tab → https://prestalink.vercel.app
   - ✅ PASS: Dashboard loads immediately (still logged in)

### Test 6: Protected Routes ✅
1. Logout (or clear localStorage: DevTools → Application → Local Storage → Delete prestalink-auth)
2. Navigate to: https://prestalink.vercel.app/user/dashboard
   - ✅ PASS: Redirected to login page

### Test 7: API URL Correct ✅
1. Open frontend
2. DevTools → Network tab
3. Perform any API call
4. Check request URL:
   - ✅ PASS: URL is `https://prestalink-backend-xxxxx.onrender.com/api/...` (NOT localhost, NOT /api/api)

### Test 8: PWA (if enabled) ✅
1. Open frontend on phone (same Wi-Fi)
2. Install PWA (browser menu)
3. Close app completely
4. Reopen app 5 times
   - ✅ PASS: Each time loads correctly, auth persists

---

## 📊 EXPECTED RESULTS

| Component | Domain | Status |
|-----------|--------|--------|
| Frontend | https://prestalink.vercel.app | ✅ Running |
| Backend | https://prestalink-backend-xxxxx.onrender.com | ✅ Running |
| Database | MongoDB Atlas (cloud) | ✅ Connected |
| Auth | Zustand + localStorage | ✅ Hydrated |
| API | /api/... prefix | ✅ Correct |
| CORS | Explicit origins | ✅ Allowed |

---

## 🚨 IF SOMETHING BREAKS

### Problem: "Cannot reach backend" (CORS error)
**Fix:**
1. Render dashboard → Service → Environment
2. Check `CLIENT_URL` matches Vercel domain exactly
3. Click "Save" to redeploy
4. Wait 2-3 minutes for backend to restart

### Problem: "Redirect loop on refresh"
**Fix:**
1. Vercel dashboard → Settings → Environment Variables
2. Verify `NEXT_PUBLIC_API_URL` is set exactly as: `https://prestalink-backend-xxxxx.onrender.com/api`
3. Redeploy frontend
4. Clear browser cache (DevTools → Application → Clear site data)

### Problem: "Wrong API URL in Network tab"
**Fix:**
1. Vercel dashboard → Deployments
2. Delete all old deployments
3. Redeploy latest
4. Check env variables are set correctly

### Problem: "/api/api in URL"
**Fix:**
1. Check `NEXT_PUBLIC_API_URL` ends with `/api` (not `/api/api`)
2. Correct in Vercel environment variables
3. Redeploy frontend

---

## ✅ FINAL CHECKLIST

- [ ] MongoDB Atlas cluster created
- [ ] Database user created with connection string saved
- [ ] Code pushed to GitHub (main branch)
- [ ] Backend deployed on Render (service online)
- [ ] Frontend deployed on Vercel (site live)
- [ ] Backend env vars set (MONGO_URI, JWT_SECRET, CLIENT_URL, NODE_ENV, PORT)
- [ ] Frontend env var set (NEXT_PUBLIC_API_URL)
- [ ] Backend redeployed after frontend URL known
- [ ] All 8 post-deployment tests PASS
- [ ] No console errors in DevTools
- [ ] API calls go to production backend (not localhost)
- [ ] No CORS errors
- [ ] Auth persists on refresh
- [ ] Auth persists on close/reopen
- [ ] Protected routes redirect correctly

---

## 🎯 NEXT STEPS AFTER DEPLOYMENT

1. **Monitor Logs**
   - Vercel: https://vercel.com/dashboard → prestalink → Deployments
   - Render: https://dashboard.render.com → prestalink-backend → Logs

2. **Set Up Error Tracking** (Optional)
   - Sentry (free tier): https://sentry.io
   - Monitor production errors

3. **Set Up Monitoring** (Optional)
   - Uptime monitoring
   - Performance monitoring

4. **Create Production Users**
   - SSH into backend (Render shell access)
   - Or use seed script if available

---

**STATUS: READY FOR PRODUCTION DEPLOYMENT ✅**

All stability fixes applied. All environment variables documented. All services configured.
Follow the step-by-step deployment and run the 8 tests. Application will be stable in production.
