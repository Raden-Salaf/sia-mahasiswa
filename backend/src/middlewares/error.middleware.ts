import type { ErrorRequestHandler } from "express";

// Middleware untuk menangani error yang diteruskan oleh controller.
export const errorHandler: ErrorRequestHandler = (
  error,
  _req,
  res,
  _next
) => {
  console.error("API Error:", error);

  // PostgreSQL error 23505 berarti terjadi pelanggaran UNIQUE.
  if (error.code === "23505") {
    res.status(409).json({
      success: false,
      message: "NIM sudah terdaftar. Gunakan NIM yang berbeda.",
    });
    return;
  }

  // Mengirim respons untuk error lainnya.
  res.status(500).json({
    success: false,
    message: "Terjadi kesalahan pada server.",
  });
};
