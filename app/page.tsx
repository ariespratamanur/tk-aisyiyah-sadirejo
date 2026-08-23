"use client";

import Link from "next/link";

export default function Home() {
  // Logo Muhammadiyah dalam format SVG Data URI (Pasti Muncul)
  const logoMuhammadiyah = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><circle cx='50' cy='50' r='48' fill='%2300875A'/><circle cx='50' cy='50' r='40' fill='%2313653F'/><polygon points='50,10 54,25 68,16 60,30 75,30 63,40 76,50 63,60 75,70 60,70 68,84 54,75 50,90 46,75 32,84 40,70 25,70 37,60 24,50 37,40 25,30 40,30 32,16 46,25' fill='%23FFFFFF'/><circle cx='50' cy='50' r='18' fill='%2313653F'/><text x='50' y='55' font-size='12' font-weight='bold' fill='%23FFFFFF' text-anchor='middle' font-family='Arial'>M</text></svg>";

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <div className="bg-white p-6 rounded-3xl shadow-xl w-full max-w-md border border-slate-200 text-center space-y-6">
        {/* Header & Logo */}
        <div className="space-y-3">
          <img
            src={logoMuhammadiyah}
            alt="Logo Muhammadiyah"
            className="w-16 h-16 mx-auto object-contain drop-shadow-md"
          />
          <div>
            <h1 className="text-lg font-bold text-emerald-950">
              TK 'AISYIYAH BUSTANUL ATHFAL SADIREJO
            </h1>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Portal Layanan Digital Terpadu Sekolah
            </p>
          </div>
        </div>

        <hr className="border-slate-100" />

        {/* Pilihan Akses Portal */}
        <div className="space-y-3">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            -- PILIH PORTAL AKSES --
          </p>

          <Link
            href="/portal-wali"
            className="flex items-center justify-between p-3.5 bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 rounded-2xl transition group"
          >
            <div className="text-left">
              <h2 className="text-xs font-bold text-slate-800 group-hover:text-emerald-800">
                Portal Wali Murid
              </h2>
              <p className="text-[10px] text-slate-500">Tagihan, Infaq Belajar & PPDB</p>
            </div>
            <span className="bg-emerald-700 text-white text-xs font-bold px-3 py-1.5 rounded-xl">
              Masuk
            </span>
          </Link>

          <Link
            href="/portal-guru"
            className="flex items-center justify-between p-3.5 bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 rounded-2xl transition group"
          >
            <div className="text-left">
              <h2 className="text-xs font-bold text-slate-800 group-hover:text-emerald-800">
                Portal Guru Kelas
              </h2>
              <p className="text-[10px] text-slate-500">Input Jurnal & e-Rapor PAUD</p>
            </div>
            <span className="bg-emerald-700 text-white text-xs font-bold px-3 py-1.5 rounded-xl">
              Masuk
            </span>
          </Link>

          <Link
            href="/portal-tu"
            className="flex items-center justify-between p-3.5 bg-slate-50 hover:bg-orange-50 border border-slate-200 hover:border-orange-300 rounded-2xl transition group"
          >
            <div className="text-left">
              <h2 className="text-xs font-bold text-slate-800 group-hover:text-orange-800">
                Portal Tata Usaha (TU)
              </h2>
              <p className="text-[10px] text-slate-500">Verifikasi PPDB & Kuitansi SPP</p>
            </div>
            <span className="bg-orange-600 text-white text-xs font-bold px-3 py-1.5 rounded-xl">
              Masuk
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}