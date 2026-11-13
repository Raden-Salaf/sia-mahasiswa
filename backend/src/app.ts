import express, { type Express } from "express";
import cors from "cors";
import helmet from "helmet";

import userRoutes from "./routes/user.routes.js";
import authRoutes from "./routes/auth.routes.js";
import mahasiswaRoutes from "./routes/mahasiswa.routes.js";

import { errorHandler } from "./middlewares/error.middleware.js";

// Membuat instance aplikasi Express.
const app: Express = express();

// Menonaktifkan ETag agar API tidak mengembalikan 304.
app.set("etag", false);

// Mengaktifkan security HTTP headers.
app.use(helmet());

// Mengizinkan frontend mengakses backend.
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Membaca request dengan format JSON.
app.use(express.json());

// Endpoint utama API.
app.get("/", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "API SIA Mahasiswa berhasil dijalankan!",
  });
});

// Endpoint pengecekan kesehatan API.
app.get("/api/health", (_req, res) => {
  res.status(200).json({
    success: true,
    status: "OK",
    service: "SIA Mahasiswa API",
  });
});

// Mencegah respons autentikasi disimpan di cache.
app.use("/api/auth", (_req, res, next) => {
  res.setHeader("Cache-Control", "no-store");
  next();
});

// Menghubungkan seluruh endpoint.
app.use("/api/mahasiswa", mahasiswaRoutes);
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);

// Menangani endpoint yang tidak ditemukan.
app.use((_req, res) => {
  res.status(404).json({
    success: false,
    message: "Endpoint tidak ditemukan.",
  });
});

// Error handler harus diletakkan paling akhir.
app.use(errorHandler);

// Mengekspor aplikasi.
export default app;
