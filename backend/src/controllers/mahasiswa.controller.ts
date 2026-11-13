import type { Request, Response } from "express";
import { pool } from "../config/database.js";

// GET: Mengambil seluruh data mahasiswa.
// Hanya super_admin yang boleh mengakses melalui routes.
export const getAllMahasiswa = async (
  req: Request,
  res: Response
): Promise<void> => {
  const search = String(req.query.search || "").trim();

  const result = await pool.query(
    `
    SELECT *
    FROM mahasiswa
    WHERE nim ILIKE $1
       OR nama_mahasiswa ILIKE $1
    ORDER BY id DESC
    `,
    [`%${search}%`]
  );

  res.status(200).json({
    success: true,
    message: "Data mahasiswa berhasil diambil.",
    total: result.rowCount,
    data: result.rows,
  });
};

// GET: Mengambil profil mahasiswa yang sedang login.
// ID diambil dari identitas hasil autentikasi,
// bukan dari parameter URL.
export const getMyMahasiswa = async (
  req: Request,
  res: Response
): Promise<void> => {
  if (!req.user) {
    res.status(401).json({
      success: false,
      message: "Autentikasi diperlukan.",
    });
    return;
  }

  const idMahasiswa = req.user.id_mhs;

  if (
    idMahasiswa === null ||
    !Number.isSafeInteger(idMahasiswa) ||
    idMahasiswa <= 0
  ) {
    res.status(403).json({
      success: false,
      message: "Akun belum terhubung dengan data mahasiswa.",
    });
    return;
  }

  const result = await pool.query(
    `
    SELECT *
    FROM mahasiswa
    WHERE id = $1
    LIMIT 1
    `,
    [idMahasiswa]
  );

  if (result.rows.length === 0) {
    res.status(404).json({
      success: false,
      message: "Data profil mahasiswa tidak ditemukan.",
    });
    return;
  }

  res.status(200).json({
    success: true,
    message: "Profil mahasiswa berhasil diambil.",
    data: result.rows[0],
  });
};

// GET: Mengambil satu mahasiswa berdasarkan ID.
// Hanya super_admin yang boleh mengakses melalui routes.
export const getMahasiswaById = async (
  req: Request,
  res: Response
): Promise<void> => {
  const id = Number(req.params.id);

  const result = await pool.query(
    "SELECT * FROM mahasiswa WHERE id = $1",
    [id]
  );

  if (result.rows.length === 0) {
    res.status(404).json({
      success: false,
      message: "Mahasiswa tidak ditemukan.",
    });
    return;
  }

  res.status(200).json({
    success: true,
    message: "Detail mahasiswa berhasil diambil.",
    data: result.rows[0],
  });
};

// POST: Menambahkan mahasiswa baru.
// Hanya super_admin yang boleh mengakses melalui routes.
export const createMahasiswa = async (
  req: Request,
  res: Response
): Promise<void> => {
  const {
    nim,
    nama_mahasiswa,
    jenis_kelamin,
    tempat_lahir,
    tanggal_lahir,
    kelas,
    alamat,
    nama_ibu_kandung,
    no_hp_wali,
    keterangan,
  } = req.body;

  const result = await pool.query(
    `
    INSERT INTO mahasiswa (
      nim,
      nama_mahasiswa,
      jenis_kelamin,
      tempat_lahir,
      tanggal_lahir,
      kelas,
      alamat,
      nama_ibu_kandung,
      no_hp_wali,
      keterangan
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
    RETURNING *
    `,
    [
      nim,
      nama_mahasiswa,
      jenis_kelamin,
      tempat_lahir,
      tanggal_lahir,
      kelas,
      alamat,
      nama_ibu_kandung,
      no_hp_wali,
      keterangan ?? null,
    ]
  );

  res.status(201).json({
    success: true,
    message: "Mahasiswa berhasil ditambahkan.",
    data: result.rows[0],
  });
};

// PUT: Memperbarui data mahasiswa.
// Hanya super_admin yang boleh mengakses melalui routes.
export const updateMahasiswa = async (
  req: Request,
  res: Response
): Promise<void> => {
  const id = Number(req.params.id);

  const data = req.body as Record<string, unknown>;

  const allowedFields = [
    "nim",
    "nama_mahasiswa",
    "jenis_kelamin",
    "tempat_lahir",
    "tanggal_lahir",
    "kelas",
    "alamat",
    "nama_ibu_kandung",
    "no_hp_wali",
    "keterangan",
  ];

  const fields = Object.keys(data).filter((key) =>
    allowedFields.includes(key)
  );

  if (fields.length === 0) {
    res.status(400).json({
      success: false,
      message: "Tidak ada data valid yang dikirim untuk diperbarui.",
    });
    return;
  }

  const values = fields.map((field) => data[field]);

  const setClause = fields
    .map((field, index) => `${field} = $${index + 1}`)
    .join(", ");

  values.push(new Date());

  const result = await pool.query(
    `
    UPDATE mahasiswa
    SET ${setClause},
        updated_at = $${values.length}
    WHERE id = $${values.length + 1}
    RETURNING *
    `,
    [...values, id]
  );

  if (result.rows.length === 0) {
    res.status(404).json({
      success: false,
      message: "Mahasiswa tidak ditemukan.",
    });
    return;
  }

  res.status(200).json({
    success: true,
    message: "Data mahasiswa berhasil diperbarui.",
    data: result.rows[0],
  });
};

// DELETE: Menghapus mahasiswa berdasarkan ID.
// Hanya super_admin yang boleh mengakses melalui routes.
export const deleteMahasiswa = async (
  req: Request,
  res: Response
): Promise<void> => {
  const id = Number(req.params.id);

  const result = await pool.query(
    "DELETE FROM mahasiswa WHERE id = $1 RETURNING *",
    [id]
  );

  if (result.rows.length === 0) {
    res.status(404).json({
      success: false,
      message: "Mahasiswa tidak ditemukan.",
    });
    return;
  }

  res.status(200).json({
    success: true,
    message: "Mahasiswa berhasil dihapus.",
    data: result.rows[0],
  });
};
