import type { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { pool } from "../config/database.js";

// =====================================================
// SQL SELECT AUDIT TRAIL
// Mengambil identitas admin berdasarkan UUID
// =====================================================

const auditSelect = `
  SELECT
    u.uuid,
    u.id_mhs,
    m.nim,
    m.nama_mahasiswa,
    u.email,
    u.role_id,
    r.name AS role_name,

    u.created_at,
    CASE
      WHEN creator.uuid IS NULL THEN NULL
      ELSE jsonb_build_object(
        'uuid', creator.uuid,
        'nama', creator_m.nama_mahasiswa,
        'email', creator.email,
        'role', creator_r.name
      )
    END AS created_by,

    u.updated_at,
    CASE
      WHEN updater.uuid IS NULL THEN NULL
      ELSE jsonb_build_object(
        'uuid', updater.uuid,
        'nama', updater_m.nama_mahasiswa,
        'email', updater.email,
        'role', updater_r.name
      )
    END AS updated_by,

    u.deleted_at,
    CASE
      WHEN deleter.uuid IS NULL THEN NULL
      ELSE jsonb_build_object(
        'uuid', deleter.uuid,
        'nama', deleter_m.nama_mahasiswa,
        'email', deleter.email,
        'role', deleter_r.name
      )
    END AS deleted_by

  FROM users u
  INNER JOIN mahasiswa m ON m.id = u.id_mhs
  INNER JOIN roles r ON r.id = u.role_id

  LEFT JOIN users creator ON creator.uuid = u.created_by
  LEFT JOIN mahasiswa creator_m ON creator_m.id = creator.id_mhs
  LEFT JOIN roles creator_r ON creator_r.id = creator.role_id

  LEFT JOIN users updater ON updater.uuid = u.updated_by
  LEFT JOIN mahasiswa updater_m ON updater_m.id = updater.id_mhs
  LEFT JOIN roles updater_r ON updater_r.id = updater.role_id

  LEFT JOIN users deleter ON deleter.uuid = u.deleted_by
  LEFT JOIN mahasiswa deleter_m ON deleter_m.id = deleter.id_mhs
  LEFT JOIN roles deleter_r ON deleter_r.id = deleter.role_id
`;

// =====================================================
// GET ALL USERS
// =====================================================

export const getAllUsers = async (req: Request, res: Response) => {
  const includeDeleted = req.query.include_deleted === "true";

  const result = await pool.query(
    `
    ${auditSelect}
    WHERE ($1::boolean = TRUE OR u.deleted_at IS NULL)
    ORDER BY u.created_at DESC
    `,
    [includeDeleted]
  );

  res.status(200).json({
    success: true,
    message: "Data akun berhasil diambil.",
    total: result.rowCount,
    data: result.rows,
  });
};

// =====================================================
// GET USER BY UUID
// =====================================================

export const getUserById = async (req: Request, res: Response) => {
  const uuid = req.params.uuid;
  const includeDeleted = req.query.include_deleted === "true";

  const result = await pool.query(
    `
    ${auditSelect}
    WHERE u.uuid = $1
      AND ($2::boolean = TRUE OR u.deleted_at IS NULL)
    `,
    [uuid, includeDeleted]
  );

  if (result.rows.length === 0) {
    res.status(404).json({
      success: false,
      message: "Akun tidak ditemukan.",
    });
    return;
  }

  res.status(200).json({
    success: true,
    message: "Detail akun berhasil diambil.",
    data: result.rows[0],
  });
};

// =====================================================
// CREATE USER
// Role otomatis mahasiswa
// =====================================================

export const createUser = async (req: Request, res: Response) => {
  const actorUuid = req.user?.uuid;

  if (!actorUuid) {
    res.status(401).json({
      success: false,
      message: "Silakan login terlebih dahulu.",
    });
    return;
  }

  const { id_mhs, email, password } = req.body;

  const mahasiswa = await pool.query(
    "SELECT id FROM mahasiswa WHERE id = $1",
    [id_mhs]
  );

  if (mahasiswa.rows.length === 0) {
    res.status(404).json({
      success: false,
      message: "Data mahasiswa tidak ditemukan.",
    });
    return;
  }

  // Cari role mahasiswa secara otomatis.
  const role = await pool.query(
    "SELECT id FROM roles WHERE name = $1",
    ["mahasiswa"]
  );

  if (role.rows.length === 0) {
    res.status(500).json({
      success: false,
      message: "Role mahasiswa belum tersedia di database.",
    });
    return;
  }

  const roleId = role.rows[0].id;
  const normalizedEmail = email.toLowerCase();
  const hashedPassword = await bcrypt.hash(password, 12);

  const result = await pool.query(
    `
    INSERT INTO users (
      id_mhs,
      email,
      password,
      role_id,
      created_by
    )
    VALUES ($1, $2, $3, $4, $5)
    RETURNING
      uuid,
      id_mhs,
      email,
      role_id,
      created_at,
      created_by
    `,
    [id_mhs, normalizedEmail, hashedPassword, roleId, actorUuid]
  );

  res.status(201).json({
    success: true,
    message: "Akun mahasiswa berhasil dibuat.",
    data: result.rows[0],
  });
};

// =====================================================
// UPDATE USER
// Memperbarui email atau password
// =====================================================

export const updateUser = async (req: Request, res: Response) => {
  const actorUuid = req.user?.uuid;

  if (!actorUuid) {
    res.status(401).json({
      success: false,
      message: "Silakan login terlebih dahulu.",
    });
    return;
  }

  const uuid = req.params.uuid;
  const { email, password } = req.body;

  const fields: string[] = [];
  const values: unknown[] = [];

  if (email !== undefined) {
    values.push(email.toLowerCase());
    fields.push(`email = $${values.length}`);
  }

  if (password !== undefined) {
    const hashedPassword = await bcrypt.hash(password, 12);

    values.push(hashedPassword);
    fields.push(`password = $${values.length}`);
  }

  fields.push("updated_at = CURRENT_TIMESTAMP");

  values.push(actorUuid);
  fields.push(`updated_by = $${values.length}`);

  values.push(uuid);

  const result = await pool.query(
    `
    UPDATE users
    SET ${fields.join(", ")}
    WHERE uuid = $${values.length}
      AND deleted_at IS NULL
    RETURNING
      uuid,
      id_mhs,
      email,
      role_id,
      updated_at,
      updated_by
    `,
    values
  );

  if (result.rows.length === 0) {
    res.status(404).json({
      success: false,
      message: "Akun tidak ditemukan.",
    });
    return;
  }

  res.status(200).json({
    success: true,
    message: "Akun berhasil diperbarui.",
    data: result.rows[0],
  });
};

// =====================================================
// UPDATE USER ROLE
// Khusus super admin melalui proteksi route
// =====================================================

export const updateUserRole = async (req: Request, res: Response) => {
  const actorUuid = req.user?.uuid;

  if (!actorUuid) {
    res.status(401).json({
      success: false,
      message: "Silakan login terlebih dahulu.",
    });
    return;
  }

  const uuid = req.params.uuid;
  const { role_id } = req.body;

  // PENGAMAN BARU:
  // Super admin tidak boleh mengubah role akunnya sendiri.
  if (uuid === actorUuid) {
    res.status(403).json({
      success: false,
      message: "Anda tidak dapat mengubah role akun sendiri.",
    });
    return;
  }

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // Mengunci proses perubahan role agar pemeriksaan
    // jumlah super admin tidak berjalan bersamaan.
    await client.query(
      "SELECT pg_advisory_xact_lock($1)",
      [741852963]
    );

    const target = await client.query(
      `
      SELECT
        u.uuid,
        u.role_id,
        r.name AS role_name
      FROM users u
      INNER JOIN roles r ON r.id = u.role_id
      WHERE u.uuid = $1
        AND u.deleted_at IS NULL
      `,
      [uuid]
    );

    if (target.rows.length === 0) {
      await client.query("ROLLBACK");

      res.status(404).json({
        success: false,
        message: "Akun tidak ditemukan.",
      });
      return;
    }

    const newRole = await client.query(
      "SELECT id, name FROM roles WHERE id = $1",
      [role_id]
    );

    if (newRole.rows.length === 0) {
      await client.query("ROLLBACK");

      res.status(404).json({
        success: false,
        message: "Role tidak ditemukan.",
      });
      return;
    }

    const currentRole = target.rows[0].role_name;
    const requestedRole = newRole.rows[0].name;

    // Cegah sistem kehilangan seluruh super admin aktif.
    if (
      currentRole === "super_admin" &&
      requestedRole !== "super_admin"
    ) {
      const adminCount = await client.query(
        `
        SELECT COUNT(*)::integer AS total
        FROM users u
        INNER JOIN roles r ON r.id = u.role_id
        WHERE r.name = 'super_admin'
          AND u.deleted_at IS NULL
        `
      );

      if (adminCount.rows[0].total <= 1) {
        await client.query("ROLLBACK");

        res.status(409).json({
          success: false,
          message:
            "Role super admin terakhir tidak dapat diturunkan.",
        });
        return;
      }
    }

    await client.query(
      `
      UPDATE users
      SET
        role_id = $1,
        updated_at = CURRENT_TIMESTAMP,
        updated_by = $2
      WHERE uuid = $3
        AND deleted_at IS NULL
      `,
      [role_id, actorUuid, uuid]
    );

    // Ambil data terbaru beserta identitas audit trail.
    const updatedUser = await client.query(
      `
      ${auditSelect}
      WHERE u.uuid = $1
      `,
      [uuid]
    );

    await client.query("COMMIT");

    res.status(200).json({
      success: true,
      message: "Role akun berhasil diperbarui.",
      data: updatedUser.rows[0],
    });
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

// =====================================================
// SOFT DELETE USER
// Menonaktifkan akun tanpa menghapus data permanen
// Melindungi super admin terakhir
// =====================================================

export const deleteUser = async (req: Request, res: Response) => {
  const actorUuid = req.user?.uuid;

  if (!actorUuid) {
    res.status(401).json({
      success: false,
      message: "Silakan login terlebih dahulu.",
    });
    return;
  }

  const uuid = req.params.uuid;

  // PENGAMAN BARU:
  // Super admin tidak boleh menonaktifkan akunnya sendiri.
  if (uuid === actorUuid) {
    res.status(403).json({
      success: false,
      message: "Anda tidak dapat menonaktifkan akun sendiri.",
    });
    return;
  }

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // Gunakan lock yang sama dengan updateUserRole.
    // Tujuannya mencegah perubahan role dan soft delete
    // super admin berjalan bersamaan.
    await client.query(
      "SELECT pg_advisory_xact_lock($1)",
      [741852963]
    );

    // Periksa akun yang akan dinonaktifkan.
    const target = await client.query(
      `
      SELECT
        u.uuid,
        r.name AS role_name
      FROM users u
      INNER JOIN roles r ON r.id = u.role_id
      WHERE u.uuid = $1
        AND u.deleted_at IS NULL
      `,
      [uuid]
    );

    if (target.rows.length === 0) {
      await client.query("ROLLBACK");

      res.status(404).json({
        success: false,
        message: "Akun tidak ditemukan atau sudah dinonaktifkan.",
      });
      return;
    }

    const targetRole = target.rows[0].role_name;

    // Jika target adalah super admin,
    // periksa jumlah super admin aktif.
    if (targetRole === "super_admin") {
      const adminCount = await client.query(
        `
        SELECT COUNT(*)::integer AS total
        FROM users u
        INNER JOIN roles r ON r.id = u.role_id
        WHERE r.name = 'super_admin'
          AND u.deleted_at IS NULL
        `
      );

      if (adminCount.rows[0].total <= 1) {
        await client.query("ROLLBACK");

        res.status(409).json({
          success: false,
          message:
            "Super admin terakhir tidak dapat dinonaktifkan.",
        });
        return;
      }
    }

    // Lakukan soft delete.
    await client.query(
      `
      UPDATE users
      SET
        deleted_at = CURRENT_TIMESTAMP,
        deleted_by = $1
      WHERE uuid = $2
        AND deleted_at IS NULL
      `,
      [actorUuid, uuid]
    );

    // Ambil data terbaru beserta identitas audit trail.
    const deletedUser = await client.query(
      `
      ${auditSelect}
      WHERE u.uuid = $1
      `,
      [uuid]
    );

    await client.query("COMMIT");

    res.status(200).json({
      success: true,
      message: "Akun berhasil dinonaktifkan.",
      data: deletedUser.rows[0],
    });
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};
