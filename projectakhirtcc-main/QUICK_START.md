# QUICK START GUIDE - Perpustakaan Digital Kampus

Panduan cepat untuk memulai aplikasi Perpustakaan Digital Kampus.

## 📋 Prerequisites

- Node.js >= 14
- npm atau yarn
- Git
- Google Cloud Account (free tier tersedia)

## ⚡ Quick Setup (5 minutes)

### 1. Clone atau Extract Project

```bash
cd projectakhirtcc-main
```

### 2. Setup Backend

```bash
cd digital-library-backend

# Install dependencies
npm install

# Setup environment
cp .env.example .env

# Edit .env dan isi dengan dummy data untuk testing lokal
```

**Dummy .env untuk testing lokal:**
```env
FIREBASE_PROJECT_ID=test-project
FIREBASE_PRIVATE_KEY="-----BEGIN RSA PRIVATE KEY-----\nMIIEpAIBAAKCAQEA..."
FIREBASE_CLIENT_EMAIL=test@test.iam.gserviceaccount.com
FIREBASE_DATABASE_URL=https://test-project.firebaseio.com
GCS_BUCKET_NAME=test-bucket
JWT_SECRET=test-secret-key-change-this
PORT=3001
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
MAX_FILE_SIZE=52428800
ALLOWED_FILE_TYPES=pdf,epub,mobi,txt,doc,docx
```

### 3. Setup Frontend

```bash
cd ../digital-library-frontend

# Install dependencies
npm install

# Setup environment
echo "REACT_APP_API_URL=http://localhost:3001/api" > .env
```

### 4. Run Locally

**Terminal 1 - Backend:**
```bash
cd digital-library-backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd digital-library-frontend
npm start
```

App akan buka di `http://localhost:3000`

## 🔐 Test Account

Setelah setup Firebase, gunakan akun test:
- Email: `test@perpustakaan.com`
- Password: `Test@1234`
- Role: `admin`

Atau register akun baru langsung di app.

## 📊 Test Data

### Buat Test Books (Admin)

Login dengan admin, go to `http://localhost:3000/admin/tambah-buku`:

```
Judul: Algoritma dan Struktur Data
Penulis: Bambang Hariyanto
ISBN: 978-979-756-897-3
Kategori: Akademik
Tahun Terbit: 2023
Deskripsi: Buku fundamental untuk computer science
```

## 🚀 Setup Google Cloud (Optional)

Untuk production, ikuti [GOOGLE_CLOUD_SETUP.md](./GOOGLE_CLOUD_SETUP.md).

## 📡 Test API dengan cURL

```bash
# Register
curl -X POST http://localhost:3001/api/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "email":"test@example.com",
    "password":"Test@1234",
    "fullName":"Test User"
  }'

# Login
curl -X POST http://localhost:3001/api/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email":"test@example.com",
    "password":"Test@1234"
  }'

# Get all books
curl http://localhost:3001/api/books

# Get book detail
curl http://localhost:3001/api/books/book-id

# Create review (with token)
curl -X POST http://localhost:3001/api/reviews \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "bookId":"book-id",
    "rating":5,
    "comment":"Buku yang bagus!"
  }'
```

## 🎯 Features to Test

- [ ] Register akun baru
- [ ] Login dengan akun
- [ ] Lihat daftar buku
- [ ] Search & filter buku
- [ ] Lihat detail buku
- [ ] Download buku
- [ ] Tambah ke favorit
- [ ] Lihat favorit
- [ ] Beri review & rating
- [ ] Admin: Tambah buku
- [ ] Admin: Edit buku
- [ ] Admin: Hapus buku

## 📁 Project Structure

```
projectakhirtcc-main/
├── digital-library-backend/     # Express.js API
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── routes/
│   ├── utils/
│   ├── .env.example
│   ├── Dockerfile
│   └── index.js
├── digital-library-frontend/    # React app
│   ├── public/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── styles/
│   │   └── App.js
│   └── package.json
├── GOOGLE_CLOUD_SETUP.md        # GCP setup guide
└── README.md
```

## 🔧 Common Issues

### Port 3001 already in use
```bash
# Find process using port 3001
lsof -i :3001

# Kill process
kill -9 <PID>
```

### npm modules not found
```bash
# Clear cache dan reinstall
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

### Firebase connection error
- Pastikan .env variables benar
- Cek Firebase project ID
- Verify service account credentials

### CORS error
- Check CORS_ORIGIN di .env backend
- Pastikan frontend URL di whitelist

## 📚 Documentation

- [Backend README](./digital-library-backend/README.md)
- [Frontend README](./digital-library-frontend/README.md)
- [Google Cloud Setup](./GOOGLE_CLOUD_SETUP.md)

## 🚀 Next Steps

1. **Setup Real Firebase:**
   - Create GCP project
   - Enable Firestore, Storage, Auth
   - Create service account
   - Update .env dengan credentials

2. **Deploy:**
   - Backend → Cloud Run
   - Frontend → Firebase Hosting

3. **Monitor:**
   - Setup Cloud Monitoring
   - Configure alerts
   - Track usage & costs

## 💡 Tips

- Gunakan Firebase Console untuk browse Firestore data
- Cloud Storage Console untuk manage files
- Cloud Run untuk monitor backend logs
- DevTools browser untuk debug frontend

## 🆘 Need Help?

- Check logs: `npm run dev` shows errors
- Read documentation in each folder
- Check Firebase Console for errors
- Review Firestore security rules

## 📞 Contact

Untuk bantuan lebih lanjut, buka issue atau hubungi team development.

---

**Happy coding!** 🎉📚

Versi: 1.0.0
Last updated: 2024
