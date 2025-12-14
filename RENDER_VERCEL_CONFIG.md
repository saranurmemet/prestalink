# 🚀 RENDER & VERCEL DEPLOYMENT CONFIGURATION

**Status:** ✅ READY FOR DEPLOYMENT  
**Date:** December 14, 2025  
**MongoDB:** Connected  
**Backend:** Ready to deploy  
**Frontend:** Ready to deploy

---

## 📊 ENVIRONMENT VARIABLES (Ready)

### Backend (Render)
```
MONGO_URI=mongodb+srv://memetsaranur_db_user:Asil1234@cluster0.3xiborf.mongodb.net/prestalink?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=735d982cfe9b39d9a62b3017f6b3799a11d7b302c2ae3e6cfa69e621c96b5ef9
PORT=5000
CLIENT_URL=https://prestalink.vercel.app
NODE_ENV=production
HOST=0.0.0.0
```

### Frontend (Vercel)
```
NEXT_PUBLIC_API_URL=https://prestalink-backend-xxxxx.onrender.com/api
(Will be set after Render deployment gets the URL)
```

---

## ✅ RENDER DEPLOYMENT STEPS

### STEP 1: Go to Render.com
https://render.com

### STEP 2: New Web Service
- Click "New +" → "Web Service"
- Connect GitHub

### STEP 3: Select Repository
```
Repository: memetsaranur/PrestaLink
Branch: main
```

### STEP 4: Configure Service
```
Name: prestalink-backend
Root Directory: backend/
Runtime: Node
Build Command: npm install
Start Command: node server.js
Plan: Free
Region: Frankfurt
```

### STEP 5: Add Environment Variables
Copy and paste these:
```
MONGO_URI=mongodb+srv://memetsaranur_db_user:Asil1234@cluster0.3xiborf.mongodb.net/prestalink?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=735d982cfe9b39d9a62b3017f6b3799a11d7b302c2ae3e6cfa69e621c96b5ef9
PORT=5000
CLIENT_URL=https://prestalink.vercel.app
NODE_ENV=production
HOST=0.0.0.0
```

### STEP 6: Deploy
Click "Create Web Service"
Wait 10-15 minutes for deployment
**SAVE THE URL:** https://prestalink-backend-xxxxx.onrender.com

---

## ✅ VERCEL DEPLOYMENT STEPS

### STEP 1: Go to Vercel.com
https://vercel.com

### STEP 2: New Project
- Click "Add New" → "Project"
- Connect GitHub

### STEP 3: Select Repository
```
Repository: memetsaranur/PrestaLink
```

### STEP 4: Configure Project
```
Root Directory: frontend/
Framework: Next.js
```

### STEP 5: Deploy
Click "Deploy"
Wait 5-10 minutes

### STEP 6: Add Environment Variable
After deploy completes:
- Go to Settings → Environment Variables
- Add:
```
NEXT_PUBLIC_API_URL=https://prestalink-backend-xxxxx.onrender.com/api
(Replace xxxxx with your Render service ID)
```
- Set for: Production, Preview, Development

### STEP 7: Redeploy Frontend
- Go to Deployments
- Click "..." on latest
- Select "Redeploy"
- Wait 5 minutes

**SAVE THE URL:** https://prestalink.vercel.app

---

## ✅ POST-DEPLOYMENT VERIFICATION

### Test 1: Backend Health
```bash
curl https://prestalink-backend-xxxxx.onrender.com/
Expected: {"message":"Prestalink API is running"}
```

### Test 2: Frontend Loads
```
Open: https://prestalink.vercel.app
Expected: Login page appears
```

### Test 3: CORS Working
```
1. Open frontend
2. DevTools → Network
3. Login (any credentials)
4. Look at POST /api/auth/user/login response
Expected Header: Access-Control-Allow-Origin: https://prestalink.vercel.app
```

### Test 4: Refresh Stability
```
1. Login to dashboard
2. Press F5 five times rapidly
Expected: Dashboard always shows (no redirect to login)
```

### Test 5: Persistence
```
1. Dashboard open
2. Close browser tab completely
3. Open new tab → https://prestalink.vercel.app
Expected: Dashboard loads immediately (still logged in)
```

### Test 6: Protected Routes
```
1. Clear localStorage (prestalink-auth)
2. Go to: https://prestalink.vercel.app/user/dashboard
Expected: Redirected to login page
```

### Test 7: API URL Correct
```
1. Login to dashboard
2. DevTools → Network tab
3. Any API call
Expected URL: https://prestalink-backend-xxxxx.onrender.com/api/...
(NOT localhost, NOT /api/api)
```

### Test 8: Console Clean
```
1. Open frontend
2. DevTools → Console
Expected: No errors, no CORS warnings
```

---

## 📋 DEPLOYMENT TIMELINE

| Phase | Duration | Status |
|-------|----------|--------|
| Render Backend | 15 min | TODO |
| Vercel Frontend | 10 min | TODO |
| Environment Setup | 2 min | TODO |
| 8 Tests | 15 min | TODO |
| **TOTAL** | **~42 min** | **Ready to start** |

---

## ✨ SUCCESS CRITERIA

✅ All 8 tests PASS  
✅ Frontend: https://prestalink.vercel.app (live)  
✅ Backend: https://prestalink-backend-xxxxx.onrender.com (live)  
✅ Database: MongoDB Atlas (connected)  
✅ Users can login (no errors)  
✅ Dashboard loads after refresh (hydration works)  
✅ API calls go to production backend  
✅ Console has no errors

---

## 🎯 NEXT ACTION

```
1. Open Render.com
2. Follow "Render Deployment Steps" above
3. Wait for backend deploy
4. Open Vercel.com
5. Follow "Vercel Deployment Steps" above
6. Run all 8 tests
7. All pass = PRODUCTION LIVE! 🚀
```

---

**MongoDB:** ✅ Connected  
**Code:** ✅ Ready  
**Environment:** ✅ Configured  
**Status:** 🟢 READY TO DEPLOY

Deployment başlayabilirsin! 🚀
