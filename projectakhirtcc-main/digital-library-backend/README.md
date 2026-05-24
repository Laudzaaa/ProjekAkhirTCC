# Perpustakaan Digital Kampus - Backend API

Backend Express.js untuk aplikasi Perpustakaan Digital Kampus yang terintegrasi dengan Google Cloud Platform menggunakan Firestore database.

## 🚀 Fitur

- ✅ JWT Authentication dengan token 7 hari
- ✅ User management (Register, Login, Profile)
- ✅ Book management dengan upload ke Google Cloud Storage
- ✅ Favorites management
- ✅ Reviews & Rating system
- ✅ Download tracking
- ✅ Admin role-based access control
- ✅ Firestore integration
- ✅ Cloud Run ready

## 📋 Prerequisites

- Node.js >= 14
- npm atau yarn
- Google Cloud Project dengan:
  - Firestore enabled
  - Cloud Storage bucket
  - Firebase Admin SDK configured

## 🔧 Installation

```bash
# Install dependencies
npm install

# Copy environment template
cp .env.example .env

# Edit .env dengan konfigurasi Anda
nano .env
```

## 📝 Environment Variables

```env
# Firebase Configuration
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY=your-private-key
FIREBASE_CLIENT_EMAIL=your-service-account-email
FIREBASE_DATABASE_URL=https://your-project-id.firebaseio.com

# JWT Configuration
JWT_SECRET=your-super-secure-jwt-key-change-in-production

# Server Configuration
PORT=3001
NODE_ENV=development

# CORS Configuration
CORS_ORIGIN=http://localhost:3000

# Google Cloud Storage
GCS_BUCKET_NAME=your-bucket-name

# File Upload Configuration
MAX_FILE_SIZE=52428800
ALLOWED_FILE_TYPES=pdf,epub,mobi,txt,doc,docx
```

## 🏃 Running

### Development

```bash
npm run dev
```

Server akan berjalan di `http://localhost:3001`

### Production

```bash
npm start
```

## 📡 API Endpoints

### Health Check
- `GET /health` - Health check endpoint
- `GET /` - Root endpoint

### Authentication
- `POST /api/users/register` - Register user baru
- `POST /api/users/login` - Login user

### Users (Protected)
- `GET /api/users/profile` - Get current user profile
- `PUT /api/users/profile` - Update user profile

### Users (Admin Only)
- `GET /api/users` - Get all users
- `DELETE /api/users/:uid` - Delete user

### Books
- `GET /api/books` - Get all books (with filters)
  - Query params: `searchQuery`, `category`, `limit`, `offset`
- `GET /api/books/:id` - Get book detail
- `POST /api/books` - Create book (admin, with file upload)
- `PUT /api/books/:id` - Update book (admin)
- `DELETE /api/books/:id` - Delete book (admin)
- `POST /api/books/:id/download` - Download book (with tracking)

### Favorites
- `GET /api/favorites` - Get user's favorite books
- `POST /api/favorites` - Add book to favorites
- `DELETE /api/favorites/:bookId` - Remove from favorites
- `GET /api/favorites/check/:bookId` - Check if book is favorite

### Reviews
- `GET /api/reviews/:bookId` - Get book reviews
- `POST /api/reviews` - Create review
- `PUT /api/reviews/:reviewId` - Update review
- `DELETE /api/reviews/:reviewId` - Delete review

## 🔐 Authentication

Semua endpoint yang memerlukan autentikasi memerlukan header:

```
Authorization: Bearer <token>
```

Token diperoleh dari endpoint login dan valid untuk 7 hari.

## 📦 Project Structure

```
digital-library-backend/
├── config/
│   └── firebase.js              # Firebase configuration
├── controllers/
│   ├── user.controller.js       # User logic
│   ├── book.controller.js       # Book logic
│   ├── favorite.controller.js   # Favorite logic
│   └── review.controller.js     # Review logic
├── middleware/
│   └── verifyToken.js           # Auth & error middleware
├── routes/
│   ├── user.routes.js
│   ├── book.routes.js
│   ├── favorite.routes.js
│   └── review.routes.js
├── utils/
│   └── tokenManager.js          # JWT utility
├── .env.example                 # Environment variables template
├── Dockerfile                   # Docker configuration
├── cloudbuild.yaml              # Cloud Build configuration
├── package.json
└── index.js                     # Main entry point
```

## 🐳 Docker

### Build

```bash
docker build -t digital-library-backend:latest .
```

### Run

```bash
docker run -p 3001:3001 \
  -e FIREBASE_PROJECT_ID=your-project-id \
  -e FIREBASE_PRIVATE_KEY=your-key \
  -e FIREBASE_CLIENT_EMAIL=your-email \
  -e GCS_BUCKET_NAME=your-bucket \
  digital-library-backend:latest
```

## ☁️ Deployment

### Deploy ke Cloud Run

```bash
# Build dan push image
gcloud builds submit --tag gcr.io/YOUR_PROJECT_ID/digital-library-backend

# Deploy
gcloud run deploy digital-library-backend \
  --image gcr.io/YOUR_PROJECT_ID/digital-library-backend \
  --platform managed \
  --region asia-southeast1 \
  --set-env-vars FIREBASE_PROJECT_ID=your-project-id,... \
  --allow-unauthenticated
```

Lihat [GOOGLE_CLOUD_SETUP.md](../GOOGLE_CLOUD_SETUP.md) untuk panduan lengkap.

## 📊 Firestore Collections

### users
```json
{
  "uid": "string",
  "email": "string",
  "fullName": "string",
  "password": "string (hashed)",
  "role": "user|admin",
  "profilePicture": "string (optional)",
  "bio": "string",
  "isActive": "boolean",
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
}
```

### books
```json
{
  "id": "string",
  "title": "string",
  "author": "string",
  "isbn": "string",
  "description": "string",
  "category": "string",
  "publishYear": "number",
  "fileUrl": "string (GCS URL)",
  "fileName": "string",
  "totalCopies": "number",
  "availableCopies": "number",
  "downloads": "number",
  "uploadedBy": "string (uid)",
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
}
```

### favorites
```json
{
  "id": "string",
  "userId": "string",
  "bookId": "string",
  "addedAt": "timestamp"
}
```

### reviews
```json
{
  "id": "string",
  "bookId": "string",
  "userId": "string",
  "rating": "number (1-5)",
  "comment": "string",
  "helpful": "number",
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
}
```

## 🧪 Testing

Gunakan REST Client atau Postman untuk testing API. Lihat `request.rest` untuk contoh.

## 📝 Error Handling

Semua error responses mengikuti format:

```json
{
  "success": false,
  "message": "Error description"
}
```

Status codes:
- 200 - Success
- 201 - Created
- 400 - Bad Request
- 401 - Unauthorized
- 403 - Forbidden
- 404 - Not Found
- 500 - Server Error

## 🔒 Security

- Password di-hash dengan bcrypt
- JWT token untuk authentication
- Firestore security rules
- CORS enabled dengan whitelist
- File upload validation
- Admin role protection

## 📚 Dependencies

- **express** - Web framework
- **firebase-admin** - Firebase SDK
- **bcrypt** - Password hashing
- **jsonwebtoken** - JWT authentication
- **cors** - Cross-origin requests
- **dotenv** - Environment variables
- **multer** - File uploads
- **uuid** - Unique IDs

## 🆘 Troubleshooting

### Firebase connection error
- Pastikan .env variables benar
- Check service account credentials
- Verify project ID matches

### File upload fail
- Check GCS bucket exists
- Verify service account permissions
- Check file size limits

### Token expired
- Token valid 7 hari dari login
- User perlu login ulang setelah expiry

## 📄 License

ISC

## 👨‍💻 Author

Digital Library Team

---

**Happy coding!** 📚✨
