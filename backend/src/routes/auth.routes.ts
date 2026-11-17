import { Router } from "express";

import {
  login,
  me,
} from "../controllers/auth.controller.js";

import { loginSchema } from "../schemas/auth.schema.js";
import { validateBody } from "../middlewares/validate.middleware.js";
import { authenticate } from "../middlewares/auth.middleware.js";

const router = Router();

// =====================================================
// POST /api/auth
// Login pengguna
// =====================================================
router.post(
  "/login",
  validateBody(loginSchema),
  login
);

// =====================================================
// GET /api/auth/me
// Memvalidasi token dan mengambil profil pengguna
// =====================================================
router.get(
  "/me",
  authenticate,
  me
);

export default router;
