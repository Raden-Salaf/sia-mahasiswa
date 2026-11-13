import "dotenv/config";
import app from "./app.js";
import { testDatabaseConnection } from "./config/database.js";

// Fungsi utama untuk menjalankan aplikasi.
const startServer = async (): Promise<void> => {
  try {
    // Pastikan database berhasil terhubung sebelum server aktif.
    await testDatabaseConnection();

    // Mengambil port dari environment variable.
    const PORT = Number(process.env.PORT) || 3000;

    // Menjalankan Express setelah database siap.
    app.listen(PORT, () => {
      console.log("-----------------------------------");
      console.log("SIA MAHASISWA API");
      console.log("-----------------------------------");
      console.log(`Server berjalan di http://localhost:${PORT}`);
      console.log("-----------------------------------");
    });
  } catch (error) {
    // Menghentikan aplikasi jika koneksi database gagal.
    console.error("Aplikasi gagal dijalankan:", error);
    process.exit(1);
  }
};

// Memulai aplikasi.
startServer();
