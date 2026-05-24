# Perpustakaan Digital Kampus

Aplikasi perpustakaan digital kampus yang modern dengan backend Express.js dan frontend React, menggunakan Google Cloud Platform dengan Firestore database.

## Fitur

✅ **Authentication** - Login/Register dengan JWT Token  
✅ **Book Management** - Kelola koleksi buku akademik  
✅ **Book Upload** - Upload file PDF/EPUB/MOBI ke Google Cloud Storage  
✅ **Favorites** - Tandai buku favorit  
✅ **Reviews & Rating** - Beri review dan rating untuk buku  
✅ **Search & Filter** - Cari buku berdasarkan kategori  
✅ **Admin Panel** - Panel admin untuk menambah/edit/hapus buku  

## Tech Stack

### Backend
- Node.js + Express.js
- Firebase Admin SDK
- Google Cloud Firestore
- Google Cloud Storage
- JWT Authentication

### Frontend
- React 18
- React Router v6
- Axios
- CSS3

## Setup Lokal

### Prerequisites
- Node.js >= 14
- npm atau yarn
- Google Cloud Project dengan Firebase enabled
- Service Account Key dari GCP

### Backend Setup

```bash
cd digital-library-backend

# Install dependencies
npm install

# Buat file .env
cp .env.example .env

# Edit .env dengan konfigurasi Firebase Anda
# FIREBASE_PROJECT_ID=your-project-id
# FIREBASE_PRIVATE_KEY=your-private-key
# FIREBASE_CLIENT_EMAIL=your-service-account-email
# FIREBASE_DATABASE_URL=your-db-url
# GCS_BUCKET_NAME=your-bucket-name
# JWT_SECRET=your-secret-key

# Jalankan development server
npm run dev
```

Server akan berjalan di `http://localhost:3001`

### Frontend Setup

```bash
cd digital-library-frontend

# Install dependencies
npm install

# Buat file .env
echo "REACT_APP_API_URL=http://localhost:3001/api" > .env

# Jalankan development server
npm start
```

App akan berjalan di `http://localhost:3000`

## API Endpoints

### Users
- `POST /api/users/register` - Register user baru
- `POST /api/users/login` - Login user
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `GET /api/users` - Get all users (admin only)
- `DELETE /api/users/:uid` - Delete user (admin only)

### Books
- `GET /api/books` - Get all books
- `GET /api/books/:id` - Get book detail
- `POST /api/books` - Create book (admin only)
- `PUT /api/books/:id` - Update book (admin only)
- `DELETE /api/books/:id` - Delete book (admin only)
- `POST /api/books/:id/download` - Download book

### Favorites
- `GET /api/favorites` - Get user favorites
- `POST /api/favorites` - Add to favorites
- `DELETE /api/favorites/:bookId` - Remove from favorites
- `GET /api/favorites/check/:bookId` - Check if book is favorite

### Reviews
- `GET /api/reviews/:bookId` - Get book reviews
- `POST /api/reviews` - Create review
- `PUT /api/reviews/:reviewId` - Update review
- `DELETE /api/reviews/:reviewId` - Delete review

## Google Cloud Setup

Lihat [GOOGLE_CLOUD_SETUP.md](./GOOGLE_CLOUD_SETUP.md) untuk panduan setup Google Cloud yang ekonomis.

## Database Schema (Firestore)

### Collections

**users**
```
{
  uid: string
  email: string
  fullName: string
  password: string (hashed)
  role: 'user' | 'admin'
  profilePicture: string (optional)
  bio: string
  isActive: boolean
  createdAt: timestamp
  updatedAt: timestamp
}
```

**books**
```
{
  id: string
  title: string
  author: string
  isbn: string (optional)
  description: string
  category: string
  publishYear: number
  fileUrl: string (GCS URL)
  fileName: string
  coverImage: string (optional)
  totalCopies: number
  availableCopies: number
  downloads: number
  rating: number
  reviews: array
  uploadedBy: string (userId)
  createdAt: timestamp
  updatedAt: timestamp
}
```

**favorites**
```
{
  id: string
  userId: string
  bookId: string
  addedAt: timestamp
}
```

**reviews**
```
{
  id: string
  bookId: string
  userId: string
  rating: 1-5
  comment: string
  helpful: number
  createdAt: timestamp
  updatedAt: timestamp
}
```

**download_history**
```
{
  userId: string
  bookId: string
  downloadedAt: timestamp
}
```

## Deployment

### Deploy Backend ke Cloud Run

```bash
# Di folder digital-library-backend

# Build Docker image
gcloud builds submit --tag gcr.io/YOUR_PROJECT_ID/digital-library-backend

# Deploy ke Cloud Run
gcloud run deploy digital-library-backend \
  --image gcr.io/YOUR_PROJECT_ID/digital-library-backend \
  --platform managed \
  --region us-central1 \
  --set-env-vars FIREBASE_PROJECT_ID=YOUR_PROJECT_ID,FIREBASE_CLIENT_EMAIL=YOUR_EMAIL,etc.
```

### Deploy Frontend ke Firebase Hosting

```bash
# Di folder digital-library-frontend

# Build production
npm run build

# Deploy
firebase deploy --only hosting
```

## Environment Variables

### Backend (.env)
```
FIREBASE_PROJECT_ID=
FIREBASE_PRIVATE_KEY=
FIREBASE_CLIENT_EMAIL=
FIREBASE_DATABASE_URL=
GCS_BUCKET_NAME=
JWT_SECRET=
PORT=3001
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
MAX_FILE_SIZE=52428800
ALLOWED_FILE_TYPES=pdf,epub,mobi,txt,doc,docx
```

### Frontend (.env)
```
REACT_APP_API_URL=http://localhost:3001/api
```

## License

ISC

## Support

Untuk bantuan, silakan buat issue di repository ini.
