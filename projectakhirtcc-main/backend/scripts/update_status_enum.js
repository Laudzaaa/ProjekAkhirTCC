import mysql from 'mysql2/promise';

const config = {
  host: '34.21.239.57',
  user: 'perpustakaan',
  password: 'PerpustakaanMySQL123',
  database: 'perpustakaan_db',
  port: 3306,
};

(async () => {
  try {
    const conn = await mysql.createConnection(config);
    console.log('Connected to DB, running ALTER TABLE to set ENUM...');
    const sql = "ALTER TABLE peminjamans MODIFY status ENUM('pending','aktif','dikembalikan','hilang') NOT NULL DEFAULT 'pending'";
    await conn.execute(sql);
    console.log('ALTER executed. Checking column:');
    const [rows] = await conn.execute("SHOW COLUMNS FROM peminjamans LIKE 'status'");
    console.log('Result:', rows);
    await conn.end();
  } catch (err) {
    console.error('DB alter error:', err.message);
    process.exit(1);
  }
})();
