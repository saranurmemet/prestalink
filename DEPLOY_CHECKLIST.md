# PrestaLink Deployment Checklist

## Pre-Deployment Requirements

### ✅ Local Testing (MUST COMPLETE FIRST)
- [ ] Backend runs locally: `cd backend && npm run dev`
- [ ] Backend health check: `http://localhost:5000/api/health` returns 200
- [ ] Frontend runs locally: `cd frontend && npm run dev`
- [ ] Frontend builds successfully: `cd frontend && npm run build`
- [ ] Frontend production server: `cd frontend && npm run start`
- [ ] Auth flow tested: Register → Login → Dashboard → Logout
- [ ] All roles tested: User, Recruiter, Admin
- [ ] Protected routes working
- [ ] API calls working from frontend

---

## Backend Deployment (Render)

### Environment Variables (Set in Render Dashboard)
```
NODE_ENV=production
PORT=5000
HOST=0.0.0.0
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/prestalink?retryWrites=true&w=majority
JWT_SECRET=<generate-strong-secret-32-chars-min>
CLIENT_URL=https://your-frontend-domain.vercel.app
```

### Build Configuration
- **Root Directory:** `backend`
- **Build Command:** `npm install`
- **Start Command:** `node server.js`
- **Node Version:** 22.16.0 (or latest LTS)

### Post-Deployment Tests
- [ ] Health check: `https://your-backend.onrender.com/api/health`
- [ ] Test endpoint: `https://your-backend.onrender.com/api/test`
- [ ] CORS working (check browser console)
- [ ] Auth endpoints accessible

---

## Frontend Deployment (Vercel)

### Environment Variables (Set in Vercel Dashboard)
```
NEXT_PUBLIC_API_URL=https://your-backend.onrender.com/api
```

### Build Configuration
- **Framework Preset:** Next.js
- **Root Directory:** `frontend` (or leave empty if using vercel.json)
- **Build Command:** `cd frontend && npm run build` (if root directory not set)
- **Output Directory:** `frontend/.next` (if root directory not set)
- **Install Command:** `cd frontend && npm install` (if root directory not set)

### Post-Deployment Tests
- [ ] Frontend loads: `https://your-frontend.vercel.app`
- [ ] Login page accessible
- [ ] API calls working (check Network tab)
- [ ] No CORS errors
- [ ] Register flow works
- [ ] Login flow works
- [ ] Dashboard loads after login
- [ ] Protected routes redirect to login when not authenticated

---

## Critical Checks

### CORS Configuration
- ✅ Development: Allows `http://localhost:3000`
- ✅ Production: Uses `CLIENT_URL` environment variable
- ✅ No wildcard origins (security)

### Environment Variables
- ✅ Backend: All required variables set
- ✅ Frontend: `NEXT_PUBLIC_API_URL` set correctly
- ✅ No hardcoded URLs in code

### Security
- ✅ JWT_SECRET is strong (32+ characters)
- ✅ MongoDB connection string is secure
- ✅ No secrets in code or git

---

## Deployment Order

1. **Deploy Backend First**
   - Set all environment variables
   - Wait for successful deployment
   - Test backend endpoints

2. **Update Frontend ENV**
   - Set `NEXT_PUBLIC_API_URL` to backend URL
   - Deploy frontend
   - Test full flow

3. **Update Backend CORS**
   - Add frontend URL to `CLIENT_URL` if needed
   - Redeploy backend if CORS changes

---

## Rollback Plan

If deployment fails:
1. Check deployment logs
2. Verify environment variables
3. Test locally with production ENV values
4. Rollback to previous deployment
5. Fix issues and redeploy

---

## Post-Deployment Monitoring

- [ ] Monitor error logs
- [ ] Check API response times
- [ ] Verify database connections
- [ ] Test user registration
- [ ] Test user login
- [ ] Monitor CORS errors
- [ ] Check build logs for warnings

---

## Support Contacts

- Backend Issues: Check Render logs
- Frontend Issues: Check Vercel logs
- Database Issues: Check MongoDB Atlas logs







