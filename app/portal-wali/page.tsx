"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function PortalWali() {
  const [isWaliLoggedIn, setIsWaliLoggedIn] = useState(false);
  const [namaWaliInput, setNamaWaliInput] = useState("");
  const [noWaInput, setNoWaInput] = useState("");

  const [activeTab, setActiveTab] = useState<"kartu" | "spp" | "infaq" | "jurnal" | "tabungan" | "ppdb">("kartu");

  // State Form PPDB Online
  const [namaAnak, setNamaAnak] = useState("");
  const [nikAnak, setNikAnak] = useState("");
  const [kelasTarget, setKelasTarget] = useState("Kelas A");
  const [tempatLahir, setTempatLahir] = useState("");
  const [tanggalLahir, setTanggalLahir] = useState("");
  const [alamat, setAlamat] = useState("");
  const [namaAyah, setNamaAyah] = useState("");
  const [pekerjaanAyah, setPekerjaanAyah] = useState("");
  const [namaIbu, setNamaIbu] = useState("");
  const [pekerjaanIbu, setPekerjaanIbu] = useState("");

  // State Data Siswa Terdaftar (Diambil dari Storage)
  const [dataSiswa, setDataSiswa] = useState<any>(null);

  // State Pembayaran & ZIS
  const [jenisBiaya, setJenisBiaya] = useState("SPP Bulanan");
  const [nominalBiaya, setNominalBiaya] = useState("150000");
  const [metodeSPP, setMetodeSPP] = useState<"qris" | "transfer">("qris");
  const [sudahBayarSPP, setSudahBayarSPP] = useState(false);

  const [jenisInfaq, setJenisInfaq] = useState("Infaq");
  const [totalHartaZakat, setTotalHartaZakat] = useState("");
  const [nominalInfaq, setNominalInfaq] = useState("");
  const [metodeInfaq, setMetodeInfaq] = useState<"qris" | "transfer">("qris");
  const [sudahBayarInfaq, setSudahBayarInfaq] = useState(false);

  // Load Data Siswa & Status saat Halaman Dibuka
  useEffect(() => {
    const savedData = localStorage.getItem("ppdb_data_siswa");
    if (savedData) {
      setDataSiswa(JSON.parse(savedData));
    }
  }, []);

  const handleWaliLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (namaWaliInput && noWaInput) {
      setIsWaliLoggedIn(true);
    } else {
      alert("Harap isi Nama Wali dan Nomor WhatsApp!");
    }
  };

  const handleHartaChange = (val: string) => {
    setTotalHartaZakat(val);
    const numeric = Number(val || 0);
    if (numeric > 0) {
      setNominalInfaq(Math.round(numeric * 0.025).toString());
    } else {
      setNominalInfaq("");
    }
  };

  // Submit Form PPDB (Simpan Data Secara Realtime)
  const handlePPDBSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newStudent = {
      namaAnak,
      nikAnak,
      kelasTarget,
      tempatLahir,
      tanggalLahir,
      alamat,
      namaAyah,
      pekerjaanAyah,
      namaIbu,
      pekerjaanIbu,
      namaWali: namaWaliInput,
      waWali: noWaInput,
      status: "TERDAFTAR (Menunggu Verifikasi TU)",
      tanggalDaftar: new Date().toLocaleDateString("id-ID"),
    };

    // Simpan ke database lokal
    localStorage.setItem("ppdb_data_siswa", JSON.stringify(newStudent));
    
    // Simpan ke daftar antrean TU
    const existingTU = JSON.parse(localStorage.getItem("tu_daftar_ppdb") || "[]");
    existingTU.push(newStudent);
    localStorage.setItem("tu_daftar_ppdb", JSON.stringify(existingTU));

    setDataSiswa(newStudent);
    alert("Pendaftaran PPDB Berhasil! Data Anda telah tersimpan dan Kartu Siswa Digital telah terbit.");
    setActiveTab("kartu");
  };

  if (!isWaliLoggedIn) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
        <div className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-md border border-slate-200">
          <div className="bg-emerald-800 text-white p-4 rounded-xl text-center mb-6 space-y-2">
            <img
              src="/logo.png"
              alt="Logo 'Aisyiyah"
              className="w-12 h-12 mx-auto object-contain bg-white/10 p-1 rounded-full"
            />
            <div>
              <h1 className="font-bold text-lg">Masuk Portal Wali Murid</h1>
              <p className="text-xs text-emerald-100 mt-0.5">TK 'AISYIYAH BUSTANUL ATHFAL SADIREJO</p>
            </div>
          </div>

          <form onSubmit={handleWaliLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Nama Wali Murid / Orang Tua</label>
              <input
                type="text"
                placeholder="Masukkan Nama Lengkap Anda"
                value={namaWaliInput}
                onChange={(e) => setNamaWaliInput(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Nomor WhatsApp Aktif</label>
              <input
                type="tel"
                placeholder="Contoh: 08123456789"
                value={noWaInput}
                onChange={(e) => setNoWaInput(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-semibold py-2.5 rounded-lg text-sm transition"
            >
              Masuk Portal Wali Murid
            </button>

            <div className="text-center pt-2">
              <Link href="/" className="text-xs text-slate-500 hover:underline">
                Kembali ke Beranda
              </Link>
            </div>
          </form>
        </div>
      </div>
    );
  }

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
              <p className="text-xs text-emerald-100">Selamat Datang, <strong>{namaWaliInput}</strong> ({noWaInput})</p>
            </div>
          </div>
          <button
            onClick={() => setIsWaliLoggedIn(false)}
            className="bg-emerald-900 hover:bg-emerald-950 px-3 py-1.5 rounded-lg text-xs font-semibold text-white"
          >
            Keluar
          </button>
        </div>

        {/* Tab Navigasi */}
        <div className="bg-white p-2 rounded-2xl shadow-sm border border-slate-200 flex flex-wrap gap-1">
          <button
            onClick={() => setActiveTab("kartu")}
            className={`flex-1 min-w-[100px] py-2 text-xs font-semibold rounded-xl transition ${
              activeTab === "kartu" ? "bg-emerald-700 text-white" : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            🪪 Kartu Siswa
          </button>
          <button
            onClick={() => setActiveTab("spp")}
            className={`flex-1 min-w-[100px] py-2 text-xs font-semibold rounded-xl transition ${
              activeTab === "spp" ? "bg-emerald-700 text-white" : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            💳 Bayar SPP & Biaya
          </button>
          <button
            onClick={() => setActiveTab("infaq")}
            className={`flex-1 min-w-[100px] py-2 text-xs font-semibold rounded-xl transition ${
              activeTab === "infaq" ? "bg-emerald-700 text-white" : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            🕌 Infaq & ZIS (Lazismu)
          </button>
          <button
            onClick={() => setActiveTab("jurnal")}
            className={`flex-1 min-w-[100px] py-2 text-xs font-semibold rounded-xl transition ${
              activeTab === "jurnal" ? "bg-emerald-700 text-white" : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            📖 Jurnal Harian
          </button>
          <button
            onClick={() => setActiveTab("tabungan")}
            className={`flex-1 min-w-[100px] py-2 text-xs font-semibold rounded-xl transition ${
              activeTab === "tabungan" ? "bg-emerald-700 text-white" : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            💰 Tabungan
          </button>
          <button
            onClick={() => setActiveTab("ppdb")}
            className={`flex-1 min-w-[100px] py-2 text-xs font-semibold rounded-xl transition ${
              activeTab === "ppdb" ? "bg-emerald-700 text-white" : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            📄 PPDB Online
          </button>
        </div>

        {/* Tab 1: Kartu Siswa Digital */}
        {activeTab === "kartu" && (
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 space-y-4">
            <h2 className="text-sm font-bold text-slate-800 border-b pb-2">Kartu Siswa Digital Sekolah</h2>
            
            {!dataSiswa ? (
              <div className="bg-slate-50 border border-slate-200 p-8 rounded-2xl text-center space-y-3">
                <span className="text-3xl">🪪</span>
                <div>
                  <h3 className="font-bold text-sm text-slate-700">Belum Ada Data Siswa Terdaftar</h3>
                  <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                    Anda belum memiliki siswa yang terdaftar aktif. Silakan isi **Formulir PPDB Online** terlebih dahulu untuk mendaftarkan putra/putri Anda.
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab("ppdb")}
                  className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold px-4 py-2 rounded-xl transition"
                >
                  + Isi Form PPDB Online
                </button>
              </div>
            ) : (
              <div className="bg-gradient-to-br from-emerald-800 to-emerald-950 text-white p-5 rounded-2xl shadow-md space-y-4 border border-emerald-700">
                <div className="flex justify-between items-start border-b border-emerald-600/50 pb-3">
                  <div className="flex items-center gap-2">
                    <img src="/logo.png" alt="Logo" className="w-9 h-9 object-contain bg-white/20 p-1 rounded-full" />
                    <div>
                      <h3 className="font-bold text-xs uppercase tracking-wide">TK 'AISYIYAH BUSTANUL ATHFAL</h3>
                      <p className="text-[10px] text-emerald-200">SADIREJO - KARTU DIGITAL SISWA</p>
                    </div>
                  </div>
                  <span className="text-[10px] bg-emerald-700/80 text-emerald-100 font-bold px-2 py-0.5 rounded-full border border-emerald-500">
                    T.A. 2026/2027
                  </span>
                </div>

                <div className="flex justify-between items-center pt-1">
                  <div className="space-y-1">
                    <p className="text-[10px] text-emerald-300 font-semibold uppercase">NAMA SISWA</p>
                    <p className="text-base font-bold text-white">{dataSiswa.namaAnak}</p>
                    <p className="text-[11px] text-emerald-200 mt-1">
                      Target Kelompok: <strong>{dataSiswa.kelasTarget}</strong> | NIK: {dataSiswa.nikAnak}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-emerald-300 font-semibold uppercase mb-1">STATUS PENDAFTARAN</p>
                    <span className="bg-amber-400 text-amber-950 text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                      ⏳ {dataSiswa.status}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Bayar SPP & Biaya Sekolah */}
        {activeTab === "spp" && (
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 space-y-4">
            <h2 className="text-sm font-bold text-slate-800 border-b pb-2">Pembayaran Biaya Sekolah & SPP</h2>
            
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Pilih Jenis Biaya</label>
                <select
                  value={jenisBiaya}
                  onChange={(e) => {
                    setJenisBiaya(e.target.value);
                    if (e.target.value === "SPP Bulanan") setNominalBiaya("150000");
                    else if (e.target.value === "Biaya Pendaftaran") setNominalBiaya("300000");
                    else setNominalBiaya("100000");
                  }}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                >
                  <option value="SPP Bulanan">SPP Bulanan (Agustus 2026)</option>
                  <option value="Biaya Pendaftaran">Biaya Pendaftaran Siswa Baru</option>
                  <option value="Biaya Kegiatan Lain">Biaya Kegiatan Lain / Seragam</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Nominal Biaya (Rp)</label>
                <input
                  type="text"
                  value={nominalBiaya}
                  onChange={(e) => setNominalBiaya(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-bold text-slate-800"
                />
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs space-y-1">
                <div className="flex justify-between text-slate-600">
                  <span>Nominal Biaya</span>
                  <span>Rp {Number(nominalBiaya || 0).toLocaleString("id-ID")}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Biaya Layanan Admin</span>
                  <span>Rp 2.000</span>
                </div>
                <div className="flex justify-between font-bold text-emerald-800 border-t pt-1.5 mt-1">
                  <span>Total Tagihan Masuk</span>
                  <span>Rp {(Number(nominalBiaya || 0) + 2000).toLocaleString("id-ID")}</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Metode Pembayaran</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setMetodeSPP("qris")}
                    className={`py-2 text-xs font-semibold rounded-lg border ${
                      metodeSPP === "qris" ? "bg-emerald-50 border-emerald-600 text-emerald-800" : "border-slate-200 text-slate-600"
                    }`}
                  >
                    📱 Scan QRIS Sekolah
                  </button>
                  <button
                    type="button"
                    onClick={() => setMetodeSPP("transfer")}
                    className={`py-2 text-xs font-semibold rounded-lg border ${
                      metodeSPP === "transfer" ? "bg-emerald-50 border-emerald-600 text-emerald-800" : "border-slate-200 text-slate-600"
                    }`}
                  >
                    🏦 Transfer Bank Sekolah
                  </button>
                </div>
              </div>

              {metodeSPP === "qris" ? (
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-center space-y-2">
                  <p className="text-xs font-bold text-slate-700">QRIS RESMI TK 'AISYIYAH BUSTANUL ATHFAL</p>
                  <div className="w-40 h-40 mx-auto bg-white p-2 border border-slate-300 rounded-xl flex items-center justify-center">
                    <span className="text-xs text-slate-400 font-semibold">[ Barcode QRIS Sekolah ]</span>
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-2">
                  <p className="font-bold text-slate-700">REKENING BANK RESMI SEKOLAH:</p>
                  <div className="p-3 bg-white border border-slate-300 rounded-lg space-y-1">
                    <p className="text-slate-600">Bank: <strong>Bank Syariah Indonesia (BSI)</strong></p>
                    <p className="text-slate-600">No. Rekening: <strong className="text-emerald-700">7123-4567-89</strong></p>
                    <p className="text-slate-600">Atas Nama: <strong>TK AISYIYAH SADIREJO</strong></p>
                  </div>
                </div>
              )}

              {!sudahBayarSPP ? (
                <div className="space-y-2 pt-2 border-t">
                  <label className="block text-xs font-semibold text-slate-700">Upload Bukti Transaksi (Struk / Screenshot)</label>
                  <input type="file" accept="image/*" className="w-full text-xs p-2 border border-slate-300 rounded-lg" />
                  <button
                    onClick={() => setSudahBayarSPP(true)}
                    className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-semibold py-2.5 rounded-lg text-xs transition"
                  >
                    Konfirmasi & Kirim Pembayaran
                  </button>
                </div>
              ) : (
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl space-y-2">
                  <p className="text-xs font-bold text-emerald-900">✓ Pembayaran Berhasil Dikirim ke Tata Usaha (TU)!</p>
                  <p className="text-xs text-emerald-800">
                    <em>"Pembayaran SPP bulan Agustus 2026 sudah diterima. Jazakumullah Khairan"</em>
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 3: Infaq & ZIS */}
        {activeTab === "infaq" && (
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 space-y-4">
            <div className="flex justify-between items-center border-b pb-2">
              <h2 className="text-sm font-bold text-slate-800">Layanan Infaq, Sadaqah & Zakat (Lazismu)</h2>
              <span className="bg-orange-100 text-orange-800 border border-orange-300 font-bold text-[10px] px-2.5 py-0.5 rounded-full flex items-center gap-1">
                🧡 Mitra Resmi Lazismu
              </span>
            </div>

            <div className="bg-orange-50 border border-orange-200 p-3 rounded-xl text-xs text-orange-950 flex items-start gap-2">
              <span className="text-base">🤝</span>
              <p>
                Seluruh dana Infaq, Sadaqah, & Zakat yang ditunaikan di aplikasi ini disalurkan <strong>langsung ke Rekening / QRIS Resmi LAZISMU (Lembaga Amil Zakat Muhammadiyah)</strong>.
              </p>
            </div>
            
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Pilih Jenis Penyaluran ZIS</label>
                <select
                  value={jenisInfaq}
                  onChange={(e) => {
                    setJenisInfaq(e.target.value);
                    setNominalInfaq("");
                    setTotalHartaZakat("");
                  }}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                >
                  <option value="Infaq">Infaq</option>
                  <option value="Sadaqah">Sadaqah</option>
                  <option value="Zakat Fitri">Zakat Fitri</option>
                  <option value="Zakat Maal">Zakat Maal (2.5% dari Harta)</option>
                </select>
              </div>

              {jenisInfaq === "Zakat Maal" && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Total Nilai Harta / Tabungan (Rp)</label>
                  <input
                    type="number"
                    placeholder="Contoh: 100000000"
                    value={totalHartaZakat}
                    onChange={(e) => handleHartaChange(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nominal {jenisInfaq} (Rp)
                </label>
                <input
                  type="number"
                  placeholder="Masukkan nominal"
                  value={nominalInfaq}
                  onChange={(e) => setNominalInfaq(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-bold text-slate-800"
                />
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs space-y-1">
                <div className="flex justify-between text-slate-600">
                  <span>Nominal {jenisInfaq}</span>
                  <span>Rp {Number(nominalInfaq || 0).toLocaleString("id-ID")}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Biaya Layanan Admin</span>
                  <span>Rp 500</span>
                </div>
                <div className="flex justify-between font-bold text-emerald-800 border-t pt-1.5 mt-1">
                  <span>Total Penyaluran</span>
                  <span>Rp {(Number(nominalInfaq || 0) + 500).toLocaleString("id-ID")}</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Pilih Metode Pembayaran Lazismu</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setMetodeInfaq("qris")}
                    className={`py-2 text-xs font-semibold rounded-lg border ${
                      metodeInfaq === "qris" ? "bg-emerald-50 border-emerald-600 text-emerald-800" : "border-slate-200 text-slate-600"
                    }`}
                  >
                    📱 Scan QRIS Lazismu
                  </button>
                  <button
                    type="button"
                    onClick={() => setMetodeInfaq("transfer")}
                    className={`py-2 text-xs font-semibold rounded-lg border ${
                      metodeInfaq === "transfer" ? "bg-emerald-50 border-emerald-600 text-emerald-800" : "border-slate-200 text-slate-600"
                    }`}
                  >
                    🏦 Transfer Rekening Lazismu
                  </button>
                </div>
              </div>

              {metodeInfaq === "qris" ? (
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-center space-y-2">
                  <p className="text-xs font-bold text-orange-800">QRIS NATIONAL RESMI LAZISMU</p>
                  <div className="w-40 h-40 mx-auto bg-white p-2 border border-slate-300 rounded-xl flex items-center justify-center">
                    <span className="text-xs text-slate-400 font-semibold">[ Barcode QRIS Lazismu ]</span>
                  </div>
                </div>
              ) : (
                <div className="p-3 bg-white border border-slate-300 rounded-lg text-xs space-y-1">
                  <p className="text-slate-600">Bank: <strong>Bank Syariah Indonesia (BSI)</strong></p>
                  <p className="text-slate-600">No. Rekening: <strong className="text-emerald-700">777-1234-567</strong></p>
                  <p className="text-slate-600">Atas Nama: <strong>LAZISMU KANTOR LAYANAN</strong></p>
                </div>
              )}

              {!sudahBayarInfaq ? (
                <div className="space-y-2 pt-2 border-t">
                  <label className="block text-xs font-semibold text-slate-700">Upload Bukti Transfer / Transaksi Lazismu</label>
                  <input type="file" accept="image/*" className="w-full text-xs p-2 border border-slate-300 rounded-lg" />
                  <button
                    onClick={() => setSudahBayarInfaq(true)}
                    className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-semibold py-2.5 rounded-lg text-xs transition"
                  >
                    Tunaikan {jenisInfaq} ke Lazismu
                  </button>
                </div>
              ) : (
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 space-y-1">
                  <p className="font-bold">✓ Penyaluran {jenisInfaq} Berhasil Ditunaikan!</p>
                  <p className="text-[11px] text-emerald-800 italic">
                    Jazakumullah Khairan atas kedermawanan Bapak/Ibu.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 4: Jurnal Harian */}
        {activeTab === "jurnal" && (
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 space-y-3">
            <h2 className="text-sm font-bold text-slate-800 border-b pb-2">Catatan Perkembangan & Aktivitas Harian</h2>
            <div className="text-xs text-slate-500 bg-slate-50 p-6 rounded-xl border border-slate-200 text-center">
              Belum ada catatan jurnal harian dari Guru Kelas untuk hari ini.
            </div>
          </div>
        )}

        {/* Tab 5: Tabungan Siswa */}
        {activeTab === "tabungan" && (
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 space-y-4">
            <h2 className="text-sm font-bold text-slate-800 border-b pb-2">Saldo & Mutasi Tabungan Siswa</h2>
            <div className="bg-emerald-800 text-white p-4 rounded-xl flex justify-between items-center">
              <div>
                <p className="text-[10px] font-bold tracking-wider text-emerald-200 uppercase">TOTAL SALDO TABUNGAN</p>
                <p className="text-xl font-bold mt-0.5">Rp 0</p>
              </div>
              <span className="text-2xl">💰</span>
            </div>
            <div className="text-xs text-slate-500 bg-slate-50 p-6 rounded-xl border border-slate-200 text-center">
              Belum ada riwayat mutasi tabungan tercatat.
            </div>
          </div>
        )}

        {/* Tab 6: Form PPDB Online */}
        {activeTab === "ppdb" && (
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 space-y-4">
            <h2 className="text-sm font-bold text-slate-800 border-b pb-2">Formulir Pendaftaran Siswa Baru (PPDB Online)</h2>
            <form onSubmit={handlePPDBSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Nama Lengkap Calon Siswa</label>
                <input
                  type="text"
                  placeholder="Masukkan nama lengkap anak"
                  value={namaAnak}
                  onChange={(e) => setNamaAnak(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">NIK Anak (Sesuai Kartu Keluarga)</label>
                <input
                  type="number"
                  placeholder="16 digit NIK Anak"
                  value={nikAnak}
                  onChange={(e) => setNikAnak(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Pilihan Kelas Target</label>
                <select
                  value={kelasTarget}
                  onChange={(e) => setKelasTarget(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                  required
                >
                  <option value="Kelas A">Kelas A (Usia 4 - 5 Tahun)</option>
                  <option value="Kelas B">Kelas B (Usia 5 - 6 Tahun)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Tempat Lahir</label>
                  <input
                    type="text"
                    placeholder="Contoh: Sadirejo / Medan"
                    value={tempatLahir}
                    onChange={(e) => setTempatLahir(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Tanggal Lahir</label>
                  <input
                    type="date"
                    value={tanggalLahir}
                    onChange={(e) => setTanggalLahir(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Alamat Lengkap Domisili</label>
                <textarea
                  rows={2}
                  placeholder="Jalan, Desa/Kelurahan, RT/RW..."
                  value={alamat}
                  onChange={(e) => setAlamat(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                  required
                ></textarea>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Nama Ayah Kandung</label>
                  <input
                    type="text"
                    placeholder="Nama lengkap ayah"
                    value={namaAyah}
                    onChange={(e) => setNamaAyah(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Pekerjaan Ayah</label>
                  <input
                    type="text"
                    placeholder="Pekerjaan ayah"
                    value={pekerjaanAyah}
                    onChange={(e) => setPekerjaanAyah(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Nama Ibu Kandung</label>
                  <input
                    type="text"
                    placeholder="Nama lengkap ibu"
                    value={namaIbu}
                    onChange={(e) => setNamaIbu(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Pekerjaan Ibu</label>
                  <input
                    type="text"
                    placeholder="Pekerjaan ibu"
                    value={pekerjaanIbu}
                    onChange={(e) => setPekerjaanIbu(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-semibold py-2.5 rounded-lg text-xs transition"
              >
                Kirim Formulir Pendaftaran PPDB
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}