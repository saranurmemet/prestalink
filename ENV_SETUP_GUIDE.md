# Quick Reference: Environment Setup for All Scenarios

## Scenario 1: Local PC Development (Chrome)

### Setup Steps:
1. Ensure backend is running: `http://localhost:5000`
2. Ensure frontend is running: `http://localhost:3000`
3. Frontend .env.local is already set to: `NEXT_PUBLIC_API_URL=http://localhost:5000/api`

### Test:
- Open `http://localhost:3000/login`
- Enter any registered user credentials
- Verify dashboard loads after login
- Refresh page → Should NOT redirect to login
- Close tab, reopen → Should show dashboard (still logged in)

---

## Scenario 2: PWA / Mobile on Same Network (Wi-Fi)

### PC Setup:
1. Find your PC's local IP:
   ```powershell
   ipconfig
   # Look for IPv4 Address (e.g., 192.168.1.14)
   ```

2. Update frontend .env.local:
   ```bash
   NEXT_PUBLIC_API_URL=http://192.168.1.14:5000/api
   # Replace 192.168.1.14 with your actual PC IP
   ```

3. Restart frontend dev server:
   ```bash
   npm run dev -H 0.0.0.0
   ```

4. Backend already listens on 0.0.0.0:5000 (all interfaces)

### Mobile Setup:
1. Connect phone to same Wi-Fi network as PC
2. Open phone browser: `http://192.168.1.14:3000`
3. Login with credentials
4. Test: Close app → Reopen → Should still be logged in
5. Repeat 5 times → Should be stable every time

### Verify:
- Check Network tab in DevTools:
  - API URL should be `http://192.168.1.14:5000/api`
  - No CORS errors
  - All API calls succeed

---

## Scenario 3: Deployment (Render/Vercel)

### Backend (Render) Environment Variables:
```
NODE_ENV=production
PORT=5000
CLIENT_URL=https://prestalink.vercel.app
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your-secret-key
```

### Frontend (Vercel) Environment Variables:
```
NEXT_PUBLIC_API_URL=https://prestalink-api.onrender.com/api
```

### After Deploy:
1. Test login on deployed frontend
2. Verify dashboard loads
3. Refresh dashboard → Should NOT redirect
4. Close and reopen → Should still show dashboard
5. Check Network tab:
   - API URL should be https://...
   - No CORS errors
   - No mixed http/https

---

## Environment Variable Reference

### Frontend (.env / .env.local)

| Variable | Local PC | Local Mobile | Production |
|----------|----------|--------------|------------|
| `NEXT_PUBLIC_API_URL` | `http://localhost:5000/api` | `http://192.168.x.x:5000/api` | `https://api.example.com/api` |

**Rules:**
- .env has defaults for PC development
- .env.local overrides for specific setup (PWA, mobile)
- NEXT_PUBLIC_* variables are embedded in bundle at build time
- MUST be set before `npm run build` for production
- Never hardcode URL in code (use ONLY env variables)

### Backend (.env)

| Variable | Development | Production |
|----------|-------------|------------|
| `NODE_ENV` | `development` | `production` |
| `PORT` | `5000` | `5000` |
| `HOST` | `0.0.0.0` | `0.0.0.0` |
| `CLIENT_URL` | `http://localhost:3000,http://192.168.x.x:3000` | `https://prestalink.vercel.app` |
| `MONGODB_URI` | `mongodb://localhost:27017/prestalink` | `mongodb+srv://...` |
| `JWT_SECRET` | any string | complex secret key |

**Rules:**
- CLIENT_URL: comma-separated list of allowed frontend origins
- Must include ALL possible frontend URLs (localhost, PWA, deployed)
- CORS will reject requests from unlisted origins
- In production, keep only exact deployed domains (no wildcards)

---

## Troubleshooting

### Problem: Dashboard redirects to login after refresh
**Solution:**
- Check that `hasHydrated` is working:
  ```
  DevTools → Console → check useAuthStore().hasHydrated
  Should be true after page loads
  ```
- Verify localStorage has `prestalink-auth` key:
  ```
  DevTools → Application → Local Storage → prestalink-auth
  Should contain token and user data
  ```

### Problem: PWA doesn't stay logged in after close/reopen
**Solution:**
- PWA caching issue: Check Network → Service Workers tab
- Solution already applied: Disabled PWA in dev, set NetworkFirst for APIs
- To re-enable PWA: Set `PWA_ENABLED=true` environment variable

### Problem: API calls fail with CORS error
**Solution:**
- Check Origin header matches CLIENT_URL on backend
- Verify NEXT_PUBLIC_API_URL is correct on frontend
- For mobile: Use local IP (192.168.x.x), not localhost
- For production: Use HTTPS, not HTTP

### Problem: Login fails with 401
**Solution:**
- Check credentials are correct
- Verify backend is running
- Check /api endpoint responds (use curl or Postman)
- Verify JWT_SECRET is set

### Problem: API calls go to wrong URL
**Solution:**
- Check frontend NEXT_PUBLIC_API_URL is set
- For production: Rebuild frontend after changing env variable
- For dev: Restart frontend dev server after .env.local change
- Check Network tab: Request URL should match NEXT_PUBLIC_API_URL

---

## Quick Commands

### Start all services:
```powershell
# Terminal 1: Backend
cd backend
npm run dev

# Terminal 2: Frontend  
cd frontend
npm run dev
```

### Get local PC IP:
```powershell
ipconfig | findstr /I "IPv4"
```

### Test backend is running:
```powershell
curl http://localhost:5000/api/auth/user/login
# or
Invoke-WebRequest -Uri http://localhost:5000/api -ErrorAction SilentlyContinue
```

### Check frontend .env:
```powershell
Get-Content frontend\.env.local
```

### Clear browser cache (development):
```
DevTools → Application → Clear site data
Or: Ctrl+Shift+Delete → Cookies and cached images
```

### Rebuild frontend with new API URL:
```powershell
cd frontend
npm run build  # Uses NEXT_PUBLIC_API_URL at build time
npm start      # Serves production build locally
```

---

## Final Checklist Before Deployment

- [ ] `.env.local` has NEXT_PUBLIC_API_URL set correctly
- [ ] `backend/.env` has NODE_ENV, PORT, CLIENT_URL set
- [ ] CORS test passes: Origin header matches CLIENT_URL
- [ ] Login works and dashboard displays
- [ ] Refresh dashboard does NOT redirect to login
- [ ] Close/reopen browser shows dashboard (not login)
- [ ] Multiple login cycles work without errors
- [ ] Network tab shows correct API base URL
- [ ] No CORS errors in DevTools Console
- [ ] No 401/403 errors (only expected after logout)
- [ ] Production build tested locally with prod env variables
