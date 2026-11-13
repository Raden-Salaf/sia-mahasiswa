/**
 * Migration: Membuat tabel users
 *
 * Tabel ini menyimpan akun login mahasiswa.
 * Setiap akun terhubung dengan satu data mahasiswa
 * dan satu role.
 */

export const up = (pgm) => {
    pgm.createTable("users", {
        // UUID sebagai primary key akun
        uuid: {
            type: "uuid",
            primaryKey: true,
            default: pgm.func("gen_random_uuid()"),
        },

        // Relasi ke tabel mahasiswa
        id_mhs: {
            type: "integer",
            notNull: true,
            unique: true,
            references: '"mahasiswa"',
            onDelete: "RESTRICT",
        },

        // Relasi ke tabel roles
        role_id: {
            type: "integer",
            notNull: true,
            references: '"roles"',
            onDelete: "RESTRICT",
        },

        // Email untuk login
        email: {
            type: "varchar(150)",
            notNull: true,
            unique: true,
        },

        // Password yang sudah di-hash menggunakan bcrypt
        password: {
            type: "varchar(255)",
            notNull: true,
        },

        // Informasi pembuatan akun
        created_at: {
            type: "timestamptz",
            notNull: true,
            default: pgm.func("current_timestamp"),
        },

        created_by: {
            type: "uuid",
            references: '"users"',
            onDelete: "RESTRICT",
        },

        // Informasi pembaruan akun
        updated_at: {
            type: "timestamptz",
            notNull: true,
            default: pgm.func("current_timestamp"),
        },

        updated_by: {
            type: "uuid",
            references: '"users"',
            onDelete: "RESTRICT",
        },

        // Informasi penghapusan akun (soft delete)
        deleted_at: {
            type: "timestamptz",
        },

        deleted_by: {
            type: "uuid",
            references: '"users"',
            onDelete: "RESTRICT",
        },
    });

    // Index untuk mempercepat pencarian akun berdasarkan email
    pgm.createIndex("users", "email");

    // Index untuk pencarian berdasarkan mahasiswa
    pgm.createIndex("users", "id_mhs");
};

export const down = (pgm) => {
    // Menghapus tabel users beserta constraint-nya
    pgm.dropTable("users");
};