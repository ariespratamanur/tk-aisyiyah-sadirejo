"use client";

import { useState } from "react";
import Link from "next/link";

export default function PortalTU() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [nbm, setNbm] = useState("");
  const [password, setPassword] = useState("");
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [activeTab, setActiveTab] = useState<"ppdb" | "rapor" | "laporan" | "tabungan" | "tagihan" | "wa">("rapor");

  // State Tabungan
  const [jenisTransaksi, setJenisTransaksi] = useState<"setor" | "tarik">("setor");
  const [nominalTabungan, setNominalTabungan] = useState("");

  // State Tagihan
  const [namaSiswa, setNamaSiswa] = useState("");
  const [nominalTagihan, setNominalTagihan] = useState("");

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
          <div className="bg-orange-600 text-white p-4 rounded-xl text-center mb-6">
            <h1 className="font-bold text-lg">Login Portal Tata Usaha (TU)</h1>
            <p className="text-xs text-orange-100 mt-1">TK 'AISYIYAH BUSTANUL ATHFAL SADIREJO</p>
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
        {/* Header Portal TU */}
        <div className="bg-orange-600 text-white p-4 rounded-2xl shadow-sm flex justify-between items-center">
          <div>
            <h1 className="font-bold text-base">Portal Tata Usaha (TU)</h1>
            <p className="text-xs text-orange-100">TK 'AISYIYAH BUSTANUL ATHFAL SADIREJO</p>
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

        {/* Modal Pop-up Ubah Password saat berada di dalam Dashboard */}
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
        <div className="bg-white p-2 rounded-2xl shadow-sm border border-slate-200 flex flex-wrap gap-1">
          <button
            onClick={() => setActiveTab("ppdb")}
            className={`px-3 py-2 rounded-xl text-xs font-semibold ${
              activeTab === "ppdb" ? "bg-orange-600 text-white" : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            📄 PPDB
          </button>
          <button
            onClick={() => setActiveTab("rapor")}
            className={`px-3 py-2 rounded-xl text-xs font-semibold ${
              activeTab === "rapor" ? "bg-orange-600 text-white" : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            📁 e-Rapor PAUD
          </button>
          <button
            onClick={() => setActiveTab("laporan")}
            className={`px-3 py-2 rounded-xl text-xs font-semibold ${
              activeTab === "laporan" ? "bg-orange-600 text-white" : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            📊 Laporan
          </button>
          <button
            onClick={() => setActiveTab("tabungan")}
            className={`px-3 py-2 rounded-xl text-xs font-semibold ${
              activeTab === "tabungan" ? "bg-orange-600 text-white" : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            💰 Tabungan
          </button>
          <button
            onClick={() => setActiveTab("tagihan")}
            className={`px-3 py-2 rounded-xl text-xs font-semibold ${
              activeTab === "tagihan" ? "bg-orange-600 text-white" : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            💳 Tagihan
          </button>
          <button
            onClick={() => setActiveTab("wa")}
            className={`px-3 py-2 rounded-xl text-xs font-semibold ${
              activeTab === "wa" ? "bg-orange-600 text-white" : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            📢 Info WA
          </button>
        </div>

        {/* Tab 1: PPDB */}
        {activeTab === "ppdb" && (
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 space-y-4">
            <h2 className="text-sm font-bold text-slate-800 border-b pb-2">Verifikasi Pendaftaran PPDB Online</h2>
            <div className="text-xs text-slate-500 bg-slate-50 p-6 rounded-xl border border-slate-200 text-center">
              Belum ada data pendaftar baru PPDB.
            </div>
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
            <h2 className="text-sm font-bold text-slate-800 border-b pb-2">Laporan Keuangan & Rekapitulasi</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="p-4 bg-orange-50 border border-orange-200 rounded-xl">
                <p className="text-xs text-orange-800 font-semibold">Total Pemasukan Tagihan/SPP</p>
                <p className="text-lg font-bold text-orange-900 mt-1">Rp 0</p>
              </div>
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
                <p className="text-xs text-emerald-800 font-semibold">Total Saldo Tabungan Siswa</p>
                <p className="text-lg font-bold text-emerald-900 mt-1">Rp 0</p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Tabungan */}
        {activeTab === "tabungan" && (
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 space-y-4">
            <h2 className="text-sm font-bold text-slate-800 border-b pb-2">Kelola Tabungan Siswa (Tata Usaha)</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Pilih Siswa</label>
                <select className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm">
                  <option>-- Pilih Siswa --</option>
                </select>
              </div>
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
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Nominal Transaksi (Rp)</label>
              <input
                type="number"
                placeholder="Masukkan nominal"
                value={nominalTabungan}
                onChange={(e) => setNominalTabungan(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
              />
            </div>
            <button
              onClick={() => {
                if (!nominalTabungan) return alert("Masukkan nominal transaksi!");
                alert("Transaksi tabungan berhasil diproses oleh TU!");
                setNominalTabungan("");
              }}
              className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-2.5 rounded-lg text-xs transition"
            >
              Proses Transaksi Tabungan
            </button>
          </div>
        )}

        {/* Tab 5: Tagihan */}
        {activeTab === "tagihan" && (
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 space-y-4">
            <h2 className="text-sm font-bold text-slate-800 border-b pb-2">Kelola Tagihan & SPP Siswa</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Nama Siswa</label>
                <input
                  type="text"
                  placeholder="Masukkan Nama Siswa"
                  value={namaSiswa}
                  onChange={(e) => setNamaSiswa(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Nominal Tagihan (Rp)</label>
                <input
                  type="number"
                  placeholder="Contoh: 150000"
                  value={nominalTagihan}
                  onChange={(e) => setNominalTagihan(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                />
              </div>
            </div>
            <button
              onClick={() => {
                if (!namaSiswa || !nominalTagihan) return alert("Lengkapi data tagihan!");
                alert("Tagihan berhasil ditambahkan!");
                setNamaSiswa("");
                setNominalTagihan("");
              }}
              className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-2.5 rounded-lg text-xs transition"
            >
              Buat Tagihan Baru
            </button>
          </div>
        )}

        {/* Tab 6: Info WA */}
        {activeTab === "wa" && (
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 space-y-4">
            <h2 className="text-sm font-bold text-slate-800 border-b pb-2">Kirim Pengumuman / Info via WhatsApp</h2>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Pesan Pengumuman</label>
              <textarea
                rows={4}
                placeholder="Tuliskan pesan pengumuman untuk wali murid..."
                className="w-full p-3 border border-slate-300 rounded-lg text-sm"
              ></textarea>
            </div>
            <button
              onClick={() => alert("Fitur siaran pesan WhatsApp siap dikirim!")}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2.5 rounded-lg text-xs transition flex items-center justify-center gap-2"
            >
              Kirim Pesan Pengumuman WhatsApp
            </button>
          </div>
        )}
      </div>
    </div>
  );
}