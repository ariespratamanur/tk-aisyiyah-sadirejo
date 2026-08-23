"use client";

import { useState } from "react";
import Link from "next/link";

export default function PortalTU() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [nbm, setNbm] = useState("");
  const [password, setPassword] = useState("");
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [activeTab, setActiveTab] = useState<"ppdb" | "rapor" | "laporan" | "tabungan" | "tagihan" | "wa">("ppdb");

  const [daftarPPDB] = useState<any[]>([]);

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
          <div className="bg-orange-600 text-white p-4 rounded-xl text-center mb-6 space-y-2">
            <img
              src="/logo.png"
              alt="Logo 'Aisyiyah"
              className="w-12 h-12 mx-auto object-contain bg-white/10 p-1 rounded-full"
            />
            <div>
              <h1 className="font-bold text-lg">Login Portal Tata Usaha (TU)</h1>
              <p className="text-xs text-orange-100 mt-0.5">TK 'AISYIYAH BUSTANUL ATHFAL SADIREJO</p>
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
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
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
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-2.5 rounded-lg text-sm transition"
              >
                Masuk
              </button>

              <div className="flex justify-between items-center pt-2 text-xs">
                <button
                  type="button"
                  onClick={() => setShowChangePassword(true)}
                  className="text-orange-600 hover:underline font-medium"
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
              <h2 className="text-sm font-bold text-slate-800 mb-2">Ubah Password Akun TU</h2>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">NBM</label>
                <input
                  type="text"
                  placeholder="Masukkan NBM"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
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
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-2.5 rounded-lg text-sm transition"
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
      <div className="max-w-4xl mx-auto space-y-4">
        {/* Header Portal TU dengan Logo */}
        <div className="bg-orange-600 text-white p-4 rounded-2xl shadow-sm flex justify-between items-center">
          <div className="flex items-center gap-3">
            <img
              src="/logo.png"
              alt="Logo 'Aisyiyah"
              className="w-10 h-10 object-contain bg-white/10 p-1 rounded-full"
            />
            <div>
              <h1 className="font-bold text-base">Portal Tata Usaha (TU)</h1>
              <p className="text-xs text-orange-100">TK 'AISYIYAH BUSTANUL ATHFAL SADIREJO</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowChangePassword(true)}
              className="bg-orange-500 hover:bg-orange-400 px-3 py-1.5 rounded-lg text-xs font-semibold"
            >
              Ubah Password
            </button>
            <button
              onClick={() => setIsLoggedIn(false)}
              className="bg-orange-800 hover:bg-orange-900 px-3 py-1.5 rounded-lg text-xs font-semibold"
            >
              Keluar
            </button>
          </div>
        </div>

        {/* Modal Ubah Password */}
        {showChangePassword && (
          <div className="bg-white p-4 rounded-2xl shadow-md border border-slate-200">
            <h2 className="text-sm font-bold text-slate-800 mb-3">Ubah Password Akun TU</h2>
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
                <button type="submit" className="bg-orange-600 text-white px-4 py-2 rounded-lg text-xs font-semibold">
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

        {/* Navigasi Tab */}
        <div className="bg-white p-2 rounded-2xl shadow-sm border border-slate-200 flex flex-wrap justify-between gap-1">
          <button
            onClick={() => setActiveTab("ppdb")}
            className={`flex-1 py-2 rounded-xl text-xs font-semibold ${
              activeTab === "ppdb" ? "bg-orange-600 text-white" : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            📄 PPDB
          </button>
          <button
            onClick={() => setActiveTab("rapor")}
            className={`flex-1 py-2 rounded-xl text-xs font-semibold ${
              activeTab === "rapor" ? "bg-orange-600 text-white" : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            📁 e-Rapor PAUD
          </button>
          <button
            onClick={() => setActiveTab("laporan")}
            className={`flex-1 py-2 rounded-xl text-xs font-semibold ${
              activeTab === "laporan" ? "bg-orange-600 text-white" : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            📊 Laporan
          </button>
          <button
            onClick={() => setActiveTab("tabungan")}
            className={`flex-1 py-2 rounded-xl text-xs font-semibold ${
              activeTab === "tabungan" ? "bg-orange-600 text-white" : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            💰 Tabungan
          </button>
          <button
            onClick={() => setActiveTab("tagihan")}
            className={`flex-1 py-2 rounded-xl text-xs font-semibold ${
              activeTab === "tagihan" ? "bg-orange-600 text-white" : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            💳 Tagihan
          </button>
          <button
            onClick={() => setActiveTab("wa")}
            className={`flex-1 py-2 rounded-xl text-xs font-semibold ${
              activeTab === "wa" ? "bg-orange-600 text-white" : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            📢 Info WA
          </button>
        </div>

        {/* Tab 1: PPDB */}
        {activeTab === "ppdb" && (
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 space-y-4">
            <div className="flex justify-between items-center border-b pb-3">
              <h2 className="text-sm font-bold text-slate-800">Verifikasi Pendaftaran & Kelola Status Siswa</h2>
              <div className="flex gap-2">
                <select className="text-xs border border-slate-300 rounded-lg px-2 py-1">
                  <option>T.A. 2026/2027</option>
                </select>
                <select className="text-xs border border-slate-300 rounded-lg px-2 py-1">
                  <option>Semua Status</option>
                </select>
              </div>
            </div>

            {daftarPPDB.length === 0 ? (
              <div className="text-xs text-slate-500 bg-slate-50 p-8 rounded-xl border border-slate-200 text-center">
                Belum ada data pendaftar baru PPDB. Data wali murid yang mendaftar secara online akan otomatis muncul di sini.
              </div>
            ) : (
              <div className="space-y-3">
                {daftarPPDB.map((siswa, i) => (
                  <div key={i} className="p-3 border border-slate-200 rounded-xl space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="text-xs font-bold text-slate-800">{siswa.nama} <span className="text-slate-500 font-normal">({siswa.kelas})</span></h4>
                        <p className="text-[11px] text-slate-500">Wali: {siswa.namaWali} | WA: {siswa.wa}</p>
                      </div>
                      <span className="bg-emerald-100 text-emerald-800 font-bold text-[10px] px-2.5 py-0.5 rounded-full uppercase">
                        {siswa.status}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1.5 pt-1 border-t border-slate-100">
                      <button className="bg-emerald-600 text-white text-[11px] font-bold px-2.5 py-1 rounded-lg">✓ Set Diterima</button>
                      <button className="bg-rose-600 text-white text-[11px] font-bold px-2.5 py-1 rounded-lg">✕ Set Pindah Sekolah</button>
                      <button className="bg-blue-600 text-white text-[11px] font-bold px-2.5 py-1 rounded-lg">🎓 Set Alumni (Lulus)</button>
                      <button className="bg-sky-500 text-white text-[11px] font-bold px-2.5 py-1 rounded-lg">📥 Download Formulir PDF</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: e-Rapor PAUD */}
        {activeTab === "rapor" && (
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 space-y-4">
            <div className="flex justify-between items-center border-b pb-3">
              <div>
                <h2 className="text-sm font-bold text-slate-800">Unduh e-Rapor PAUD (Arsip Fisik Sekolah)</h2>
                <p className="text-xs text-slate-500">Cari & cetak arsip rapor siswa berdasarkan Tahun Ajaran & Status Alumni.</p>
              </div>
              <div className="flex gap-2">
                <select className="text-xs border border-slate-300 rounded-lg px-2 py-1">
                  <option>T.A. 2026/2027</option>
                </select>
                <select className="text-xs border border-slate-300 rounded-lg px-2 py-1">
                  <option>Semua Siswa</option>
                </select>
              </div>
            </div>

            <div className="text-xs text-slate-500 bg-slate-50 p-8 rounded-xl border border-slate-200 text-center">
              Belum ada data arsip rapor pada Tahun Ajaran/Kategori ini.
            </div>
          </div>
        )}

        {/* Tab 3: Laporan */}
        {activeTab === "laporan" && (
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 space-y-4">
            <h2 className="text-sm font-bold text-slate-800 border-b pb-2">Laporan Pembayaran Masuk & Bukti Transfer</h2>
            <div className="text-xs text-slate-500 bg-slate-50 p-8 rounded-xl border border-slate-200 text-center">
              Belum ada riwayat pembayaran masuk.
            </div>
          </div>
        )}

        {/* Tab 4: Tabungan */}
        {activeTab === "tabungan" && (
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 space-y-4">
            <div className="flex justify-between items-center border-b pb-3">
              <div>
                <h2 className="text-sm font-bold text-slate-800 flex items-center gap-1">
                  💰 Kontrol & Rekapitulasi Tabungan Siswa
                </h2>
                <p className="text-xs text-slate-500">Pantau total saldo tabungan terintegrasi dari inputan Guru Kelas.</p>
              </div>
              <div className="flex gap-2">
                <select className="text-xs border border-slate-300 rounded-lg px-2 py-1">
                  <option>T.A. 2026/2027</option>
                </select>
                <select className="text-xs border border-slate-300 rounded-lg px-2 py-1">
                  <option>Semua Kelas</option>
                </select>
              </div>
            </div>

            <div className="bg-emerald-800 text-white p-4 rounded-xl flex justify-between items-center">
              <div>
                <p className="text-[10px] font-bold tracking-wider text-emerald-200 uppercase">TOTAL KAS TABUNGAN AKTIF (ALL)</p>
                <p className="text-xl font-bold mt-0.5">Rp 0</p>
              </div>
              <span className="text-2xl">🏦</span>
            </div>

            <div className="text-xs text-slate-500 bg-slate-50 p-8 rounded-xl border border-slate-200 text-center">
              Belum ada data tabungan siswa yang tercatat.
            </div>
          </div>
        )}

        {/* Tab 5: Tagihan */}
        {activeTab === "tagihan" && (
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 space-y-4">
            <h2 className="text-sm font-bold text-slate-800 border-b pb-2">Buat Tagihan Biaya Sekolah Baru</h2>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Pilih Siswa Target (Hanya Siswa Aktif)</label>
                <select className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs">
                  <option>-- Pilih Siswa Aktif --</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Jenis Tagihan</label>
                <select className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs">
                  <option>SPP Bulanan</option>
                  <option>Uang Kegiatan / Infaq</option>
                  <option>Seragam & Perlengkapan</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Nominal (Rp)</label>
                <input
                  type="text"
                  placeholder="Masukkan nominal tagihan"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Periode / Keterangan</label>
                <input
                  type="text"
                  placeholder="Contoh: Agustus 2026"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <button
                onClick={() => alert("Tagihan berhasil diterbitkan & dikirim ke WA!")}
                className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-2.5 rounded-lg text-xs transition flex items-center justify-center gap-1"
              >
                📲 Terbitkan Tagihan & Kirim ke WA Wali Murid
              </button>
            </div>
          </div>
        )}

        {/* Tab 6: Info WA */}
        {activeTab === "wa" && (
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 space-y-4">
            <h2 className="text-sm font-bold text-slate-800 border-b pb-2">Publikasi Informasi Kegiatan Sekolah</h2>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Pilih Wali Murid Penerima</label>
                <select className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs">
                  <option>-- Kirim Pesan WA Ke Wali Murid --</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Judul Kegiatan / Pengumuman</label>
                <input
                  type="text"
                  placeholder="Contoh: Pelaksanaan Manasik Haji Cilik TK 'Aisyiyah"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Detail Informasi Kegiatan</label>
                <textarea
                  rows={4}
                  placeholder="Tuliskan jadwal, pakaian, dan perlengkapan..."
                  className="w-full p-3 border border-slate-300 rounded-lg text-xs"
                ></textarea>
              </div>

              <button
                onClick={() => alert("Informasi berhasil dipublikasikan ke WA Wali Murid!")}
                className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-2.5 rounded-lg text-xs transition flex items-center justify-center gap-1"
              >
                📲 Publikasikan & Kirim Info ke WA Wali Murid
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}