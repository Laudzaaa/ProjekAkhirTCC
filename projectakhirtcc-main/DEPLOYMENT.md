# 🚀 Google Cloud Deployment Guide - Rental Kendaraan App

Panduan lengkap untuk deploy aplikasi ke Google Cloud:
- **Backend**: App Engine (Node.js)
- **Frontend**: Firebase Hosting (React)
- **Database**: Cloud SQL (MySQL existing di 34.72.75.35)
- **Project**: `perpustakaan-kampus-497216`

---

## 📋 Prerequisites

✅ Sudah selesai:
- Google Cloud Project: `perpustakaan-kampus-497216` ✅
- gcloud CLI: Installed (v560.0.0) ✅
- Firebase CLI: Required (install jika belum)
- Backend .env: Configured ✅
- Frontend .env.production: Configured ✅
- app.yaml: Created untuk App Engine ✅
- firebase.json: Created untuk Firebase Hosting ✅

---

## 🔧 Setup

### 1. Install Firebase CLI (jika belum)
```bash
npm install -g firebase-tools
firebase login
```

### 2. Verify Google Cloud Setup
```bash
# Check active project
gcloud config get-value project
# Output should be: perpustakaan-kampus-497216

# Check Cloud SQL connectivity
gcloud sql instances list
```

---

## 🚀 Deployment Steps

### Step 1: Deploy Backend ke App Engine

```bash
# Navigate ke backend directory
cd projectakhirtcc-main/backend

# Deploy ke App Engine
gcloud app deploy app.yaml

# Monitor deployment
gcloud app logs read -u STDERR --limit 50

# Test backend endpoint
curl https://perpustakaan-kampus-497216.appspot.com/
```

**Expected Output:**
```
✅ API Rental Kendaraan Aktif 🚗🏍️
```

---

### Step 2: Build Frontend

```bash
# Navigate ke frontend directory
cd ../frontend

# Install dependencies
npm install

# Build untuk production
npm run build

# Verify build folder exists
ls -la build/
```

---

### Step 3: Deploy Frontend ke Firebase Hosting

```bash
# Navigate ke root project
cd ../..

# Login ke Firebase
firebase login

# Deploy ke Firebase Hosting
firebase deploy --only hosting

# Atau jika ingin deploy dengan options
firebase deploy --only hosting --project perpustakaan-kampus-497216
```

**Expected Output:**
```
✅ Deployed hosting to perpustakaan-kampus-497216
✨ Deploy complete!

Project Console: https://console.firebase.google.com/project/perpustakaan-kampus-497216
Hosting URL: https://perpustakaan-kampus-497216.firebaseapp.com
```

---

## 📊 Verification Checklist

Setelah deployment selesai, verify semuanya:

### ✅ Backend (App Engine)
- [ ] Backend running: `curl https://perpustakaan-kampus-497216.appspot.com/`
- [ ] API endpoint respond: `curl https://perpustakaan-kampus-497216.appspot.com/api/users`
- [ ] Database connected: Check Cloud SQL logs
- [ ] No errors: `gcloud app logs read --limit 100`

### ✅ Frontend (Firebase Hosting)
- [ ] Frontend accessible: `https://perpustakaan-kampus-497216.firebaseapp.com`
- [ ] Login page loads: ✅
- [ ] Can register: ✅
- [ ] Can login: ✅
- [ ] API calls working: Check browser console

### ✅ Database
- [ ] MySQL 34.72.75.35 accessible: `gcloud sql connect rental-kendaraan` (jika applicable)
- [ ] Tables synced: users, vehicles, rentals, payments, reviews, favorites
- [ ] Data persists: Create rental → check database

---

## 🔗 Production URLs

Setelah deployment:

| Service | URL |
|---------|-----|
| **Backend API** | `https://perpustakaan-kampus-497216.appspot.com/api` |
| **Frontend** | `https://perpustakaan-kampus-497216.firebaseapp.com` |
| **GCP Console** | `https://console.cloud.google.com/appengine?project=perpustakaan-kampus-497216` |
| **Firebase Console** | `https://console.firebase.google.com/project/perpustakaan-kampus-497216/hosting/sites` |

---

## 🛠️ Troubleshooting

### Backend tidak bisa connect ke Database
```bash
# Check Cloud SQL connectivity
gcloud sql instances describe rental-kendaraan

# Check firewall rules
gcloud sql instances describe rental-kendaraan --format="value(settings.ipConfiguration.authorizedNetworks)"

# Verify credentials di .env
cat projectakhirtcc-main/backend/.env | grep DB_
```

### Frontend API calls error 403
```
Solusi: Update REACT_APP_API_URL di .env.production
```

### Firebase Hosting blank page
```
Solusi: Verify firebase.json rewrites ke index.html
```

### App Engine timeout
```bash
# Increase instance memory
gcloud app update --memory 512Mi

# Increase timeout
gcloud app update --timeout 60
```

---

## 📈 Monitoring & Logs

### View Backend Logs
```bash
# Real-time logs
gcloud app logs read -u STDERR --limit 50 --follow

# Export logs
gcloud app logs read -u STDERR > backend-logs.txt
```

### View Firebase Hosting Logs
```bash
firebase hosting:channel:list
firebase deploy --only hosting
```

### Monitor App Engine Performance
```bash
# CPU, memory, requests
gcloud monitoring metrics-descriptors list

# Custom dashboard
gcloud monitoring dashboards create --config-from-file=dashboard.yaml
```

---

## 💰 Cost Estimation

| Service | Monthly Cost | Notes |
|---------|------------|-------|
| App Engine | ~$20-30 | 1 instance minimum |
| Firebase Hosting | ~$1-5 | Free tier: 1GB/day |
| Cloud SQL (existing) | ~$15-25 | Existing mysql 34.72.75.35 |
| **Total** | **~$40-60/month** | Within free tier limits |

---

## 🔐 Production Checklist

Sebelum production:

- [ ] Update JWT_SECRET ke nilai random/secure
- [ ] Enable Cloud SQL backups
- [ ] Setup Cloud Monitoring alerts
- [ ] Configure custom domain (optional)
- [ ] Enable HTTPS (automatic dengan Firebase)
- [ ] Restrict Cloud SQL firewall ke App Engine IP only
- [ ] Review security rules

---

## 📞 Quick Reference Commands

```bash
# Deploy everything
gcloud app deploy projectakhirtcc-main/backend/app.yaml && firebase deploy --only hosting

# Check deployment status
gcloud app versions list
firebase hosting:channel:list

# Rollback jika error
gcloud app versions delete [VERSION_ID]
firebase hosting:channels:delete [CHANNEL_ID]

# View real-time logs
gcloud app logs read -u STDERR --follow

# Get backend URL
gcloud app describe --format='value(defaultHostname)'

# Get frontend URL
firebase hosting:sites:list --project perpustakaan-kampus-497216
```

---

## ✅ Next Steps

1. **Deploy Backend**:
   ```bash
   cd projectakhirtcc-main/backend
   gcloud app deploy app.yaml
   ```

2. **Build & Deploy Frontend**:
   ```bash
   cd projectakhirtcc-main/frontend
   npm run build
   firebase deploy --only hosting
   ```

3. **Test endpoints**:
   - Backend: `https://perpustakaan-kampus-497216.appspot.com/`
   - Frontend: `https://perpustakaan-kampus-497216.firebaseapp.com`

4. **Monitor**:
   - Backend logs: `gcloud app logs read`
   - Firebase logs: Firebase Console

---

**Created**: 2025-05-23
**Project**: perpustakaan-kampus-497216
**Status**: Ready for deployment ✅
