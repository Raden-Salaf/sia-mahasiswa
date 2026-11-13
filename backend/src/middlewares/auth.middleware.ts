import type { Request, Response, NextFunction } from "express";

import { verifyToken } from "../config/jwt.js";
import { pool } from "../config/database.js";

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  // 1. Ambil token dari header.
  const authorization = req.headers.authorization;

  if (!authorization) {
    res.status(401).json({
      success: false,
      message: "Token autentikasi tidak ditemukan.",
    });
    return;
  }

  // 2. Periksa format Bearer Token.
  const [scheme, token, ...extraParts] = authorization.split(" ");

  if (
    scheme !== "Bearer" ||
    !token ||
    extraParts.length > 0
  ) {
    res.status(401).json({
      success: false,
      message: "Format token tidak valid.",
    });
    return;
  }

  // 3. Verifikasi JWT.
  let payload;

  try {
    payload = await verifyToken(token);
  } catch {
    res.status(401).json({
      success: false,
      message: "Token tidak valid atau sudah kedaluwarsa.",
    });
    return;
  }

  // 4. Pastikan UUID tersedia.
  if (typeof payload.uuid !== "string") {
    res.status(401).json({
      success: false,
      message: "Identitas pengguna dalam token tidak valid.",
    });
    return;
  }

  try {
    // 5. Ambil identitas, role, dan relasi mahasiswa terbaru.
    const result = await pool.query(
      `
      SELECT
        u.uuid,
        u.email,
        u.id_mhs,
        r.name AS role
      FROM users u
      INNER JOIN roles r ON r.id = u.role_id
      WHERE u.uuid = $1
        AND u.deleted_at IS NULL
      LIMIT 1
      `,
      [payload.uuid]
    );

    // 6. Pastikan akun masih aktif.
    if (result.rows.length === 0) {
      res.status(401).json({
        success: false,
        message: "Akun tidak ditemukan atau sudah dinonaktifkan.",
      });
      return;
    }

    const user = result.rows[0];

    // 7. Simpan identitas terbaru ke request.
    req.user = {
      uuid: user.uuid,
      email: user.email,
      role: user.role,
      id_mhs: user.id_mhs === null
        ? null
        : Number(user.id_mhs),
    };

    next();
  } catch (error) {
    // 8. Teruskan kesalahan database.
    next(error);
  }
};
