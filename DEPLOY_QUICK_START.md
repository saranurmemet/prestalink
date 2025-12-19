# ⚡ Hızlı Deployment Başlangıç

## 🎯 5 Dakikada Deploy

### 1. MongoDB Atlas (2 dakika)
1. https://www.mongodb.com/cloud/atlas → Sign Up
2. M0 FREE cluster oluştur
3. Database User: `prestalink` + şifre
4. Network Access: `0.0.0.0/0`
5. Connection string'i kopyala

### 2. Vercel Frontend (2 dakika)
```powershell
cd frontend
npm install -g vercel
vercel login
vercel --prod
```
Vercel Dashboard → Settings → Environment Variables:
- `NEXT_PUBLIC_API_URL` = `http://localhost:5000/api` (geçici)

### 3. Render Backend (1 dakika)
1. https://dashboard.render.com → New + → Web Service
2. GitHub repo seç
3. Ayarlar:
   - Root Directory: `backend`
   - Build: `npm install`
   - Start: `npm start`
4. Environment Variables:
   - `MONGO_URI` = (Atlas connection string)
   - `JWT_SECRET` = (rastgele 32+ karakter)
   - `CLIENT_URL` = (Vercel URL - sonra güncelle)
   - `NODE_ENV` = `production`
   - `PORT` = `5000`
   - `HOST` = `0.0.0.0`

### 4. Bağlantı (1 dakika)
- Render → CLIENT_URL = Vercel URL
- Vercel → NEXT_PUBLIC_API_URL = Render URL + `/api`
- Her ikisinde de Redeploy

**Detaylı rehber için:** `DEPLOY_VERCEL_RENDER.md`

