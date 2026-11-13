/**
 * Migration: Membuat tabel roles
 *
 * Tabel ini menyimpan daftar role atau hak akses
 * yang tersedia di dalam aplikasi.
 */

export const up = (pgm) => {
    // Membuat tabel roles
    pgm.createTable("roles", {
        // ID unik untuk setiap role
        id: {
            type: "serial",
            primaryKey: true,
        },

        // Nama role, misalnya super_admin atau mahasiswa
        name: {
            type: "varchar(50)",
            notNull: true,
            unique: true,
        },

        // Penjelasan mengenai fungsi role
        description: {
            type: "varchar(255)",
            notNull: false,
        },

        // Waktu role dibuat
        created_at: {
            type: "timestamptz",
            notNull: true,
            default: pgm.func("current_timestamp"),
        },
    });

    // Memasukkan role awal ke dalam database
    pgm.sql(`
    INSERT INTO roles (name, description)
    VALUES
      ('super_admin', 'Memiliki akses penuh untuk mengelola sistem'),
      ('mahasiswa', 'Memiliki akses sebagai pengguna mahasiswa');
  `);
};

// Fungsi untuk membatalkan migration
export const down = (pgm) => {
    pgm.dropTable("roles");
};