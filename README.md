# SIA Mahasiswa — Sistem Informasi Administrasi Mahasiswa

Aplikasi web Sistem Informasi Administrasi Mahasiswa yang dibangun menggunakan **React, Node.js, Express, TypeScript, dan PostgreSQL**.

Proyek ini bertujuan menyediakan sistem administrasi mahasiswa dengan autentikasi, manajemen data mahasiswa, pengelolaan akun pengguna, serta pembatasan hak akses berdasarkan role.

---

## 📌 Daftar Isi

- [Tentang Proyek](#-tentang-proyek)
- [Fitur Aplikasi](#-fitur-aplikasi)
- [Teknologi](#-teknologi-yang-digunakan)
- [Struktur Folder](#-struktur-folder)
- [Persyaratan Instalasi](#-persyaratan-instalasi)
- [Cara Instalasi](#-cara-instalasi)
- [Konfigurasi Database](#-konfigurasi-database)
- [Konfigurasi Backend](#-konfigurasi-backend)
- [Konfigurasi Frontend](#-konfigurasi-frontend)
- [Menjalankan Aplikasi](#-menjalankan-aplikasi)
- [Membuat Akun Super Admin](#-membuat-akun-super-admin)
- [Hak Akses Pengguna](#-hak-akses-pengguna)
- [API Endpoint](#-api-endpoint)
- [Build Production](#-build-production)
- [Keamanan](#-keamanan)

---

## 📖 Tentang Proyek

SIA Mahasiswa merupakan aplikasi berbasis web dengan arsitektur frontend dan backend terpisah dalam satu repository.

Frontend bertugas menyediakan antarmuka pengguna, sedangkan backend menangani autentikasi, validasi, pengelolaan data, serta komunikasi dengan database PostgreSQL.

Aplikasi menggunakan sistem Role-Based Access Control (RBAC) untuk membatasi akses berdasarkan jenis pengguna.

## 🚀 Fitur Aplikasi

### Autentikasi
- Login pengguna menggunakan email dan password.
- Autentikasi menggunakan JSON Web Token (JWT).
- Validasi sesi pengguna.
- Logout pengguna.
- Password disimpan menggunakan bcrypt hashing.

### Manajemen Mahasiswa
- Melihat data mahasiswa.
- Menambahkan data mahasiswa.
- Mengubah data mahasiswa.
- Menghapus data mahasiswa.

### Manajemen Pengguna
- Melihat seluruh akun pengguna.
- Membuat akun mahasiswa.
- Mengubah email dan password akun.
- Mengubah role pengguna.
- Menonaktifkan akun menggunakan soft delete.
- Melihat status akun aktif dan nonaktif.
- Audit informasi pembuat dan pengubah akun.

### Keamanan dan Hak Akses
- Middleware autentikasi JWT.
- Middleware otorisasi berdasarkan role.
- Validasi request menggunakan Zod.
- Perlindungan terhadap perubahan role akun sendiri.
- Perlindungan terhadap penonaktifan Super Admin terakhir.
- Perlindungan terhadap penurunan role Super Admin terakhir.

## 🛠 Teknologi yang Digunakan

### Backend

| Teknologi | Kegunaan |
|---|---|
| Node.js | Runtime JavaScript |
| Express 5 | Backend framework |
| TypeScript | Static typing |
| PostgreSQL | Relational database |
| node-postgres (pg) | Koneksi database |
| node-pg-migrate | Database migration |
| Zod | Validasi data |
| bcryptjs | Password hashing |
| jose | JWT authentication |
| Helmet | HTTP security headers |
| CORS | Pengaturan akses lintas origin |

### Frontend

| Teknologi | Kegunaan |
|---|---|
| React 19 | UI library |
| TypeScript | Static typing |
| Vite | Development server dan build tool |
| Tailwind CSS 4 | Styling |
| React Router 7 | Routing |
| Axios | HTTP client |
| SweetAlert2 | Notifikasi dan konfirmasi |

## 📁 Struktur Folder

```text
sia-mahasiswa/
│
├── backend/
│   ├── migrations/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middlewares/
│   │   ├── routes/
│   │   ├── schemas/
│   │   ├── scripts/
│   │   ├── services/
│   │   ├── types/
│   │   ├── utils/
│   │   ├── app.ts
│   │   └── server.ts
│   ├── .env.example
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── contexts/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── types/
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── package.json
│   └── vite.config.ts
│
├── .gitignore
└── README.md
```

## 💻 Persyaratan Instalasi

Pastikan perangkat sudah memiliki:

1. Node.js versi 24 LTS atau versi kompatibel dengan dependency proyek.
2. npm.
3. PostgreSQL.
4. Git.
5. Code editor seperti Visual Studio Code.

Periksa instalasi Node.js dan npm:

```bash
node -v
npm -v
```

Periksa instalasi PostgreSQL:

```bash
psql --version
```

## 📥 Cara Instalasi

### 1. Clone Repository

```bash
git clone https://github.com/USERNAME/sia-mahasiswa.git
```

Masuk ke folder proyek:

```bash
cd sia-mahasiswa
```

Ganti `USERNAME` dengan username GitHub pemilik repository.

### 2. Instalasi Backend

```bash
cd backend
npm install
```

Buat file konfigurasi `.env` berdasarkan contoh:

```bash
cp .env.example .env
```

Pada Windows, file tersebut juga bisa dibuat secara manual dengan menyalin `.env.example` menjadi `.env`.

### 3. Instalasi Frontend

Buka terminal baru dari folder utama proyek:

```bash
cd frontend
npm install
```

Buat file `.env` frontend berdasarkan `.env.example` jika file tersebut tersedia di repository.

Jika belum tersedia, buat file `.env` dengan konfigurasi berikut:

```env
VITE_API_URL=http://localhost:3000/api
```

## 🗄 Konfigurasi Database

Pastikan PostgreSQL sudah aktif.

Buat database baru:

```sql
CREATE DATABASE sia_mahasiswa;
```

Database ini akan digunakan oleh backend untuk menyimpan data mahasiswa, akun pengguna, role, dan informasi lainnya.

## ⚙️ Konfigurasi Backend

Buka file:

```text
backend/.env
```

Sesuaikan konfigurasi berikut:

```env
PORT=3000

FRONTEND_URL=http://localhost:5173

DATABASE_URL=postgresql://postgres:password@localhost:5432/sia_mahasiswa

JWT_SECRET=GANTI_DENGAN_SECRET_RANDOM_YANG_KUAT

JWT_EXPIRES_IN=1d
```

Keterangan:

| Variabel | Keterangan |
|---|---|
| PORT | Port backend |
| FRONTEND_URL | URL frontend untuk konfigurasi CORS |
| DATABASE_URL | Koneksi PostgreSQL |
| JWT_SECRET | Secret untuk menandatangani JWT |
| JWT_EXPIRES_IN | Masa berlaku token |

**Penting:** Ganti `postgres`, `password`, dan nilai lainnya sesuai konfigurasi PostgreSQL di perangkat masing-masing.

Untuk membuat JWT secret acak, dapat menggunakan:

```bash
node -e "console.log(require('node:crypto').randomBytes(64).toString('hex'))"
```

Masukkan hasilnya ke variabel `JWT_SECRET`.

### Menjalankan Database Migration

Dari folder backend:

```bash
npm run migrate:up
```

Perintah tersebut menjalankan seluruh migration yang tersedia untuk membentuk struktur database.

## 🎨 Konfigurasi Frontend

Buat file:

```text
frontend/.env
```

Isi dengan:

```env
VITE_API_URL=http://localhost:3000/api
```

Variabel tersebut digunakan Axios untuk menentukan alamat backend API.

## ▶️ Menjalankan Aplikasi

Aplikasi memiliki dua bagian yang harus dijalankan secara bersamaan.

### Terminal 1 — Backend

Masuk ke folder backend:

```bash
cd backend
```

Jalankan server development:

```bash
npm run dev
```

Backend berjalan pada:

```text
http://localhost:3000
```

### Terminal 2 — Frontend

Buka terminal baru:

```bash
cd frontend
```

Jalankan development server:

```bash
npm run dev
```

Frontend berjalan pada:

```text
http://localhost:5173
```

Buka alamat tersebut melalui browser untuk mengakses aplikasi.

## 👑 Membuat Akun Super Admin

Setelah migration selesai, buat akun Super Admin pertama menggunakan script bootstrap yang tersedia.

Pastikan file `backend/.env` sudah dikonfigurasi dengan variabel berikut:

```env
BOOTSTRAP_ADMIN_EMAIL=admin@example.com
BOOTSTRAP_ADMIN_PASSWORD=GANTI_PASSWORD_YANG_KUAT
BOOTSTRAP_ADMIN_ID_MHS=1
```

`BOOTSTRAP_ADMIN_ID_MHS` harus mengacu pada ID mahasiswa yang sudah tersedia di database.

Jalankan dari folder backend:

```bash
npm run bootstrap:admin
```

Ikuti ketentuan script bootstrap. Setelah akun berhasil dibuat, gunakan email dan password tersebut untuk login.

**Catatan:** Buat data mahasiswa terlebih dahulu jika database masih kosong. Jangan menganggap ID mahasiswa selalu bernilai 1.

## 🔐 Hak Akses Pengguna

Sistem menggunakan dua jenis role.

| Role | Hak Akses |
|---|---|
| `super_admin` | Mengelola data mahasiswa dan akun pengguna |
| `mahasiswa` | Melihat profil mahasiswa miliknya sendiri |

### Matriks Hak Akses Mahasiswa

| Endpoint | Super Admin | Mahasiswa |
|---|---|---|
| GET `/api/mahasiswa` | ✓ | ✗ |
| GET `/api/mahasiswa/me` | ✓ | ✓ |
| GET `/api/mahasiswa/:id` | ✓ | ✗ |
| POST `/api/mahasiswa` | ✓ | ✗ |
| PUT `/api/mahasiswa/:id` | ✓ | ✗ |
| DELETE `/api/mahasiswa/:id` | ✓ | ✗ |

## 🔌 API Endpoint

Base URL:

```text
http://localhost:3000/api
```

### Authentication

| Method | Endpoint | Keterangan |
|---|---|---|
| POST | `/auth/login` | Login pengguna |
| GET | `/auth/me` | Validasi sesi dan profil pengguna |

### Mahasiswa

| Method | Endpoint | Keterangan |
|---|---|---|
| GET | `/mahasiswa` | Mengambil semua mahasiswa |
| GET | `/mahasiswa/me` | Mengambil profil mahasiswa sendiri |
| GET | `/mahasiswa/:id` | Mengambil detail mahasiswa |
| POST | `/mahasiswa` | Menambahkan mahasiswa |
| PUT | `/mahasiswa/:id` | Memperbarui mahasiswa |
| DELETE | `/mahasiswa/:id` | Menghapus mahasiswa |

### User Management

Seluruh endpoint `/users` membutuhkan autentikasi Super Admin.

| Method | Endpoint | Keterangan |
|---|---|---|
| GET | `/users` | Mengambil semua akun |
| GET | `/users/:uuid` | Mengambil detail akun |
| POST | `/users` | Membuat akun |
| PUT | `/users/:uuid` | Memperbarui email/password |
| PATCH | `/users/:uuid/role` | Mengubah role |
| DELETE | `/users/:uuid` | Menonaktifkan akun |

Untuk endpoint yang memerlukan autentikasi, sertakan header:

```http
Authorization: Bearer TOKEN_JWT
```

Contoh request untuk mengubah role:

```http
PATCH /api/users/UUID_AKUN/role
```

Request body:

```json
{
  "role_id": 1
}
```

Keterangan:

- `1` = `super_admin`
- `2` = `mahasiswa`

## 🏗 Build Production

### Backend

Dari folder backend:

```bash
npm run build
```

Menjalankan hasil build:

```bash
npm start
```

### Frontend

Dari folder frontend:

```bash
npm run build
```

Hasil build frontend akan tersedia di:

```text
frontend/dist/
```

Folder tersebut dapat di-deploy menggunakan web server seperti Nginx.

## 🔒 Keamanan

Beberapa hal yang perlu diperhatikan ketika menggunakan atau mengembangkan proyek ini:

- Jangan mengunggah file `.env` ke repository publik.
- Jangan membagikan JWT secret.
- Jangan menyimpan password dalam bentuk plaintext.
- Gunakan password database yang kuat.
- Gunakan HTTPS pada deployment production.
- Batasi akses endpoint berdasarkan autentikasi dan role.
- Jangan menonaktifkan perlindungan Super Admin terakhir.
- Gunakan akun dan database terpisah untuk development dan production.

---

## 📚 Referensi Dokumentasi Resmi

- [Node.js](https://nodejs.org/docs/latest/api/)
- [Express.js](https://expressjs.com/)
- [React](https://react.dev/learn)
- [Vite](https://vite.dev/guide/)
- [TypeScript](https://www.typescriptlang.org/docs/)
- [PostgreSQL](https://www.postgresql.org/docs/)
- [node-postgres](https://node-postgres.com/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Axios](https://axios-http.com/docs/intro)
- [React Router](https://reactrouter.com/)

---

**SIA Mahasiswa**  
Sistem Informasi Administrasi Mahasiswa

Dikembangkan sebagai proyek pembelajaran dan pengembangan aplikasi Full Stack Web Development.