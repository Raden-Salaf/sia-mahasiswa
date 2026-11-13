import type { RequestHandler } from "express";
import type { ZodType } from "zod";

// Membuat middleware validasi yang bisa digunakan oleh berbagai schema.
export const validateBody = (schema: ZodType): RequestHandler => {
  return (req, res, next) => {
    // Memeriksa apakah request body sesuai schema.
    const result = schema.safeParse(req.body);

    // Jika tidak valid, kirim respons error 400.
    if (!result.success) {
      res.status(400).json({
        success: false,
        message: "Validasi data gagal.",
        errors: result.error.issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message,
        })),
      });

      return;
    }

    // Menggunakan data hasil validasi dan transformasi Zod.
    req.body = result.data;

    // Melanjutkan request ke controller.
    next();
  };
};
