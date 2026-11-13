import { Router } from "express";
import type { Request, Response, NextFunction } from "express";

import {
  getAllMahasiswa,
  getMyMahasiswa,
  getMahasiswaById,
  createMahasiswa,
  updateMahasiswa,
  deleteMahasiswa,
} from "../controllers/mahasiswa.controller.js";

import {
  mahasiswaSchema,
  updateMahasiswaSchema,
} from "../schemas/mahasiswa.schema.js";

import { validateBody } from "../middlewares/validate.middleware.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";

const router = Router();

// Memastikan ID merupakan angka positif.
const validateId = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const id = Number(req.params.id);

  if (!Number.isSafeInteger(id) || id <= 0) {
    res.status(400).json({
      success: false,
      message: "ID mahasiswa tidak valid.",
    });
    return;
  }

  next();
};

// Semua endpoint mahasiswa wajib memiliki token valid.
router.use(authenticate);

// GET /api/mahasiswa/me
// Super admin dan mahasiswa boleh mengambil profil sendiri.
router.get(
  "/me",
  authorizeRoles("super_admin", "mahasiswa"),
  getMyMahasiswa
);

// GET /api/mahasiswa
// Hanya super admin yang boleh melihat seluruh data.
router.get(
  "/",
  authorizeRoles("super_admin"),
  getAllMahasiswa
);

// GET /api/mahasiswa/:id
// Hanya super admin yang boleh melihat detail berdasarkan ID.
router.get(
  "/:id",
  authorizeRoles("super_admin"),
  validateId,
  getMahasiswaById
);

// POST /api/mahasiswa
// Hanya super admin yang boleh menambahkan mahasiswa.
router.post(
  "/",
  authorizeRoles("super_admin"),
  validateBody(mahasiswaSchema),
  createMahasiswa
);

// PUT /api/mahasiswa/:id
// Hanya super admin yang boleh memperbarui data.
router.put(
  "/:id",
  authorizeRoles("super_admin"),
  validateId,
  validateBody(updateMahasiswaSchema),
  updateMahasiswa
);

// DELETE /api/mahasiswa/:id
// Hanya super admin yang boleh menghapus data.
router.delete(
  "/:id",
  authorizeRoles("super_admin"),
  validateId,
  deleteMahasiswa
);

export default router;
