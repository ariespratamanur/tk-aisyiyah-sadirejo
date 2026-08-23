"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function PortalTU() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [nbm, setNbm] = useState("");
  const [password, setPassword] = useState("");
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [activeTab, setActiveTab] = useState<"ppdb" | "rapor" | "laporan" | "tabungan" | "tagihan" | "wa">("ppdb");

  // State Data PPDB Masuk (Realtime)
  const [daftarPPDB, setDaftarPPDB] = useState<any[]>([]);

  useEffect(() => {
    const savedPPDB = localStorage.getItem("tu_daftar_ppdb");
    if (savedPPDB) {
      setDaftarPPDB(JSON.parse(savedPPDB));
    }
  }, []);

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
        {/* Header Portal TU */}
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

        {/* Navigasi Tab */}
        <div className="bg-white p-2 rounded-2xl shadow-sm border border-slate-200 flex flex-wrap justify-between gap-1">
          <button
            onClick={() => setActiveTab("ppdb")}
            className={`flex-1 py-2 rounded-xl text-xs font-semibold ${
              activeTab === "ppdb" ? "bg-orange-600 text-white" : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            📄 PPDB ({daftarPPDB.length})
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

        {/* Tab 1: PPDB (Menampilkan Data Pendaftar Realtime) */}
        {activeTab === "ppdb" && (
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 space-y-4">
            <div className="flex justify-between items-center border-b pb-3">
              <h2 className="text-sm font-bold text-slate-800">Verifikasi Pendaftaran PPDB Masuk</h2>
              <span className="text-xs bg-orange-100 text-orange-800 px-2.5 py-1 rounded-lg font-bold">
                Total Pendaftar: {daftarPPDB.length}
              </span>
            </div>

            {daftarPPDB.length === 0 ? (
              <div className="text-xs text-slate-500 bg-slate-50 p-8 rounded-xl border border-slate-200 text-center">
                Belum ada data pendaftar baru PPDB.
              </div>
            ) : (
              <div className="space-y-3">
                {daftarPPDB.map((siswa, i) => (
                  <div key={i} className="p-4 border border-slate-200 rounded-xl space-y-2 bg-slate-50">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="text-xs font-bold text-slate-800 text-base">
                          {siswa.namaAnak} <span className="text-slate-500 text-xs font-normal">({siswa.kelasTarget})</span>
                        </h4>
                        <p className="text-xs text-slate-600 mt-0.5">
                          NIK: <strong>{siswa.nikAnak}</strong> | TTL: {siswa.tempatLahir}, {siswa.tanggalLahir}
                        </p>
                        <p className="text-xs text-slate-600">Alamat: {siswa.alamat}</p>
                        <p className="text-xs text-slate-600">
                          Orang Tua: Ayah ({siswa.namaAyah} - {siswa.pekerjaanAyah}) | Ibu ({siswa.namaIbu} - {siswa.pekerjaanIbu})
                        </p>
                        <p className="text-xs text-slate-500 mt-1">
                          Wali Pendaftar: <strong>{siswa.namaWali}</strong> (WA: {siswa.waWali})
                        </p>
                      </div>
                      <span className="bg-amber-100 text-amber-800 font-bold text-[10px] px-2.5 py-0.5 rounded-full uppercase">
                        {siswa.status}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-1.5 pt-2 border-t border-slate-200">
                      <button
                        onClick={() => alert(`Siswa ${siswa.namaAnak} berhasil Diset DITERIMA!`)}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg"
                      >
                        ✓ Set Diterima
                      </button>
                      <button
                        onClick={() => alert(`Siswa ${siswa.namaAnak} Diset PINDAH!`)}
                        className="bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg"
                      >
                        ✕ Set Pindah
                      </button>
                      <button
                        onClick={() => alert(`Cetak formulir pendaftaran untuk ${siswa.namaAnak}`)}
                        className="bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg"
                      >
                        📥 Download Formulir PDF
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab Lainnya */}
        {activeTab !== "ppdb" && (
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 text-xs text-slate-500 text-center py-8">
            Fitur dalam pengelolaan Portal TU.
          </div>
        )}
      </div>
    </div>
  );
}