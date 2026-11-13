import { useState } from "react";

import { useAuth } from "../../contexts/AuthContext";
import Sidebar from "../../components/Sidebar";

function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const { user } = useAuth();

  // Menentukan role pengguna
  const isSuperAdmin = user?.role === "super_admin";

  // Menentukan nama yang ditampilkan
  const displayName =
    user?.nama_mahasiswa || user?.email || "Pengguna";

  const roleLabel = isSuperAdmin
    ? "Super Admin"
    : "Mahasiswa";

  // Membuat inisial nama untuk avatar
  const initials = displayName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0].toUpperCase())
    .join("");

  return (
    <div className="min-h-screen bg-slate-50">

      {/* SIDEBAR */}
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      {/* MAIN CONTENT */}
      <main className="min-h-screen min-w-0 lg:ml-[260px]">

        {/* TOPBAR */}
        <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-slate-200 bg-white/95 px-5 backdrop-blur sm:px-8">

          <div className="flex items-center gap-3">

            {/* HAMBURGER MOBILE */}
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              aria-label="Buka menu navigasi"
              aria-expanded={sidebarOpen}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-600 transition hover:border-red-200 hover:bg-red-50 hover:text-red-700 lg:hidden"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="21"
                height="21"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M4 6h16" />
                <path d="M4 12h16" />
                <path d="M4 18h16" />
              </svg>
            </button>

            <div>
              <p className="text-xs font-medium text-slate-400">
                Halaman / Dashboard
              </p>

              <h2 className="mt-1 text-lg font-extrabold text-slate-900">
                Dashboard
              </h2>
            </div>
          </div>

          {/* PROFILE */}
          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-bold text-slate-800">
                {displayName}
              </p>

              <p className="text-[11px] font-medium text-red-700">
                {roleLabel}
              </p>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 text-sm font-extrabold text-red-700 ring-4 ring-red-50">
              {initials || "U"}
            </div>
          </div>
        </header>

        {/* DASHBOARD BODY */}
        <div className="mx-auto max-w-[1500px] p-5 sm:p-8">

          {/* DASHBOARD SUPER ADMIN */}
          {isSuperAdmin ? (
            <>
              {/* WELCOME ADMIN */}
              <section className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#650000] via-[#990000] to-[#C1122F] p-6 text-white shadow-lg shadow-red-950/10 sm:p-8">
                <div className="pointer-events-none absolute -right-12 -top-24 h-64 w-64 rounded-full border border-white/10" />

                <div className="relative z-10 max-w-2xl">
                  <span className="inline-flex rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-red-100">
                    Administrator Panel
                  </span>

                  <h1 className="mt-4 text-2xl font-extrabold sm:text-3xl">
                    Selamat Datang, {displayName}!
                  </h1>

                  <p className="mt-3 max-w-xl text-sm leading-6 text-red-100/90">
                    Kelola data mahasiswa, akun pengguna,
                    dan kebutuhan administrasi akademik
                    melalui sistem informasi terintegrasi.
                  </p>
                </div>
              </section>

              {/* ADMIN MODULES */}
              <section className="mt-8">
                <div className="mb-5">
                  <h2 className="text-lg font-extrabold text-slate-900">
                    Modul Administrasi
                  </h2>

                  <p className="mt-1 text-xs text-slate-500">
                    Daftar modul yang tersedia dalam sistem.
                  </p>
                </div>

                <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">

                  {/* MODUL MAHASISWA */}
                  <article className="rounded-2xl border border-slate-100 border-l-4 border-l-red-600 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-xl font-extrabold text-red-700">
                      M
                    </div>

                    <h3 className="mt-5 text-base font-extrabold text-slate-900">
                      Data Mahasiswa
                    </h3>

                    <p className="mt-2 text-xs leading-6 text-slate-500">
                      Mengelola informasi mahasiswa,
                      termasuk tambah, lihat, ubah,
                      dan hapus data.
                    </p>

                    <span className="mt-5 inline-flex rounded-lg bg-green-50 px-3 py-1.5 text-[10px] font-bold text-green-700">
                      Backend CRUD tersedia
                    </span>
                  </article>

                  {/* MODUL PENGGUNA */}
                  <article className="rounded-2xl border border-slate-100 border-l-4 border-l-blue-600 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-xl font-extrabold text-blue-700">
                      A
                    </div>

                    <h3 className="mt-5 text-base font-extrabold text-slate-900">
                      Manajemen Pengguna
                    </h3>

                    <p className="mt-2 text-xs leading-6 text-slate-500">
                      Mengelola akun, mengatur role,
                      dan mengontrol akses pengguna.
                    </p>

                    <span className="mt-5 inline-flex rounded-lg bg-green-50 px-3 py-1.5 text-[10px] font-bold text-green-700">
                      Backend RBAC tersedia
                    </span>
                  </article>

                  {/* MODUL AKADEMIK */}
                  <article className="rounded-2xl border border-slate-100 border-l-4 border-l-orange-500 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-50 text-xl font-extrabold text-orange-700">
                      K
                    </div>

                    <h3 className="mt-5 text-base font-extrabold text-slate-900">
                      Modul Akademik
                    </h3>

                    <p className="mt-2 text-xs leading-6 text-slate-500">
                      Pengelolaan dosen, mata kuliah,
                      dan jadwal perkuliahan.
                    </p>

                    <span className="mt-5 inline-flex rounded-lg bg-orange-50 px-3 py-1.5 text-[10px] font-bold text-orange-700">
                      Dalam pengembangan
                    </span>
                  </article>
                </div>
              </section>
            </>
          ) : (

            /* DASHBOARD MAHASISWA */
            <>
              {/* WELCOME MAHASISWA */}
              <section className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#650000] via-[#990000] to-[#C1122F] p-6 text-white shadow-lg shadow-red-950/10 sm:p-8">
                <div className="pointer-events-none absolute -right-12 -top-24 h-64 w-64 rounded-full border border-white/10" />

                <div className="relative z-10 max-w-2xl">
                  <span className="inline-flex rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-red-100">
                    Student Panel
                  </span>

                  <h1 className="mt-4 text-2xl font-extrabold sm:text-3xl">
                    Selamat Datang, {displayName}!
                  </h1>

                  <p className="mt-3 max-w-xl text-sm leading-6 text-red-100/90">
                    Selamat datang di Sistem Informasi
                    Administrasi Mahasiswa. Pantau informasi
                    dan kebutuhan akademikmu melalui halaman ini.
                  </p>
                </div>
              </section>

              {/* STUDENT PROFILE */}
              <section className="mt-8">
                <div className="mb-5">
                  <h2 className="text-lg font-extrabold text-slate-900">
                    Informasi Akun Saya
                  </h2>

                  <p className="mt-1 text-xs text-slate-500">
                    Informasi identitas yang terhubung
                    dengan akunmu.
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm sm:p-8">
                  <div className="flex flex-col gap-6 sm:flex-row sm:items-center">

                    {/* AVATAR */}
                    <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-red-100 text-2xl font-extrabold text-red-700">
                      {initials || "M"}
                    </div>

                    {/* PROFILE NAME */}
                    <div>
                      <h3 className="text-xl font-extrabold text-slate-900">
                        {user?.nama_mahasiswa || "Nama belum tersedia"}
                      </h3>

                      <p className="mt-1 text-sm text-slate-500">
                        {user?.nim || "NIM belum tersedia"}
                      </p>

                      <span className="mt-3 inline-flex rounded-lg bg-green-50 px-3 py-1.5 text-[10px] font-bold text-green-700">
                        Akun Aktif
                      </span>
                    </div>
                  </div>

                  <div className="my-6 border-t border-slate-100" />

                  {/* PROFILE DETAILS */}
                  <div className="grid gap-6 sm:grid-cols-2">

                    <div>
                      <p className="text-xs font-semibold text-slate-400">
                        Nama Lengkap
                      </p>

                      <p className="mt-2 text-sm font-bold text-slate-800">
                        {user?.nama_mahasiswa || "-"}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs font-semibold text-slate-400">
                        Nomor Induk Mahasiswa
                      </p>

                      <p className="mt-2 text-sm font-bold text-slate-800">
                        {user?.nim || "-"}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs font-semibold text-slate-400">
                        Email Akun
                      </p>

                      <p className="mt-2 break-all text-sm font-bold text-slate-800">
                        {user?.email || "-"}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs font-semibold text-slate-400">
                        Role Pengguna
                      </p>

                      <p className="mt-2 text-sm font-bold text-slate-800">
                        Mahasiswa
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              {/* STUDENT INFORMATION */}
              <section className="mt-6 rounded-2xl border border-blue-100 bg-blue-50 p-6">
                <h3 className="text-sm font-extrabold text-blue-900">
                  Informasi Akademik
                </h3>

                <p className="mt-2 text-xs leading-6 text-blue-800/80">
                  Fitur jadwal kuliah dan informasi akademik
                  sedang disiapkan. Nantinya informasi
                  tersebut dapat diakses melalui menu
                  navigasi mahasiswa.
                </p>
              </section>
            </>
          )}

          {/* FOOTER */}
          <footer className="mt-10 border-t border-slate-200 py-6 text-center">
            <p className="text-xs text-slate-400">
              © {new Date().getFullYear()} SIA Mahasiswa.
              Sistem Informasi Administrasi Akademik.
            </p>
          </footer>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
