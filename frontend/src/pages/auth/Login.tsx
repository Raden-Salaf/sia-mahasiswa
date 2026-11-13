import { useEffect, useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import { alertService } from "../../services/alert.service";
import { useAuth } from "../../contexts/AuthContext";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [currentTime, setCurrentTime] = useState(new Date());

  // Jam dan tanggal real-time WIB
  useEffect(() => {
    const timer = window.setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => window.clearInterval(timer);
  }, []);

  const timeFormatter = new Intl.DateTimeFormat("id-ID", {
    timeZone: "Asia/Jakarta",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });

  const dateFormatter = new Intl.DateTimeFormat("id-ID", {
    timeZone: "Asia/Jakarta",
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  // Proses login melalui AuthContext
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isSubmitting) return;

    setIsSubmitting(true);
    void alertService.loading("Memverifikasi akun...");

    try {
      const user = await login({
        email: email.trim(),
        password,
      });

      alertService.close();

      await alertService.success(
        "Login berhasil!",
        `Selamat datang, ${user.nama_mahasiswa}.`
      );

      navigate("/dashboard", { replace: true });
    } catch (error: unknown) {
      alertService.close();

      let message = "Terjadi kesalahan. Silakan coba kembali.";

      if (axios.isAxiosError(error)) {
        message =
          error.response?.data?.message ||
          "Tidak dapat terhubung ke server.";
      }

      await alertService.error("Login gagal", message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#F8FAFC] lg:grid lg:grid-cols-2">

      {/* PANEL KIRI */}
      <section className="relative hidden min-h-screen overflow-hidden bg-gradient-to-br from-[#650000] via-[#990000] to-[#C1122F] px-12 py-12 text-white lg:flex lg:flex-col lg:justify-between xl:px-16">

        {/* Dekorasi Background */}
        <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full border border-white/10" />
        <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full border border-white/10" />
        <div className="pointer-events-none absolute -bottom-40 -left-32 h-96 w-96 rounded-full bg-white/5 blur-3xl" />

        {/* Identitas Aplikasi */}
        <div className="relative z-10">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/30 bg-white/10 text-2xl font-black shadow-lg backdrop-blur-sm">
              S
            </div>

            <div>
              <h1 className="text-xl font-extrabold tracking-wide">
                SIA MAHASISWA
              </h1>
              <p className="mt-1 text-xs tracking-[0.2em] text-white/70">
                SISTEM INFORMASI AKADEMIK
              </p>
            </div>
          </div>
        </div>

        {/* Informasi Utama */}
        <div className="relative z-10 my-16 max-w-xl">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold tracking-wide backdrop-blur-sm">
            <span className="h-2 w-2 animate-pulse rounded-full bg-green-400" />
            PLATFORM AKADEMIK DIGITAL
          </div>

          <h2 className="text-4xl font-extrabold leading-tight xl:text-5xl">
            Satu Platform,
            <br />
            <span className="text-red-200">
              Banyak Kemudahan.
            </span>
          </h2>

          <p className="mt-6 max-w-lg text-base leading-8 text-white/75">
            Kelola informasi akademik, administrasi mahasiswa, dan
            berbagai layanan kampus melalui satu sistem yang
            terintegrasi.
          </p>

          {/* Fitur Sistem */}
          <div className="mt-12 space-y-5">
            <div className="flex items-center gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/10 text-lg">
                ◈
              </div>
              <div>
                <h3 className="font-bold">Informasi Akademik</h3>
                <p className="mt-1 text-sm text-white/60">
                  Akses informasi perkuliahan dengan mudah.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/10 text-lg">
                ▤
              </div>
              <div>
                <h3 className="font-bold">Administrasi Mahasiswa</h3>
                <p className="mt-1 text-sm text-white/60">
                  Pengelolaan data mahasiswa secara terpusat.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/10 text-lg">
                ✓
              </div>
              <div>
                <h3 className="font-bold">Layanan Online</h3>
                <p className="mt-1 text-sm text-white/60">
                  Mendukung pelayanan akademik yang lebih praktis.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Status dan Footer */}
        <div className="relative z-10 flex flex-wrap items-end justify-between gap-4 border-t border-white/20 pt-6">
          <div>
            <p className="text-xs text-white/50">STATUS SISTEM</p>
            <div className="mt-2 flex items-center gap-2 text-sm font-semibold">
              <span className="h-2 w-2 rounded-full bg-green-400" />
              Sistem Siap Digunakan
            </div>
          </div>

          <p className="text-xs text-white/50">
            © {new Date().getFullYear()} SIA Mahasiswa
          </p>
        </div>
      </section>

      {/* PANEL KANAN */}
      <section className="flex min-h-screen items-center justify-center px-6 py-10 sm:px-10 lg:px-12 xl:px-20">

        <div className="w-full max-w-md">

          {/* Identitas Mobile */}
          <div className="mb-10 flex items-center gap-3 lg:hidden">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#990000] to-[#C1122F] text-xl font-black text-white shadow-lg">
              S
            </div>

            <div>
              <h1 className="font-extrabold tracking-wide text-[#650000]">
                SIA MAHASISWA
              </h1>
              <p className="text-[10px] tracking-[0.15em] text-slate-500">
                SISTEM INFORMASI AKADEMIK
              </p>
            </div>
          </div>

          {/* Jam Digital */}
          <div className="mb-10 border-b border-slate-200 pb-6">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
              Waktu Indonesia Barat
            </p>

            <div className="mt-2 flex flex-wrap items-baseline gap-3">
              <h2 className="font-mono text-3xl font-bold tracking-tight text-[#990000] sm:text-4xl">
                {timeFormatter.format(currentTime)}
              </h2>

              <span className="text-xs font-semibold text-slate-400">
                WIB
              </span>
            </div>

            <p className="mt-2 text-sm capitalize text-slate-500">
              {dateFormatter.format(currentTime)}
            </p>
          </div>

          {/* Heading Form */}
          <div className="mb-8">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#B91C2C]">
              Selamat Datang
            </p>

            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              Masuk ke Akun
            </h2>

            <p className="mt-3 text-sm leading-6 text-slate-500">
              Silakan masukkan email dan password untuk
              mengakses sistem informasi akademik.
            </p>
          </div>

          {/* Form Login */}
          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Email
              </label>

              <div className="relative">
                <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                  ✉
                </span>

                <input
                  id="email"
                  type="email"
                  name="email"
                  autoComplete="username"
                  placeholder="Masukkan email Anda"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                  disabled={isSubmitting}
                  className="w-full rounded-xl border border-slate-200 bg-white py-3.5 pl-11 pr-4 text-sm text-slate-800 outline-none transition-all placeholder:text-slate-400 hover:border-slate-300 focus:border-[#B91C2C] focus:ring-4 focus:ring-red-100 disabled:cursor-not-allowed disabled:bg-slate-100"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="mb-2 flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm font-semibold text-slate-700"
                >
                  Password
                </label>

                <button
                  type="button"
                  onClick={() => {
                    void alertService.info(
                      "Lupa Password",
                      "Silakan hubungi administrator untuk bantuan pemulihan akun."
                    );
                  }}
                  className="text-xs font-semibold text-[#B91C2C] transition-colors hover:text-[#650000]"
                >
                  Lupa password?
                </button>
              </div>

              <div className="relative">
                <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                  ◈
                </span>

                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  autoComplete="current-password"
                  placeholder="Masukkan password Anda"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                  disabled={isSubmitting}
                  className="w-full rounded-xl border border-slate-200 bg-white py-3.5 pl-11 pr-14 text-sm text-slate-800 outline-none transition-all placeholder:text-slate-400 hover:border-slate-300 focus:border-[#B91C2C] focus:ring-4 focus:ring-red-100 disabled:cursor-not-allowed disabled:bg-slate-100"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isSubmitting}
                  aria-label={
                    showPassword ? "Sembunyikan password" : "Tampilkan password"
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400 transition-colors hover:text-[#990000]"
                >
                  {showPassword ? "SEMBUNYIKAN" : "LIHAT"}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center justify-between">
              <label className="flex cursor-pointer items-center gap-2.5 text-sm text-slate-600">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(event) => setRememberMe(event.target.checked)}
                  disabled={isSubmitting}
                  className="h-4 w-4 cursor-pointer accent-[#990000]"
                />
                Ingat saya
              </label>

              <span className="text-xs text-slate-400">
                Akun resmi mahasiswa
              </span>
            </div>

            {/* Tombol Login */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="group flex w-full items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-[#8B0000] to-[#C1122F] px-5 py-4 text-sm font-bold tracking-wide text-white shadow-lg shadow-red-900/20 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-red-900/30 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
            >
              {isSubmitting ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Memproses...
                </>
              ) : (
                <>
                  Masuk ke Dashboard
                  <span className="transition-transform duration-300 group-hover:translate-x-1">
                    →
                  </span>
                </>
              )}
            </button>
          </form>

          {/* Footer Form */}
          <div className="mt-10 border-t border-slate-200 pt-6 text-center">
            <p className="text-xs leading-6 text-slate-400">
              Dengan masuk, Anda menyetujui penggunaan sistem
              informasi akademik sesuai ketentuan yang berlaku.
            </p>

            <p className="mt-5 text-xs font-medium text-slate-400">
              SIA Mahasiswa · © {new Date().getFullYear()}
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Login;
