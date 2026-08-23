"use client";

import { useState } from "react";
import Link from "next/link";

export default function PortalWali() {
  const [activeTab, setActiveTab] = useState<"tagihan" | "jurnal" | "tabungan" | "ppdb">("tagihan");

  return (
    <div className="min-h-screen bg-slate-100 p-4">
      <div className="max-w-3xl mx-auto space-y-4">
        {/* Header Portal Wali Murid */}
        <div className="bg-emerald-800 text-white p-4 rounded-2xl shadow-sm flex justify-between items-center">
          <div className="flex items-center gap-3">
            <img
              src="/logo.png"
              alt="Logo 'Aisyiyah"
              className="w-10 h-10 object-contain bg-white/10 p-1 rounded-full"
            />
            <div>
              <h1 className="font-bold text-base">Portal Wali Murid</h1>
              <p className="text-xs text-emerald-100">TK 'AISYIYAH BUSTANUL ATHFAL SADIREJO</p>
            </div>
          </div>
          <Link
            href="/"
            className="bg-emerald-700 hover:bg-emerald-600 px-3 py-1.5 rounded-lg text-xs font-semibold"
          >
            Kembali
          </Link>
        </div>

        {/* Tab Navigasi */}
        <div className="bg-white p-2 rounded-2xl shadow-sm border border-slate-200 flex gap-1">
          <button
            onClick={() => setActiveTab("tagihan")}
            className={`flex-1 py-2 text-xs font-semibold rounded-xl transition ${
              activeTab === "tagihan" ? "bg-emerald-700 text-white" : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            💳 Tagihan & SPP
          </button>
          <button
            onClick={() => setActiveTab("jurnal")}
            className={`flex-1 py-2 text-xs font-semibold rounded-xl transition ${
              activeTab === "jurnal" ? "bg-emerald-700 text-white" : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            📖 Jurnal Harian
          </button>
          <button
            onClick={() => setActiveTab("tabungan")}
            className={`flex-1 py-2 text-xs font-semibold rounded-xl transition ${
              activeTab === "tabungan" ? "bg-emerald-700 text-white" : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            💰 Tabungan
          </button>
          <button
            onClick={() => setActiveTab("ppdb")}
            className={`flex-1 py-2 text-xs font-semibold rounded-xl transition ${
              activeTab === "ppdb" ? "bg-emerald-700 text-white" : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            📄 Pendaftaran PPDB
          </button>
        </div>

        {/* Konten Tab 1: Tagihan & SPP */}
        {activeTab === "tagihan" && (
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 space-y-3">
            <h2 className="text-sm font-bold text-slate-800 border-b pb-2">Informasi Tagihan & Infaq Belajar</h2>
            <div className="text-xs text-slate-500 bg-slate-50 p-6 rounded-xl border border-slate-200 text-center">
              Belum ada tagihan baru untuk siswa Anda.
            </div>
          </div>
        )}

        {/* Konten Tab 2: Jurnal Harian */}
        {activeTab === "jurnal" && (
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 space-y-3">
            <h2 className="text-sm font-bold text-slate-800 border-b pb-2">Catatan Perkembangan & Aktivitas Siswa</h2>
            <div className="text-xs text-slate-500 bg-slate-50 p-6 rounded-xl border border-slate-200 text-center">
              Belum ada catatan jurnal harian dari Guru Kelas.
            </div>
          </div>
        )}

        {/* Konten Tab 3: Tabungan */}
        {activeTab === "tabungan" && (
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 space-y-3">
            <h2 className="text-sm font-bold text-slate-800 border-b pb-2">Saldo & Mutasi Tabungan Siswa</h2>
            <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl text-center">
              <p className="text-xs text-emerald-800 font-semibold">Total Saldo Tabungan</p>
              <p className="text-xl font-bold text-emerald-950 mt-0.5">Rp 0</p>
            </div>
          </div>
        )}

        {/* Konten Tab 4: Pendaftaran PPDB Online */}
        {activeTab === "ppdb" && (
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 space-y-4">
            <h2 className="text-sm font-bold text-slate-800 border-b pb-2">Formulir Pendaftaran Siswa Baru (PPDB)</h2>
            <form onSubmit={(e) => { e.preventDefault(); alert("Pendaftaran berhasil dikirim!"); }} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Nama Lengkap Calon Siswa</label>
                <input type="text" placeholder="Masukkan nama anak" className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs" required />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Nama Wali Murid / Orang Tua</label>
                <input type="text" placeholder="Masukkan nama ayah/ibu" className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs" required />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Nomor WhatsApp Wali</label>
                <input type="tel" placeholder="Contoh: 08123456789" className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs" required />
              </div>
              <button type="submit" className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-semibold py-2.5 rounded-lg text-xs transition">
                Kirim Pendaftaran PPDB
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}