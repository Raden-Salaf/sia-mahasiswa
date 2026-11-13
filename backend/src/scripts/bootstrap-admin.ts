import "dotenv/config";
import bcrypt from "bcryptjs";
import { pool } from "../config/database.js";

const bootstrapAdmin = async () => {
  const idMhs = Number(process.env.BOOTSTRAP_ADMIN_ID_MHS);
  const email = process.env.BOOTSTRAP_ADMIN_EMAIL
    ?.trim()
    .toLowerCase();
  const password = process.env.BOOTSTRAP_ADMIN_PASSWORD;

  // Validasi konfigurasi
  if (!Number.isInteger(idMhs) || idMhs <= 0) {
    throw new Error("ID mahasiswa tidak valid.");
  }

  if (!email || !password) {
    throw new Error("Email atau password bootstrap belum diatur.");
  }

  if (
    password.length < 8 ||
    Buffer.byteLength(password, "utf8") > 72
  ) {
    throw new Error("Password harus minimal 8 karakter dan maksimal 72 byte.");
  }

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // Pastikan super_admin belum pernah dibuat
    const existingAdmin = await client.query(`
      SELECT u.uuid
      FROM users u
      INNER JOIN roles r ON r.id = u.role_id
      WHERE r.name = 'super_admin'
      LIMIT 1
    `);

    if (existingAdmin.rows.length > 0) {
      throw new Error("Akun super_admin sudah pernah dibuat.");
    }

    // Pastikan mahasiswa tersedia
    const mahasiswa = await client.query(
      "SELECT id FROM mahasiswa WHERE id = $1",
      [idMhs]
    );

    if (mahasiswa.rows.length === 0) {
      throw new Error("Data mahasiswa tidak ditemukan.");
    }

    // Ambil role super_admin berdasarkan nama
    const role = await client.query(
      "SELECT id FROM roles WHERE name = $1",
      ["super_admin"]
    );

    if (role.rows.length === 0) {
      throw new Error("Role super_admin tidak ditemukan.");
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Buat akun super_admin
    const result = await client.query(
      `
      INSERT INTO users (
        id_mhs,
        role_id,
        email,
        password
      )
      VALUES ($1, $2, $3, $4)
      RETURNING uuid, email, id_mhs
      `,
      [idMhs, role.rows[0].id, email, hashedPassword]
    );

    await client.query("COMMIT");

    console.log("Super Admin berhasil dibuat!");
    console.log("UUID:", result.rows[0].uuid);
    console.log("Email:", result.rows[0].email);
    console.log("ID Mahasiswa:", result.rows[0].id_mhs);
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

bootstrapAdmin()
  .catch((error) => {
    console.error("Bootstrap gagal:", error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await pool.end();
  });
