import { Router } from "express";

import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  updateUserRole,
  deleteUser,
} from "../controllers/user.controller.js";

import { authenticate } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";

import {
  createUserSchema,
  updateUserSchema,
  updateUserRoleSchema,
} from "../schemas/user.schema.js";

import { validateBody } from "../middlewares/validate.middleware.js";

const router = Router();

// Validasi format UUID
const validateUuid = (req: import("express").Request, res: import("express").Response, next: import("express").NextFunction) => {
  const uuid = req.params.uuid;

  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

  if (typeof uuid !== "string" || !uuidRegex.test(uuid)) {
    res.status(400).json({
      success: false,
      message: "Format UUID tidak valid.",
    });
    return;
  }

  next();
};

// Semua endpoint user hanya bisa diakses super admin.
router.use(authenticate, authorizeRoles("super_admin"));

// GET semua akun
router.get("/", getAllUsers);

// CREATE akun mahasiswa
router.post("/", validateBody(createUserSchema), createUser);

// GET detail akun
router.get("/:uuid", validateUuid, getUserById);

// UPDATE email atau password
router.put(
  "/:uuid",
  validateUuid,
  validateBody(updateUserSchema),
  updateUser
);

// UPDATE role akun
router.patch(
  "/:uuid/role",
  validateUuid,
  validateBody(updateUserRoleSchema),
  updateUserRole
);

// SOFT DELETE akun
router.delete("/:uuid", validateUuid, deleteUser);

export default router;
