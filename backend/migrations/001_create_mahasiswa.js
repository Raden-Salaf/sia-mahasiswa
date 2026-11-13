/**
 * Migration untuk membuat tabel mahasiswa.
 *
 * Fungsi up() dijalankan ketika migration diterapkan.
 * Fungsi down() dijalankan ketika migration dibatalkan.
 */

export const up = (pgm) => {
    // Membuat tabel mahasiswa.
    pgm.createTable("mahasiswa", {
        // Primary key otomatis bertambah.
        id: {
            type: "serial",
            primaryKey: true,
        },

        // NIM harus unik dan wajib diisi.
        nim: {
            type: "varchar(20)",
            notNull: true,
            unique: true,
        },

        // Nama lengkap mahasiswa.
        nama_mahasiswa: {
            type: "varchar(150)",
            notNull: true,
        },

        // Jenis kelamin hanya boleh L atau P.
        jenis_kelamin: {
            type: "char(1)",
            notNull: true,
        },

        // Tempat lahir mahasiswa.
        tempat_lahir: {
            type: "varchar(100)",
            notNull: true,
        },

        // Tanggal lahir mahasiswa.
        tanggal_lahir: {
            type: "date",
            notNull: true,
        },

        // Kelas atau rombongan belajar.
        kelas: {
            type: "varchar(50)",
            notNull: true,
        },

        // Alamat lengkap mahasiswa.
        alamat: {
            type: "text",
            notNull: true,
        },

        // Nama ibu kandung.
        nama_ibu_kandung: {
            type: "varchar(150)",
            notNull: true,
        },

        // Nomor HP atau WhatsApp orang tua/wali.
        no_hp_wali: {
            type: "varchar(20)",
            notNull: true,
        },

        // Keterangan tambahan boleh kosong.
        keterangan: {
            type: "text",
        },

        // Waktu data pertama kali dibuat.
        created_at: {
            type: "timestamptz",
            notNull: true,
            default: pgm.func("current_timestamp"),
        },

        // Waktu terakhir data diperbarui.
        updated_at: {
            type: "timestamptz",
            notNull: true,
            default: pgm.func("current_timestamp"),
        },
    });

    // Membatasi nilai jenis kelamin hanya L atau P.
    pgm.addConstraint("mahasiswa", "mahasiswa_jenis_kelamin_check", {
        check: "jenis_kelamin IN ('L', 'P')",
    });

    // Membuat index untuk mempercepat pencarian berdasarkan nama.
    pgm.createIndex("mahasiswa", "nama_mahasiswa");
};

// Membatalkan migration dengan menghapus tabel mahasiswa.
export const down = (pgm) => {
    pgm.dropTable("mahasiswa");
};