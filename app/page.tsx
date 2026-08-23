"use client";

import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <div className="bg-white p-6 rounded-3xl shadow-xl w-full max-w-md border border-slate-200 text-center space-y-6">
        {/* Header & Logo 'Aisyiyah */}
        <div className="space-y-3">
          <img
            src="/logo.png"
            alt="Logo 'Aisyiyah"
            className="w-20 h-20 mx-auto object-contain drop-shadow-sm"
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