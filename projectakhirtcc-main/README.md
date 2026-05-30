# Perpustakaan Digital Kampus

Aplikasi web perpustakaan digital kampus yang modern dan scalable, dibangun dengan teknologi terkini dan deployment di Google Cloud Platform dengan pricing yang ekonomis.

## 🎯 Overview

Aplikasi ini menyediakan solusi lengkap untuk manajemen dan akses koleksi buku akademik secara digital. Dengan fitur lengkap seperti search, favorites, reviews, dan file upload ke cloud storage.

### 💡 Keunggulan

✨ **Modern Tech Stack** - React + Node.js + Firebase + Google Cloud
💰 **Cost Effective** - Pricing terjangkau dengan free tier yang cukup
🚀 **Scalable** - Siap untuk jutaan pengguna
🔒 **Secure** - Authentication JWT, role-based access control
📱 **Responsive** - Mobile-friendly interface
⚡ **Fast** - Cloud CDN, optimized queries

🔐 **Deployment security** - Prefer Cloud SQL socket connections for App Engine and store secrets in Secret Manager (avoid committing DB passwords in repo)

## 📂 Project Structure

```
projectakhirtcc-main/
│
├── digital-library-backend/          # Backend API (Express.js)
│   ├── config/
│   │   └── firebase.js              # Firebase configuration
│   ├── controllers/                 # Business logic
│   │   ├── user.controller.js
│   │   ├── book.controller.js
│   │   ├── favorite.controller.js
│   │   └── review.controller.js
│   ├── middleware/
│   │   └── verifyToken.js           # Auth & error handling
│   ├── routes/                      # API routes
│   │   ├── user.routes.js
│   │   ├── book.routes.js
│   │   ├── favorite.routes.js
│   │   └── review.routes.js
│   ├── utils/
│   │   └── tokenManager.js          # JWT utilities
│   ├── .env.example
│   ├── .gitignore
│   ├── Dockerfile
│   ├── cloudbuild.yaml
│   ├── package.json
│   ├── README.md
│   └── index.js
│
├── digital-library-frontend/        # Frontend (React)
│   ├── public/
│   │   ├── index.html
│   │   ├── manifest.json
│   │   └── robots.txt
│   ├── src/
│   │   ├── api/
│   │   │   ├── axios.js            # Axios config & interceptors
│   │   │   └── api.js              # API endpoints
│   │   ├── components/
│   │   │   └── PrivateRoute.js     # Route protection
│   │   ├── pages/
│   │   │   ├── LoginPage.js
│   │   │   ├── RegisterPage.js
│   │   │   ├── Dashboard.js
│   │   │   ├── BookDetail.js
│   │   │   └── TambahBuku.js
│   │   ├── styles/
│   │   │   ├── Auth.css
│   │   │   ├── Dashboard.css
│   │   │   ├── BookDetail.css
│   │   │   └── AdminForm.css
│   │   ├── App.js
│   │   ├── index.js
│   │   ├── index.css
│   │   ├── reportWebVitals.js
│   │   └── setupTests.js
│   ├── package.json
│   ├── README.md
│   └── .env
│
├── QUICK_START.md                   # Quick start guide (start here!)
├── GOOGLE_CLOUD_SETUP.md            # GCP setup & deployment
└── README.md                        # This file
```

## 🚀 Quick Start

**⏱️ 5 minutes to get started!**

```bash
# 1. Clone/Extract project
cd projectakhirtcc-main

# 2. Backend setup
cd digital-library-backend
npm install
cp .env.example .env
npm run dev

# 3. Frontend setup (new terminal)
cd digital-library-frontend
npm install
echo "REACT_APP_API_URL=http://localhost:3001/api" > .env
npm start
```

✅ App akan buka di `http://localhost:3000`

👉 **Lihat [QUICK_START.md](./QUICK_START.md) untuk panduan detail!**

## 🎨 Features

### User Features
- ✅ Register & Login dengan email/password
- ✅ Profile management
- ✅ Browse koleksi buku
- ✅ Search & filter by category
- ✅ Download buku
- ✅ Tambah ke favorites
- ✅ Lihat review & rating dari user lain
- ✅ Beri review & rating untuk buku

### Admin Features
- ✅ Upload buku baru
- ✅ Edit informasi buku
- ✅ Delete buku
- ✅ Manage user accounts
- ✅ View download statistics

### System Features
- ✅ JWT authentication
- ✅ MySQL database
- ✅ Google Cloud Storage untuk files
- ✅ App Engine ready deployment
- ✅ Cloud SQL ready deployment
- ✅ CORS enabled
- ✅ Error handling

## 🛠️ Tech Stack

### Backend
| Component | Technology |
|-----------|-----------|
| Runtime | Node.js |
| Framework | Express.js |
| Database | MySQL / Cloud SQL |
| Storage | Google Cloud Storage |
| Authentication | JWT |
| File Upload | Multer |
| Security | Bcrypt, JWT |

### Frontend
| Component | Technology |
|-----------|-----------|
| Library | React 18 |
| Routing | React Router v6 |
| HTTP Client | Axios |
| Styling | CSS3 |
| Package Manager | npm |

### Infrastructure
| Service | Provider |
|---------|----------|
| Database | Cloud SQL |
| File Storage | Google Cloud Storage |
| Backend Hosting | Google Cloud Run |
| Frontend Hosting | Google App Engine |
| CI/CD | Cloud Build |

## 📊 Database Schema

### Tabel MySQL

```
users
├── uid
├── email
├── fullName
├── password (hashed)
├── role (user/admin)
└── profilePicture

vehicles
├── id
├── title
├── author
├── isbn
├── description
├── category
├── publishYear
├── fileUrl (GCS link)
├── fileName
├── downloads
└── reviews[]

rentals
├── id
├── user_id
├── vehicle_id
├── start_date
└── status

payments
├── id
├── rental_id
├── amount
└── status

reviews
├── id
├── user_id
├── vehicle_id
├── rating
└── comment

favorites
├── userId
└── bookId

books
├── id
├── title
├── author
├── category
└── file_url

members
├── id
├── name
├── email
└── phone

peminjamans
├── id
├── id_member
├── id_buku
└── status

pengembalians
├── id
├── id_peminjaman
└── tanggal_kembali
```

## 🔐 Security

- 🔒 Password hashing dengan bcrypt
- 🔐 JWT token (7 hari expiry)
- 🛡️ Role-based access control
- 🚫 CORS whitelist
- ✅ File upload validation
- 👮 Role-based access control
- 🔑 Service account isolation

## 💰 Pricing (Estimated Monthly)

| Service | Price | Notes |
|---------|-------|-------|
| **Cloud SQL** | $5-15 | MySQL managed database |
| **Cloud Storage** | $1-5 | 5GB/month gratis (year 1) |
| **App Engine** | $5-15 | Standard environment |
| **Firebase Auth** | $0-5 | 50K sign-ups gratis |
| **Total** | **$11-35** | ✨ Very affordable! |

**Catatan:** Pricing bisa lebih murah dengan optimasi dan free tier.

👉 **Lihat [GOOGLE_CLOUD_SETUP.md](./GOOGLE_CLOUD_SETUP.md) untuk cost breakdown detail!**

## 🚀 Deployment

### Backend ke Cloud Run

```bash
gcloud run deploy digital-library-backend \
  --source backend \
  --region asia-southeast2 \
  --allow-unauthenticated
```

### Frontend ke App Engine

```bash
cd digital-library-frontend
gcloud app deploy app.yaml
```

Atau, jika frontend kamu masih dikelola lewat hosting statis lain, set `REACT_APP_API_URL` ke URL Cloud Run backend di atas.

```bash
cd digital-library-frontend
npm run build
firebase deploy --only hosting
```

**👉 Full deployment guide di [GOOGLE_CLOUD_SETUP.md](./GOOGLE_CLOUD_SETUP.md)**

## 📖 API Documentation

### Base URL
```
http://localhost:3001/api
```

### Endpoints Overview

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/users/register` | Register user |
| POST | `/users/login` | Login user |
| GET | `/books` | Get all books |
| GET | `/books/:id` | Get book detail |
| POST | `/books` | Create book (admin) |
| GET | `/favorites` | Get user favorites |
| POST | `/reviews` | Create review |
| GET | `/reviews/:bookId` | Get book reviews |

**Full API docs di [Backend README](./digital-library-backend/README.md)**

## 🧪 Testing

### Test Akun
```
Email: test@perpustakaan.com
Password: Test@1234
Role: admin
```

### Test Flow
1. Register akun baru
2. Login
3. Browse & search books
4. View book detail
5. Download book
6. Add to favorites
7. Post review

## 📝 Environment Variables

### Backend (.env)
```env
FIREBASE_PROJECT_ID=your-project
FIREBASE_PRIVATE_KEY=your-key
FIREBASE_CLIENT_EMAIL=your-email
GCS_BUCKET_NAME=your-bucket
JWT_SECRET=your-secret
PORT=3001
NODE_ENV=production
CORS_ORIGIN=https://yourdomain.com
```

### Frontend (.env)
```env
REACT_APP_API_URL=https://backend-url.com/api
```

## 🐳 Docker

### Build & Run Backend

```bash
cd digital-library-backend
docker build -t digital-library-backend:latest .
docker run -p 3001:3001 \
  -e FIREBASE_PROJECT_ID=... \
  -e FIREBASE_PRIVATE_KEY=... \
  digital-library-backend:latest
```

## 📚 Documentation

- 📖 [QUICK_START.md](./QUICK_START.md) - **Start here!**
- ☁️ [GOOGLE_CLOUD_SETUP.md](./GOOGLE_CLOUD_SETUP.md) - Setup GCP
- 🔙 [Backend README](./digital-library-backend/README.md) - Backend docs
- ⚛️ [Frontend README](./digital-library-frontend/README.md) - Frontend docs

## 🆘 Troubleshooting

### Backend won't start
```bash
# Check port 3001 is free
lsof -i :3001

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### Frontend connection error
- Pastikan backend running di port 3001
- Check CORS_ORIGIN di backend .env
- Clear browser cache

### Firebase connection failed
- Verify .env credentials
- Check Firebase project enabled
- Verify service account permissions

**Lihat troubleshooting section di [GOOGLE_CLOUD_SETUP.md](./GOOGLE_CLOUD_SETUP.md)**

## 🎓 Learning Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [Express.js Guide](https://expressjs.com/)
- [React Documentation](https://react.dev/)
- [Google Cloud Documentation](https://cloud.google.com/docs)
- [Cloud SQL Documentation](https://cloud.google.com/sql/docs)
- [App Engine Documentation](https://cloud.google.com/appengine/docs)

## 🤝 Contributing

1. Fork repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📄 License

ISC License - Lihat [LICENSE](./LICENSE) untuk detail.

## 👥 Team

Dikembangkan oleh Digital Library Development Team

## 📞 Support

- 📧 Email: support@perpustakaankampus.com
- 💬 Issue Tracker: [GitHub Issues](./issues)
- 📚 Documentation: [Docs](./GOOGLE_CLOUD_SETUP.md)

## 🎉 Acknowledgments

- Dibangun dengan ❤️ untuk komunitas akademik
- Menggunakan teknologi open-source terbaik
- Hosted di Google Cloud Platform

---

## 📊 Project Stats

- **Backend:** Node.js + Express.js
- **Frontend:** React 18
- **Database:** MySQL / Cloud SQL
- **Storage:** Google Cloud Storage
- **Authentication:** JWT + Firebase Auth
- **Deployment:** Cloud Run + App Engine
- **Estimated Setup Time:** 5 minutes
- **Est. Monthly Cost:** $15-35

---

**🚀 Ready to get started? → [QUICK_START.md](./QUICK_START.md)**

Last Updated: 2024
Version: 1.0.0
