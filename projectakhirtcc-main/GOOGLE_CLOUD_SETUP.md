# Setup Google Cloud untuk Perpustakaan Digital Kampus

Panduan lengkap setup Google Cloud Platform dengan pricing yang paling ekonomis untuk aplikasi Perpustakaan Digital Kampus.

## Pertimbangan Cost

Google Cloud menawarkan beberapa service yang cocok untuk aplikasi ini:

| Service | Pricing | Notes |
|---------|---------|-------|
| **Firestore** | $0.06/100K reads, $0.18/100K writes | Gratis 50K reads/hari, 20K writes/hari |
| **Cloud Storage** | $0.020/GB/bulan | Gratis 5GB/bulan (first year) |
| **Cloud Run** | $0.00002315/vCPU-second | Gratis 2M requests/bulan, 360K vCPU-seconds |
| **Firebase Auth** | Free (pay per use) | Gratis hingga 50K Sign-ups |
| **Cloud Pub/Sub** | $0.05/GB (ingress) | Alternative untuk messaging |

## Step-by-Step Setup

### 1. Create Google Cloud Project

```bash
# Login ke GCP Console
# https://console.cloud.google.com/

# Atau gunakan CLI:
gcloud projects create perpustakaan-kampus --name="Perpustakaan Digital Kampus"

# Set project aktif
gcloud config set project perpustakaan-kampus
```

### 2. Enable Required APIs

```bash
# Enable Firestore API
gcloud services enable firestore.googleapis.com

# Enable Cloud Storage API
gcloud services enable storage-api.googleapis.com

# Enable Firebase Admin SDK
gcloud services enable firebase.googleapis.com

# Enable Cloud Run API (untuk deploy)
gcloud services enable run.googleapis.com

# Enable Cloud Build API
gcloud services enable cloudbuild.googleapis.com
```

### 3. Setup Firestore Database

```bash
# Create Firestore database (Native mode, multi-region)
gcloud firestore databases create --location=asia-southeast1

# Atau gunakan Console:
# 1. Go to Cloud Console > Firestore
# 2. Create Database
# 3. Choose "Native Mode"
# 4. Location: asia-southeast1 (Singapore - paling dekat ke Indonesia, murah)
# 5. Enable
```

**Firestore Pricing Strategy:**
- Gunakan **Asia Southeast 1 (Singapore)** untuk latency rendah dan cost rendah
- Paket **Pay as you go** lebih murah dari Datastore untuk use case ini
- Set up Firestore Rules untuk keamanan:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection
    match /users/{userId} {
      allow read: if request.auth.uid == userId;
      allow create: if request.auth.uid == request.resource.data.uid;
      allow update: if request.auth.uid == userId;
      allow delete: if request.auth.uid == userId;
    }

    // Books collection (public read)
    match /books/{bookId} {
      allow read: if true;
      allow create: if request.auth.token.role == 'admin';
      allow update: if request.auth.token.role == 'admin';
      allow delete: if request.auth.token.role == 'admin';
    }

    // Favorites collection
    match /favorites/{favoriteId} {
      allow read, create, delete: if request.auth.uid == request.resource.data.userId;
    }

    // Reviews collection
    match /reviews/{reviewId} {
      allow read: if true;
      allow create: if request.auth != null;
      allow update, delete: if request.auth.uid == resource.data.userId || request.auth.token.role == 'admin';
    }

    // Download history
    match /download_history/{document=**} {
      allow write: if request.auth != null;
      allow read: if request.auth.token.role == 'admin';
    }
  }
}
```

### 4. Setup Firebase Authentication

```bash
# Enable Firebase Auth
gcloud services enable identitytoolkit.googleapis.com

# Di Console:
# 1. Go to Firebase Console > Authentication
# 2. Sign-in method > Email/Password > Enable
# 3. Set password requirements sesuai kebutuhan
```

### 5. Create Cloud Storage Bucket

```bash
# Create bucket untuk file buku
gsutil mb -l asia-southeast1 gs://perpustakaan-kampus-books

# Set bucket permissions
gsutil uniformbucketlevelaccess set on gs://perpustakaan-kampus-books

# Set CORS untuk download dari browser
cat > cors.json << EOF
[
  {
    "origin": ["http://localhost:3000", "https://yourdomain.com"],
    "method": ["GET", "HEAD", "PUT", "POST", "DELETE"],
    "responseHeader": ["Content-Type"],
    "maxAgeSeconds": 3600
  }
]
EOF

gsutil cors set cors.json gs://perpustakaan-kampus-books
```

**Storage Pricing:**
- Gunakan **Standard class** untuk akses frequent
- Lifecycle policy untuk auto-delete old files:

```bash
cat > lifecycle.json << EOF
{
  "lifecycle": {
    "rule": [
      {
        "action": {"type": "Delete"},
        "condition": {"age": 365}
      }
    ]
  }
}
EOF

gsutil lifecycle set lifecycle.json gs://perpustakaan-kampus-books
```

### 6. Create Service Account

```bash
# Create service account
gcloud iam service-accounts create perpustakaan-sa \
  --display-name="Perpustakaan Digital Service Account"

# Create key
gcloud iam service-accounts keys create key.json \
  --iam-account=perpustakaan-sa@perpustakaan-kampus.iam.gserviceaccount.com

# Grant permissions
gcloud projects add-iam-policy-binding perpustakaan-kampus \
  --member="serviceAccount:perpustakaan-sa@perpustakaan-kampus.iam.gserviceaccount.com" \
  --role="roles/datastore.user"

gcloud projects add-iam-policy-binding perpustakaan-kampus \
  --member="serviceAccount:perpustakaan-sa@perpustakaan-kampus.iam.gserviceaccount.com" \
  --role="roles/storage.objectAdmin"

gcloud projects add-iam-policy-binding perpustakaan-kampus \
  --member="serviceAccount:perpustakaan-sa@perpustakaan-kampus.iam.gserviceaccount.com" \
  --role="roles/firebase.admin"
```

Gunakan **key.json** untuk environment variables di backend.

### 7. Setup Environment Variables

Backend (.env):
```
FIREBASE_PROJECT_ID=perpustakaan-kampus
FIREBASE_PRIVATE_KEY=<isi dari key.json>
FIREBASE_CLIENT_EMAIL=perpustakaan-sa@perpustakaan-kampus.iam.gserviceaccount.com
FIREBASE_DATABASE_URL=https://perpustakaan-kampus.firebaseio.com
GCS_BUCKET_NAME=perpustakaan-kampus-books
JWT_SECRET=your-very-secure-random-secret-key-here
PORT=3001
NODE_ENV=production
CORS_ORIGIN=https://yourdomain.com
```

### 8. Deploy Backend ke Cloud Run

```bash
# Di folder digital-library-backend

# Create Dockerfile jika belum ada
cat > Dockerfile << EOF
FROM node:18-alpine

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .

EXPOSE 3000
CMD ["node", "index.js"]
EOF

# Build dan push image
gcloud builds submit --tag gcr.io/perpustakaan-kampus/digital-library-backend

# Deploy ke Cloud Run
gcloud run deploy digital-library-backend \
  --image gcr.io/perpustakaan-kampus/digital-library-backend \
  --platform managed \
  --region asia-southeast1 \
  --memory 512Mi \
  --cpu 1 \
  --set-env-vars FIREBASE_PROJECT_ID=perpustakaan-kampus,FIREBASE_CLIENT_EMAIL=perpustakaan-sa@perpustakaan-kampus.iam.gserviceaccount.com,GCS_BUCKET_NAME=perpustakaan-kampus-books,JWT_SECRET=your-secret \
  --allow-unauthenticated
```

### 9. Deploy Frontend ke Firebase Hosting

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login
firebase login

# Inisialisasi Firebase
firebase init hosting

# Build
npm run build

# Deploy
firebase deploy --only hosting
```

### 10. Monitor & Cost Control

```bash
# Set up budget alerts
gcloud billing budgets create \
  --billing-account=BILLING_ACCOUNT_ID \
  --display-name="Perpustakaan Kampus Monthly Budget" \
  --budget-amount=50 \
  --threshold-rule=percent=100

# Check current costs
gcloud billing accounts describe BILLING_ACCOUNT_ID
```

## Production Checklist

- ✅ Setup HTTPS/SSL (automatic dengan Cloud Run)
- ✅ Enable Firestore backup
- ✅ Setup monitoring & alerts
- ✅ Configure custom domain
- ✅ Setup CDN dengan Cloud CDN
- ✅ Enable Cloud Armor untuk security
- ✅ Setup logging dengan Cloud Logging

## Cost Estimation (per bulan)

```
Firestore:        ~$5-10 (dengan free tier)
Cloud Storage:    ~$1-5 (dengan lifecycle policy)
Cloud Run:        ~$5-15 (2M requests gratis)
Firebase Auth:    ~$0-5
---
TOTAL:            ~$15-35/bulan (very affordable!)
```

## Commands Reference

```bash
# List all resources
gcloud resource list

# Check Firestore size
gcloud firestore databases describe

# Monitor Cloud Run
gcloud run services list --region=asia-southeast1

# Check service account keys
gcloud iam service-accounts keys list \
  --iam-account=perpustakaan-sa@perpustakaan-kampus.iam.gserviceaccount.com

# Stream logs
gcloud run logs read digital-library-backend --limit 100 --region asia-southeast1
```

## Troubleshooting

### Connection refused
- Pastikan Cloud Run URL sudah di-whitelist di CORS
- Check Firestore security rules

### Authentication failed
- Verify service account credentials
- Check IAM roles

### Slow performance
- Gunakan Firestore indexes untuk query yang complex
- Enable Cloud CDN untuk static assets

## Resources

- [Firebase Console](https://console.firebase.google.com/)
- [GCP Console](https://console.cloud.google.com/)
- [Firebase Documentation](https://firebase.google.com/docs)
- [Firestore Pricing](https://firebase.google.com/pricing)
- [Cloud Run Pricing](https://cloud.google.com/pricing/compute/run)
