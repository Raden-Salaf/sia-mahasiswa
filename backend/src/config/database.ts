import "dotenv/config";
import pg from "pg";

// Mengambil class Pool dari package pg.
const { Pool } = pg;

// Membuat pool koneksi PostgreSQL.
// Pool mengelola koneksi agar bisa digunakan berulang kali.
export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,

  // Maksimal 10 koneksi aktif dalam pool.
  max: 10,

  // Koneksi idle akan ditutup setelah 30 detik.
  idleTimeoutMillis: 30000,

  // Waktu maksimal menunggu koneksi tersedia.
  connectionTimeoutMillis: 5000,
});

// Menampilkan error ketika koneksi idle mengalami masalah.
pool.on("error", (error) => {
  console.error("Unexpected database error:", error);
});

// Fungsi untuk mengetes koneksi database.
export const testDatabaseConnection = async (): Promise<void> => {
  try {
    // Menjalankan query sederhana untuk mengecek koneksi.
    const result = await pool.query("SELECT NOW() AS current_time");

    console.log("Database PostgreSQL berhasil terhubung!");
    console.log("Waktu database:", result.rows[0].current_time);
  } catch (error) {
    console.error("Gagal menghubungkan ke database:", error);

    // Menghentikan aplikasi jika database tidak dapat diakses.
    throw error;
  }
};
