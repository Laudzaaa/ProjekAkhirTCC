import { db, storage } from '../config/firebase.js';
import { v4 as uuidv4 } from 'uuid';

/**
 * Create Book
 */
export const createBook = async (req, res) => {
  try {
    const { title, author, isbn, description, category, publishYear } = req.body;
    const file = req.file;

    if (!title || !author) {
      return res.status(400).json({
        success: false,
        message: 'Title dan author harus diisi',
      });
    }

    let bookFileUrl = null;

    // Upload file to Google Cloud Storage jika ada
    if (file) {
      const bucket = storage.bucket();
      const fileName = `books/${uuidv4()}-${file.originalname}`;
      const fileRef = bucket.file(fileName);

      await fileRef.save(file.buffer, {
        metadata: {
          contentType: file.mimetype,
        },
      });

      const [url] = await fileRef.getSignedUrl({
        version: 'v4',
        action: 'read',
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      bookFileUrl = url;
    }

    const bookId = uuidv4();
    await db.collection('books').doc(bookId).set({
      id: bookId,
      title: title,
      author: author,
      isbn: isbn || null,
      description: description || '',
      category: category || 'Umum',
      publishYear: publishYear || new Date().getFullYear(),
      fileUrl: bookFileUrl,
      fileName: file?.originalname || null,
      coverImage: null,
      totalCopies: 1,
      availableCopies: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
      uploadedBy: req.user.uid,
      downloads: 0,
      rating: 0,
      reviews: [],
    });

    res.status(201).json({
      success: true,
      message: 'Buku berhasil ditambahkan',
      data: {
        id: bookId,
        title: title,
        author: author,
      },
    });
  } catch (error) {
    console.error('Create book error:', error);
    res.status(500).json({
      success: false,
      message: `Gagal menambah buku: ${error.message}`,
    });
  }
};

/**
 * Get All Books
 */
export const getAllBooks = async (req, res) => {
  try {
    const { category, searchQuery, limit = 20, offset = 0 } = req.query;

    let query = db.collection('books');

    if (category) {
      query = query.where('category', '==', category);
    }

    const booksSnapshot = await query.get();
    let books = booksSnapshot.docs.map((doc) => doc.data());

    // Simple text search
    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      books = books.filter(
        (book) =>
          book.title.toLowerCase().includes(lowerQuery) ||
          book.author.toLowerCase().includes(lowerQuery) ||
          book.description.toLowerCase().includes(lowerQuery)
      );
    }

    const total = books.length;
    const paginatedBooks = books.slice(offset, offset + limit);

    res.status(200).json({
      success: true,
      data: paginatedBooks,
      pagination: {
        total: total,
        limit: parseInt(limit),
        offset: parseInt(offset),
      },
    });
  } catch (error) {
    console.error('Get all books error:', error);
    res.status(500).json({
      success: false,
      message: `Gagal mengambil daftar buku: ${error.message}`,
    });
  }
};

/**
 * Get Book by ID
 */
export const getBookById = async (req, res) => {
  try {
    const { id } = req.params;

    const bookDoc = await db.collection('books').doc(id).get();
    if (!bookDoc.exists) {
      return res.status(404).json({
        success: false,
        message: 'Buku tidak ditemukan',
      });
    }

    res.status(200).json({
      success: true,
      data: bookDoc.data(),
    });
  } catch (error) {
    console.error('Get book error:', error);
    res.status(500).json({
      success: false,
      message: `Gagal mengambil buku: ${error.message}`,
    });
  }
};

/**
 * Update Book
 */
export const updateBook = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, author, description, category, publishYear, totalCopies } = req.body;

    const bookDoc = await db.collection('books').doc(id).get();
    if (!bookDoc.exists) {
      return res.status(404).json({
        success: false,
        message: 'Buku tidak ditemukan',
      });
    }

    await db.collection('books').doc(id).update({
      title: title || bookDoc.data().title,
      author: author || bookDoc.data().author,
      description: description || bookDoc.data().description,
      category: category || bookDoc.data().category,
      publishYear: publishYear || bookDoc.data().publishYear,
      totalCopies: totalCopies || bookDoc.data().totalCopies,
      updatedAt: new Date(),
    });

    res.status(200).json({
      success: true,
      message: 'Buku berhasil diperbarui',
    });
  } catch (error) {
    console.error('Update book error:', error);
    res.status(500).json({
      success: false,
      message: `Gagal memperbarui buku: ${error.message}`,
    });
  }
};

/**
 * Delete Book
 */
export const deleteBook = async (req, res) => {
  try {
    const { id } = req.params;

    const bookDoc = await db.collection('books').doc(id).get();
    if (!bookDoc.exists) {
      return res.status(404).json({
        success: false,
        message: 'Buku tidak ditemukan',
      });
    }

    // Delete file from GCS if exists
    if (bookDoc.data().fileUrl) {
      try {
        const bucket = storage.bucket();
        await bucket.file(`books/${id}`).delete().catch(() => {});
      } catch (err) {
        console.warn('Could not delete file from storage:', err);
      }
    }

    await db.collection('books').doc(id).delete();

    res.status(200).json({
      success: true,
      message: 'Buku berhasil dihapus',
    });
  } catch (error) {
    console.error('Delete book error:', error);
    res.status(500).json({
      success: false,
      message: `Gagal menghapus buku: ${error.message}`,
    });
  }
};

/**
 * Download Book
 */
export const downloadBook = async (req, res) => {
  try {
    const { id } = req.params;

    const bookDoc = await db.collection('books').doc(id).get();
    if (!bookDoc.exists) {
      return res.status(404).json({
        success: false,
        message: 'Buku tidak ditemukan',
      });
    }

    // Update download count
    await db.collection('books').doc(id).update({
      downloads: (bookDoc.data().downloads || 0) + 1,
    });

    // Log download history
    await db.collection('download_history').add({
      bookId: id,
      userId: req.user.uid,
      downloadedAt: new Date(),
    });

    res.status(200).json({
      success: true,
      data: {
        downloadUrl: bookDoc.data().fileUrl,
      },
    });
  } catch (error) {
    console.error('Download book error:', error);
    res.status(500).json({
      success: false,
      message: `Gagal download buku: ${error.message}`,
    });
  }
};
