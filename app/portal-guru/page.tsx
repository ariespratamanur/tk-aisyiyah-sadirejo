"use client";

import { useState } from "react";
import Link from "next/link";

export default function PortalGuru() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [nbm, setNbm] = useState("");
  const [password, setPassword] = useState("");
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [activeTab, setActiveTab] = useState<"jurnal" | "tabungan" | "rapor">("jurnal");

  const [jenisTransaksi, setJenisTransaksi] = useState<"setor" | "tarik">("setor");
  const [nominal, setNominal] = useState("");
  const [keterangan, setKeterangan] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (nbm && password) {
      setIsLoggedIn(true);
    } else {
      alert("Harap isi NBM dan Password!");
    }
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword) {
      alert("Password berhasil diperbarui!");
      setShowChangePassword(false);
      setNewPassword("");
    } else {
      alert("Masukkan password baru terlebih dahulu!");
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
        <div className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-md border border-slate-200">
          <div className="bg-emerald-800 text-white p-4 rounded-xl text-center mb-6 space-y-2">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/2/23/Logo_Muhammadiyah.svg"
              alt="Logo Muhammadiyah"
              className="w-12 h-12 mx-auto object-contain bg-white/10 p-1 rounded-full"
            />
            <div>
              <h1 className="font-bold text-lg">Login Portal Guru</h1>
              <p className="text-xs text-emerald-100 mt-0.5">TK 'AISYIYAH BUSTANUL ATHFAL SADIREJO</p>
            </div>
          </div>

          {!showChangePassword ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">NBM (Nomor Baku Muhammadiyah)</label>
                <input
                  type="text"
                  placeholder="Masukkan NBM Anda"
                  value={nbm}
                  onChange={(e) => setNbm(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Password</label>
                <input
                  type="password"
                  placeholder="Masukkan Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-semibold py-2.5 rounded-lg text-sm transition"
              >
                Masuk
              </button>

              <div className="flex justify-between items-center pt-2 text-xs">
                <button
                  type="button"
                  onClick={() => setShowChangePassword(true)}
                  className="text-emerald-700 hover:underline font-medium"
                >
                  Ubah Password?
                </button>
                <Link href="/" className="text-slate-500 hover:underline">
                  Kembali ke Beranda
                </Link>
              </div>
            </form>
          ) : (
            <form onSubmit={handleChangePassword} className="space-y-4">
              <h2 className="text-sm font-bold text-slate-800 mb-2">Ubah Password Guru</h2>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">NBM</label>
                <input
                  type="text"
                  placeholder="Masukkan NBM"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Password Baru</label>
                <input
                  type="password"
                  placeholder="Masukkan Password Baru"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-semibold py-2.5 rounded-lg text-sm transition"
              >
                Simpan Password Baru
              </button>

              <button
                type="button"
                onClick={() => setShowChangePassword(false)}
                className="w-full text-center text-xs text-slate-500 hover:underline mt-2"
              >
                Batal / Kembali ke Login
              </button>
            </form>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 p-4">
      <div className="max-w-3xl mx-auto space-y-4">
        {/* Header Portal Guru dengan Logo */}
        <div className="bg-emerald-800 text-white p-4 rounded-2xl shadow-sm flex justify-between items-center">
          <div className="flex items-center gap-3">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/2/23/Logo_Muhammadiyah.svg"
              alt="Logo Muhammadiyah"
              className="w-10 h-10 object-contain bg-white/10 p-1 rounded-full"
            />
            <div>
              <h1 className="font-bold text-base">Portal Guru Kelas</h1>
              <p className="text-xs text-emerald-100">TK 'AISYIYAH BUSTANUL ATHFAL SADIREJO</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowChangePassword(true)}
              className="bg-emerald-700 hover:bg-emerald-600 px-3 py-1.5 rounded-lg text-xs font-semibold"
            >
              Ubah Password
            </button>
            <button
              onClick={() => setIsLoggedIn(false)}
              className="bg-emerald-900 hover:bg-emerald-950 px-3 py-1.5 rounded-lg text-xs font-semibold"
            >
              Keluar
            </button>
          </div>
        </div>

        {/* Modal Ubah Password */}
        {showChangePassword && (
          <div className="bg-white p-4 rounded-2xl shadow-md border border-slate-200">
            <h2 className="text-sm font-bold text-slate-800 mb-3">Ubah Password Akun Guru</h2>
            <form onSubmit={handleChangePassword} className="space-y-3">
              <input
                type="password"
                placeholder="Masukkan Password Baru"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                required
              />
              <div className="flex gap-2">
                <button type="submit" className="bg-emerald-700 text-white px-4 py-2 rounded-lg text-xs font-semibold">
                  Simpan
                </button>
                <button
                  type="button"
                  onClick={() => setShowChangePassword(false)}
                  className="bg-slate-200 text-slate-700 px-4 py-2 rounded-lg text-xs font-semibold"
                >
                  Batal
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Filter Siswa & Navigasi */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Pilih Siswa Aktif:</label>
              <select className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm">
                <option>-- Pilih Siswa (2026/2027) --</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Tahun Ajaran:</label>
              <select className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm">
                <option>T.A. 2026/2027</option>
              </select>
            </div>
          </div>

          <div className="flex gap-2 pt-2 border-t border-slate-100">
            <button
              onClick={() => setActiveTab("jurnal")}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg border ${
                activeTab === "jurnal" ? "bg-emerald-700 text-white border-emerald-700" : "bg-slate-50 text-slate-600"
              }`}
            >
              Jurnal
            </button>
            <button
              onClick={() => setActiveTab("tabungan")}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg border ${
                activeTab === "tabungan" ? "bg-emerald-700 text-white border-emerald-700" : "bg-slate-50 text-slate-600"
              }`}
            >
              Tabungan
            </button>
            <button
              onClick={() => setActiveTab("rapor")}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg border ${
                activeTab === "rapor" ? "bg-emerald-700 text-white border-emerald-700" : "bg-slate-50 text-slate-600"
              }`}
            >
              e-Rapor PAUD
            </button>
          </div>
        </div>

        {/* Tab Jurnal */}
        {activeTab === "jurnal" && (
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 space-y-3">
            <h2 className="text-sm font-bold text-slate-800 border-b pb-2">Input Aktivitas Harian Siswa</h2>
            <div>
              <label className="block text-xs text-slate-500 mb-1">Tanggal Aktivitas</label>
              <input type="date" className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm" />
            </div>
            <div className="space-y-2 pt-2">
              {[
                "Sholat Dhuha Berjamaah",
                "Muraja'ah Hafalan Doa & Surah Pendek",
                "Kemandirian & Adab Makan/Minum",
                "Membaca (Iqra / Hijaiyah)",
                "Menghitung / Mengenal Angka",
                "Melukis / Mewarnai Kreatif",
                "Kegiatan Ekskul / Seni",
                "Olahraga / Senam Ceria",
                "Bermain Outdoor / Motorik",
              ].map((item, index) => (
                <label key={index} className="flex items-center gap-2 p-2.5 border border-slate-200 rounded-lg text-xs font-medium cursor-pointer hover:bg-slate-50">
                  <input type="checkbox" defaultChecked className="rounded text-emerald-600 focus:ring-emerald-500" />
                  {item}
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Tab Tabungan */}
        {activeTab === "tabungan" && (
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 space-y-4">
            <h2 className="text-sm font-bold text-slate-800 border-b pb-2">Pencatatan Tabungan Siswa</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Jenis Transaksi</label>
                <select
                  value={jenisTransaksi}
                  onChange={(e) => setJenisTransaksi(e.target.value as "setor" | "tarik")}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                >
                  <option value="setor">Setor Tabungan (+)</option>
                  <option value="tarik">Tarik Tabungan (-)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Nominal (Rp)</label>
                <input
                  type="number"
                  placeholder="Contoh: 10000"
                  value={nominal}
                  onChange={(e) => setNominal(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Keterangan / Catatan</label>
              <input
                type="text"
                placeholder="Contoh: Tabungan harian"
                value={keterangan}
                onChange={(e) => setKeterangan(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
              />
            </div>

            <button
              onClick={() => {
                if (!nominal) return alert("Masukkan nominal transaksi!");
                alert("Transaksi tabungan berhasil dicatat!");
                setNominal("");
                setKeterangan("");
              }}
              className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-semibold py-2.5 rounded-lg text-xs transition"
            >
              Simpan Transaksi Tabungan
            </button>
          </div>
        )}

        {/* Tab e-Rapor PAUD */}
        {activeTab === "rapor" && (
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 space-y-3">
            <h2 className="text-sm font-bold text-slate-800 border-b pb-2">Upload e-Rapor PAUD (File PDF)</h2>
            <div>
              <label className="block text-xs text-slate-500 mb-1">Pilih File PDF Rapor</label>
              <input type="file" accept=".pdf" className="w-full text-xs p-2 border border-slate-300 rounded-lg" />
            </div>
            <button className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-semibold py-2.5 rounded-lg text-xs transition">
              Upload File Rapor Digital
            </button>
          </div>
        )}
      </div>
    </div>
  );
}