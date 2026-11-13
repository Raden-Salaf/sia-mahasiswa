import type { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { pool } from "../config/database.js";
import { generateToken } from "../config/jwt.js";

// =====================================================
// LOGIN
// Memverifikasi email dan password pengguna
// =====================================================
export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const result = await pool.query(
    `
    SELECT
      u.uuid,
      u.email,
      u.password,
      u.id_mhs,
      r.name AS role_name,
      m.nim,
      m.nama_mahasiswa
    FROM users u
    INNER JOIN roles r ON r.id = u.role_id
    INNER JOIN mahasiswa m ON m.id = u.id_mhs
    WHERE LOWER(u.email) = LOWER($1)
      AND u.deleted_at IS NULL
    LIMIT 1
    `,
    [email]
  );

  if (result.rows.length === 0) {
    res.status(401).json({
      success: false,
      message: "Email atau password salah.",
    });
    return;
  }

  const user = result.rows[0];

  const passwordValid = await bcrypt.compare(
    password,
    user.password
  );

  if (!passwordValid) {
    res.status(401).json({
      success: false,
      message: "Email atau password salah.",
    });
    return;
  }

  const token = await generateToken({
    uuid: user.uuid,
    email: user.email,
    role: user.role_name,
  });

  res.status(200).json({
    success: true,
    message: "Login berhasil.",
    data: {
      token,
      user: {
        uuid: user.uuid,
        email: user.email,
        role: user.role_name,
        id_mhs: user.id_mhs,
        nim: user.nim,
        nama_mahasiswa: user.nama_mahasiswa,
      },
    },
  });
};

// =====================================================
// ME
// Mengambil profil pengguna yang sedang login
// =====================================================
export const me = async (req: Request, res: Response) => {
  // Pastikan identitas pengguna tersedia
  if (!req.user) {
    res.status(401).json({
      success: false,
      message: "Autentikasi diperlukan.",
    });
    return;
  }

  const result = await pool.query(
    `
    SELECT
      u.uuid,
      u.email,
      u.id_mhs,
      r.name AS role,
      m.nim,
      m.nama_mahasiswa
    FROM users u
    INNER JOIN roles r ON r.id = u.role_id
    INNER JOIN mahasiswa m ON m.id = u.id_mhs
    WHERE u.uuid = $1
      AND u.deleted_at IS NULL
    LIMIT 1
    `,
    [req.user.uuid]
  );

  if (result.rows.length === 0) {
    res.status(401).json({
      success: false,
      message: "Data pengguna tidak ditemukan.",
    });
    return;
  }

  res.status(200).json({
    success: true,
    message: "Sesi pengguna valid.",
    data: {
      user: result.rows[0],
    },
  });
};
