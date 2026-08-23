"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function PortalWali() {
  const [isWaliLoggedIn, setIsWaliLoggedIn] = useState(false);
  const [namaWaliInput, setNamaWaliInput] = useState("");
  const [noWaInput, setNoWaInput] = useState("");

  const [activeTab, setActiveTab] = useState<
    "kartu" | "spp" | "infaq" | "jurnal" | "tabungan" | "rapor" | "ppdb" | "belajar"
  >("kartu");

  const [dataSiswa, setDataSiswa] = useState<any>(null);
  const [jurnalSiswa, setJurnalSiswa] = useState<any[]>([]);
  const [tabunganSiswa, setTabunganSiswa] = useState<any[]>([]);
  const [raporUrl, setRaporUrl] = useState<string | null>(null);
  const [kuitansiList, setKuitansiList] = useState<any[]>([]);

  // Form PPDB
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

  // Bayar Biaya
  const [jenisBiaya, setJenisBiaya] = useState("SPP Bulanan");
  const [nominalBiaya, setNominalBiaya] = useState("150000");
  const [metodeSPP, setMetodeSPP] = useState<"qris" | "transfer">("qris");
  const [buktiFile, setBuktiFile] = useState<string | null>(null);
  const [statusBayarSPP, setStatusBayarSPP] = useState<"idle" | "pending" | "verified">("idle");

  // Infaq Sukarela Lazismu
  const [jenisInfaq, setJenisInfaq] = useState("Infaq Sukarela");
  const [nominalInfaq, setNominalInfaq] = useState("");
  const [metodeInfaq, setMetodeInfaq] = useState<"qris" | "transfer">("qris");
  const [sudahBayarInfaq, setSudahBayarInfaq] = useState(false);

  useEffect(() => {
    const savedNamaWali = localStorage.getItem("wali_nama");
    const savedWaWali = localStorage.getItem("wali_wa");
    if (savedNamaWali && savedWaWali) {
      setNamaWaliInput(savedNamaWali);
      setNoWaInput(savedWaWali);
      setIsWaliLoggedIn(true);
    }
  }, []);

  const syncData = () => {
    const savedStudent = localStorage.getItem("ppdb_data_siswa");
    if (savedStudent) setDataSiswa(JSON.parse(savedStudent));

    const savedJurnal = localStorage.getItem("integrated_jurnal");
    if (savedJurnal) setJurnalSiswa(JSON.parse(savedJurnal));

    const savedTabungan = localStorage.getItem("integrated_tabungan");
    if (savedTabungan) setTabunganSiswa(JSON.parse(savedTabungan));

    const savedRapor = localStorage.getItem("integrated_rapor");
    if (savedRapor) setRaporUrl(savedRapor);

    const savedKuitansi = localStorage.getItem("integrated_kuitansi");
    if (savedKuitansi) setKuitansiList(JSON.parse(savedKuitansi));
  };

  useEffect(() => {
    syncData();
    const interval = setInterval(syncData, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleWaliLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (namaWaliInput && noWaInput) {
      localStorage.setItem("wali_nama", namaWaliInput);
      localStorage.setItem("wali_wa", noWaInput);
      setIsWaliLoggedIn(true);
    } else {
      alert("Harap isi Nama Wali dan Nomor WhatsApp terlebih dahulu!");
    }
  };

  const handleWaliLogout = () => {
    localStorage.removeItem("wali_nama");
    localStorage.removeItem("wali_wa");
    setIsWaliLoggedIn(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setBuktiFile(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handlePPDBSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const taAktif = localStorage.getItem("selected_ta") || "2026/2027";
    const newStudent = {
      id: Date.now(),
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
      status: "TERDAFTAR (Menunggu Pembayaran / Verifikasi TU)",
      persentaseBayar: 0,
      tanggalDaftar: new Date().toLocaleDateString("id-ID"),
      tahunAjaran: taAktif,
    };

    localStorage.setItem("ppdb_data_siswa", JSON.stringify(newStudent));
    const existingTU = JSON.parse(localStorage.getItem("tu_daftar_ppdb") || "[]");
    existingTU.unshift(newStudent);
    localStorage.setItem("tu_daftar_ppdb", JSON.stringify(existingTU));

    setDataSiswa(newStudent);
    alert("Formulir PPDB berhasil dikirim ke Portal TU!");
    setActiveTab("kartu");
  };

  const handleConfirmPembayaran = () => {
    if (!buktiFile) return alert("Harap unggah foto bukti pembayaran terlebih dahulu!");

    const taAktif = localStorage.getItem("selected_ta") || "2026/2027";
    const totalMasuk = Number(nominalBiaya) + 2000;
    const newPendingBayar = {
      id: Date.now(),
      jenis: jenisBiaya,
      nominal: totalMasuk,
      tanggal: new Date().toLocaleDateString("id-ID"),
      wali: namaWaliInput,
      namaAnak: dataSiswa?.namaAnak || "Calon Siswa",
      buktiUrl: buktiFile,
      status: "pending",
      tahunAjaran: taAktif,
    };

    const existingPending = JSON.parse(localStorage.getItem("tu_daftar_pembayaran") || "[]");
    existingPending.unshift(newPendingBayar);
    localStorage.setItem("tu_daftar_pembayaran", JSON.stringify(existingPending));

    setStatusBayarSPP("pending");
    alert("Bukti pembayaran berhasil dikirim ke Portal TU untuk diverifikasi!");
  };

  const hitungTotalSaldo = () => {
    return tabunganSiswa.reduce((acc, curr) => (curr.jenis === "setor" ? acc + Number(curr.nominal) : acc - Number(curr.nominal)), 0);
  };

  if (!isWaliLoggedIn) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
        <div className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-md border border-slate-200">
          <div className="bg-emerald-800 text-white p-4 rounded-xl text-center mb-6 space-y-2">
            <img src="/logo.png" alt="Logo" className="w-12 h-12 mx-auto object-contain bg-white/10 p-1 rounded-full" />
            <div>
              <h1 className="font-bold text-lg">Masuk Portal Wali Murid</h1>
              <p className="text-xs text-emerald-100">TK 'AISYIYAH BUSTANUL ATHFAL SADIREJO</p>
            </div>
          </div>
          <form onSubmit={handleWaliLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Nama Wali Murid / Orang Tua *</label>
              <input type="text" placeholder="Masukkan Nama Lengkap Anda" value={namaWaliInput} onChange={(e) => setNamaWaliInput(e.target.value)} className="w-full px-3 py-2 border rounded-lg text-xs" required />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Nomor WhatsApp Aktif *</label>
              <input type="tel" placeholder="Contoh: 08123456789" value={noWaInput} onChange={(e) => setNoWaInput(e.target.value)} className="w-full px-3 py-2 border rounded-lg text-xs" required />
            </div>
            <button type="submit" className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-semibold py-2.5 rounded-lg text-xs">Masuk Portal Wali Murid</button>
            <div className="text-center pt-2"><Link href="/" className="text-xs text-slate-500 hover:underline">Kembali ke Beranda</Link></div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 p-4">
      <div className="max-w-3xl mx-auto space-y-4">
        {/* Header */}
        <div className="bg-emerald-800 text-white p-4 rounded-2xl shadow-sm flex justify-between items-center">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="Logo" className="w-10 h-10 object-contain bg-white/10 p-1 rounded-full" />
            <div>
              <h1 className="font-bold text-base">Portal Wali Murid</h1>
              <p className="text-xs text-emerald-100">Selamat Datang, <strong>{namaWaliInput}</strong> ({noWaInput})</p>
            </div>
          </div>
          <button onClick={handleWaliLogout} className="bg-emerald-900 hover:bg-emerald-950 px-3 py-1.5 rounded-lg text-xs font-semibold">Keluar</button>
        </div>

        {/* Tab Navigasi Termasuk Fitur Belajar Online */}
        <div className="bg-white p-2 rounded-2xl shadow-sm border flex flex-wrap gap-1">
          <button onClick={() => setActiveTab("kartu")} className={`flex-1 min-w-[80px] py-2 text-xs font-semibold rounded-xl ${activeTab === "kartu" ? "bg-emerald-700 text-white" : "text-slate-600 hover:bg-slate-50"}`}>🪪 Kartu</button>
          <button onClick={() => setActiveTab("belajar")} className={`flex-1 min-w-[80px] py-2 text-xs font-semibold rounded-xl ${activeTab === "belajar" ? "bg-emerald-700 text-white" : "text-slate-600 hover:bg-slate-50"}`}>📖 Belajar</button>
          <button onClick={() => setActiveTab("spp")} className={`flex-1 min-w-[80px] py-2 text-xs font-semibold rounded-xl ${activeTab === "spp" ? "bg-emerald-700 text-white" : "text-slate-600 hover:bg-slate-50"}`}>💳 Bayar</button>
          <button onClick={() => setActiveTab("infaq")} className={`flex-1 min-w-[80px] py-2 text-xs font-semibold rounded-xl ${activeTab === "infaq" ? "bg-emerald-700 text-white" : "text-slate-600 hover:bg-slate-50"}`}>🕌 Infaq</button>
          <button onClick={() => setActiveTab("jurnal")} className={`flex-1 min-w-[80px] py-2 text-xs font-semibold rounded-xl ${activeTab === "jurnal" ? "bg-emerald-700 text-white" : "text-slate-600 hover:bg-slate-50"}`}>📖 Jurnal</button>
          <button onClick={() => setActiveTab("tabungan")} className={`flex-1 min-w-[80px] py-2 text-xs font-semibold rounded-xl ${activeTab === "tabungan" ? "bg-emerald-700 text-white" : "text-slate-600 hover:bg-slate-50"}`}>💰 Tabungan</button>
          <button onClick={() => setActiveTab("rapor")} className={`flex-1 min-w-[80px] py-2 text-xs font-semibold rounded-xl ${activeTab === "rapor" ? "bg-emerald-700 text-white" : "text-slate-600 hover:bg-slate-50"}`}>📁 e-Rapor</button>
          <button onClick={() => setActiveTab("ppdb")} className={`flex-1 min-w-[80px] py-2 text-xs font-semibold rounded-xl ${activeTab === "ppdb" ? "bg-emerald-700 text-white" : "text-slate-600 hover:bg-slate-50"}`}>📄 PPDB</button>
        </div>

        {/* Tab 1: Kartu Siswa */}
        {activeTab === "kartu" && (
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 space-y-4">
            <h2 className="text-sm font-bold text-slate-800 border-b pb-2">Kartu Siswa Digital & Status PPDB</h2>
            {!dataSiswa ? (
              <div className="bg-slate-50 border p-8 rounded-2xl text-center space-y-3">
                <span className="text-3xl">🪪</span>
                <h3 className="font-bold text-sm text-slate-700">Belum Ada Data Siswa Terdaftar</h3>
                <button onClick={() => setActiveTab("ppdb")} className="bg-emerald-700 text-white text-xs font-bold px-4 py-2 rounded-xl">+ Isi Form PPDB Online</button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-gradient-to-br from-emerald-800 to-emerald-950 text-white p-5 rounded-2xl shadow-md space-y-4 border border-emerald-700">
                  <div className="flex justify-between items-start border-b border-emerald-600/50 pb-3">
                    <div className="flex items-center gap-2">
                      <img src="/logo.png" alt="Logo" className="w-9 h-9 object-contain bg-white/20 p-1 rounded-full" />
                      <div>
                        <h3 className="font-bold text-xs uppercase">TK 'AISYIYAH BUSTANUL ATHFAL</h3>
                        <p className="text-[10px] text-emerald-200">SADIREJO - KARTU DIGITAL SISWA</p>
                      </div>
                    </div>
                    <span className="text-[10px] bg-emerald-700 text-emerald-100 font-bold px-2 py-0.5 rounded-full border border-emerald-500">T.A. {dataSiswa.tahunAjaran || "2026/2027"}</span>
                  </div>

                  <div className="flex justify-between items-center pt-1">
                    <div>
                      <p className="text-[10px] text-emerald-300 font-semibold uppercase">NAMA SISWA</p>
                      <p className="text-base font-bold text-white">{dataSiswa.namaAnak}</p>
                      <p className="text-[11px] text-emerald-200 mt-1">Target Kelompok: <strong>{dataSiswa.kelasTarget}</strong> | NIK: {dataSiswa.nikAnak}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] text-emerald-300 font-semibold uppercase mb-1">STATUS AKADEMIK</p>
                      <span className="bg-emerald-400 text-emerald-950 text-xs font-bold px-3 py-1 rounded-full shadow-sm">{dataSiswa.status}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl text-xs space-y-2 text-amber-950">
                  <p className="font-bold">📌 Aturan Skema Pembayaran Biaya Pendaftaran:</p>
                  <ul className="list-disc list-inside space-y-1 text-[11px] text-amber-900">
                    <li>Dapat dicicil 2 kali (DP 50% & Pelunasan 50%).</li>
                    <li><strong>DP 50%:</strong> Maksimal 5 hari kerja dari form pendaftaran diterima (Status: DITERIMA).</li>
                    <li><strong>Pelunasan (50% Sisanya):</strong> Wajib dilunasi maksimal 1 minggu sebelum anak masuk sekolah (Status: AKTIF).</li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Fitur Belajar Online (COMING SOON) */}
        {activeTab === "belajar" && (
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-4 text-center">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center mx-auto text-3xl font-bold">
              🚀
            </div>
            <div className="space-y-1">
              <span className="bg-amber-100 text-amber-800 font-bold text-[10px] px-3 py-1 rounded-full uppercase tracking-wider">
                Pengembangan Modul
              </span>
              <h2 className="text-lg font-bold text-slate-800 pt-2">Fitur Belajar Online (E-Learning)</h2>
              <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
                Materi pembelajaran interaktif, video, dan tugas harian dari <strong>Tim PT</strong> sedang disiapkan dan akan segera diunggah di modul ini.
              </p>
            </div>

            <div className="p-4 bg-slate-50 border border-dashed border-slate-300 rounded-2xl text-xs text-slate-400 font-semibold">
              ✨ STATUS: COMING SOON / SEGERA HADIR ✨
            </div>
          </div>
        )}

        {/* Tab 3: Bayar Biaya & Upload Bukti */}
        {activeTab === "spp" && (
          <div className="bg-white p-5 rounded-2xl shadow-sm border space-y-4">
            <h2 className="text-sm font-bold text-slate-800 border-b pb-2">Pembayaran Biaya Sekolah & Upload Bukti Bayar</h2>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Pilih Jenis Biaya</label>
                <select value={jenisBiaya} onChange={(e) => {
                  setJenisBiaya(e.target.value);
                  if (e.target.value === "SPP Bulanan") setNominalBiaya("150000");
                  else if (e.target.value === "Biaya Pendaftaran DP 50%") setNominalBiaya("150000");
                  else if (e.target.value === "Pelunasan Pendaftaran 100%") setNominalBiaya("150000");
                  else setNominalBiaya("100000");
                }} className="w-full px-3 py-2 border rounded-lg text-xs">
                  <option value="SPP Bulanan">SPP Bulanan (Agustus 2026)</option>
                  <option value="Biaya Pendaftaran DP 50%">Biaya Pendaftaran (DP 50%)</option>
                  <option value="Pelunasan Pendaftaran 100%">Biaya Pendaftaran (Pelunasan 100%)</option>
                  <option value="Biaya Kegiatan Sekolah">Biaya Kegiatan Sekolah / Seragam</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Nominal Biaya (Rp)</label>
                <input type="text" value={nominalBiaya} onChange={(e) => setNominalBiaya(e.target.value)} className="w-full px-3 py-2 border rounded-lg text-xs font-bold" />
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border text-xs space-y-1">
                <div className="flex justify-between"><span>Nominal Biaya</span><span>Rp {Number(nominalBiaya || 0).toLocaleString("id-ID")}</span></div>
                <div className="flex justify-between"><span>Biaya Layanan Admin</span><span>Rp 2.000</span></div>
                <div className="flex justify-between font-bold text-emerald-800 border-t pt-1"><span>Total Transfer</span><span>Rp {(Number(nominalBiaya || 0) + 2000).toLocaleString("id-ID")}</span></div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button type="button" onClick={() => setMetodeSPP("qris")} className={`py-2 text-xs font-semibold rounded-lg border ${metodeSPP === "qris" ? "bg-emerald-50 border-emerald-600 text-emerald-800" : "border-slate-200"}`}>📱 Scan QRIS Sekolah</button>
                <button type="button" onClick={() => setMetodeSPP("transfer")} className={`py-2 text-xs font-semibold rounded-lg border ${metodeSPP === "transfer" ? "bg-emerald-50 border-emerald-600 text-emerald-800" : "border-slate-200"}`}>🏦 Transfer Bank BSI</button>
              </div>

              {metodeSPP === "qris" ? (
                <div className="p-4 bg-slate-50 border rounded-xl text-center space-y-2">
                  <p className="text-xs font-bold text-slate-700">QRIS RESMI SEKOLAH TK 'AISYIYAH SADIREJO</p>
                  <div className="w-36 h-36 mx-auto bg-white p-2 border rounded-xl flex items-center justify-center">
                    <span className="text-xs text-slate-400 font-semibold">[ Barcode QRIS Sekolah ]</span>
                  </div>
                </div>
              ) : (
                <div className="p-3 bg-slate-50 border rounded-xl text-xs space-y-1">
                  <p className="text-slate-600">Bank Tujuan: <strong>Bank Syariah Indonesia (BSI)</strong></p>
                  <p className="text-slate-600">No. Rekening: <strong className="text-emerald-700">7123-4567-89</strong></p>
                  <p className="text-slate-600">Atas Nama: <strong>TK AISYIYAH SADIREJO</strong></p>
                </div>
              )}

              <div className="space-y-2 pt-2 border-t">
                <label className="block text-xs font-semibold text-slate-700">Upload Bukti Transaksi (Struk / Screenshot) *</label>
                <input type="file" accept="image/*" onChange={handleFileUpload} className="w-full text-xs p-2 border rounded-lg" required />
                {buktiFile && <p className="text-[10px] text-emerald-700 font-bold">✓ Foto bukti transaksi berhasil diunggah.</p>}
              </div>

              {statusBayarSPP === "idle" && (
                <button onClick={handleConfirmPembayaran} className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-semibold py-2.5 rounded-lg text-xs">Konfirmasi & Kirim Pembayaran</button>
              )}

              {statusBayarSPP === "pending" && (
                <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 font-bold">
                  ⏳ Status: Menunggu Verifikasi Petugas TU
                </div>
              )}
            </div>

            <div className="pt-4 border-t space-y-3">
              <h3 className="text-xs font-bold text-slate-800 flex items-center gap-1">🧾 Bukti Kuitansi Pembayaran Resmi:</h3>
              {kuitansiList.length === 0 ? (
                <div className="text-xs text-slate-500 bg-slate-50 p-6 rounded-xl text-center border">Belum ada kuitansi resmi yang diterbitkan.</div>
              ) : (
                <div className="space-y-3">
                  {kuitansiList.map((k) => (
                    <div key={k.id} className="p-4 bg-emerald-50/80 border border-emerald-300 rounded-xl space-y-2 text-xs text-emerald-950 shadow-sm">
                      <div className="flex justify-between border-b border-emerald-200 pb-2">
                        <span className="font-bold text-emerald-900">KUITANSI RESMI SEKOLAH</span>
                        <span className="text-[10px] text-slate-500">{k.tanggal}</span>
                      </div>
                      <p className="italic leading-relaxed text-slate-800">"{k.pesan}"</p>
                      <div className="pt-2 border-t border-emerald-200 flex justify-between font-bold text-emerald-900">
                        <span>Penyelesaian: {k.jenis}</span>
                        <span className="bg-emerald-700 text-white text-[10px] px-2 py-0.5 rounded-md">✓ LUNAS</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 4: Infaq Lazismu */}
        {activeTab === "infaq" && (
          <div className="bg-white p-5 rounded-2xl shadow-sm border space-y-4">
            <div className="flex justify-between items-center border-b pb-2">
              <h2 className="text-sm font-bold text-slate-800">Infaq & ZIS Sukarela (Lazismu)</h2>
              <span className="bg-orange-100 text-orange-800 font-bold text-[10px] px-2.5 py-0.5 rounded-full">🧡 Kemitraan Lazismu</span>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Pilih Jenis Penyaluran</label>
                <select value={jenisInfaq} onChange={(e) => setJenisInfaq(e.target.value)} className="w-full px-3 py-2 border rounded-lg text-xs">
                  <option value="Infaq Sukarela">Infaq Sukarela</option>
                  <option value="Sadaqah">Sadaqah</option>
                  <option value="Zakat Fitri">Zakat Fitri</option>
                  <option value="Zakat Maal">Zakat Maal (2.5% Harta)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Nominal Infaq / ZIS (Rp)</label>
                <input type="number" placeholder="Contoh: 50000" value={nominalInfaq} onChange={(e) => setNominalInfaq(e.target.value)} className="w-full px-3 py-2 border rounded-lg text-xs font-bold" />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Pilih Metode Penyaluran</label>
                <div className="grid grid-cols-2 gap-2">
                  <button type="button" onClick={() => setMetodeInfaq("qris")} className={`py-2 text-xs font-semibold rounded-lg border ${metodeInfaq === "qris" ? "bg-orange-50 border-orange-500 text-orange-800" : "border-slate-200"}`}>📱 Scan QRIS Lazismu</button>
                  <button type="button" onClick={() => setMetodeInfaq("transfer")} className={`py-2 text-xs font-semibold rounded-lg border ${metodeInfaq === "transfer" ? "bg-orange-50 border-orange-500 text-orange-800" : "border-slate-200"}`}>🏦 Transfer Rekening Lazismu</button>
                </div>
              </div>

              {metodeInfaq === "qris" ? (
                <div className="p-4 bg-orange-50/50 border border-orange-200 rounded-xl text-center space-y-2">
                  <p className="text-xs font-bold text-orange-900">QRIS NATIONAL RESMI LAZISMU</p>
                  <div className="w-36 h-36 mx-auto bg-white p-2 border rounded-xl flex items-center justify-center shadow-sm">
                    <span className="text-xs text-slate-400 font-semibold">[ Barcode QRIS Lazismu ]</span>
                  </div>
                </div>
              ) : (
                <div className="p-3 bg-orange-50/50 border border-orange-200 rounded-xl text-xs space-y-1">
                  <p className="text-orange-950 font-bold mb-1">REKENING PENYALURAN LAZISMU:</p>
                  <p className="text-slate-700">Bank Tujuan: <strong>Bank Syariah Indonesia (BSI)</strong></p>
                  <p className="text-slate-700">No. Rekening: <strong className="text-emerald-700 text-sm">777-1234-567</strong></p>
                  <p className="text-slate-700">Atas Nama: <strong>LAZISMU KANTOR LAYANAN SADIREJO</strong></p>
                </div>
              )}

              {!sudahBayarInfaq ? (
                <button onClick={() => setSudahBayarInfaq(true)} className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-semibold py-2.5 rounded-lg text-xs">Tunaikan Infaq ke Lazismu</button>
              ) : (
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 space-y-1">
                  <p className="font-bold">Assalamu'alaikum Wr. Wb.</p>
                  <p>Terima kasih Bunda/Ayah sudah berinfaq hari ini, semoga kebaikan kita di terima Allah Subhanahu wa ta'ala, jazakallah khairan.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 5: Jurnal Harian */}
        {activeTab === "jurnal" && (
          <div className="bg-white p-5 rounded-2xl shadow-sm border space-y-4">
            <h2 className="text-sm font-bold text-slate-800 border-b pb-2">Jurnal Harian Perkembangan Siswa (Input Guru)</h2>
            {jurnalSiswa.length === 0 ? (
              <div className="text-xs text-slate-500 bg-slate-50 p-6 rounded-xl text-center">Belum ada jurnal harian yang diinput oleh Guru Kelas.</div>
            ) : (
              <div className="space-y-3">
                {jurnalSiswa.map((j, idx) => (
                  <div key={idx} className="p-4 border rounded-xl bg-slate-50 space-y-2 text-xs">
                    <p className="font-bold text-emerald-800">📅 Tanggal: {j.tanggal}</p>
                    <ul className="list-disc list-inside text-slate-600 space-y-1">
                      {j.aktivitas.map((act: string, i: number) => <li key={i}>{act}</li>)}
                    </ul>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 6: Tabungan Siswa */}
        {activeTab === "tabungan" && (
          <div className="bg-white p-5 rounded-2xl shadow-sm border space-y-4">
            <h2 className="text-sm font-bold text-slate-800 border-b pb-2">Buku Tabungan Digital Siswa (Input Guru)</h2>
            <div className="bg-emerald-800 text-white p-4 rounded-xl flex justify-between items-center">
              <div>
                <p className="text-[10px] font-bold tracking-wider text-emerald-200 uppercase">TOTAL SALDO TABUNGAN AKTIF</p>
                <p className="text-2xl font-bold mt-0.5">Rp {hitungTotalSaldo().toLocaleString("id-ID")}</p>
              </div>
              <span className="text-3xl">💰</span>
            </div>
          </div>
        )}

        {/* Tab 7: e-Rapor PAUD */}
        {activeTab === "rapor" && (
          <div className="bg-white p-5 rounded-2xl shadow-sm border space-y-4">
            <h2 className="text-sm font-bold text-slate-800 border-b pb-2">e-Rapor PAUD Digital (PDF)</h2>
            {!raporUrl ? (
              <div className="text-xs text-slate-500 bg-slate-50 p-6 rounded-xl text-center">Guru belum mengunggah file e-Rapor.</div>
            ) : (
              <div className="p-5 bg-emerald-50 border border-emerald-200 rounded-xl space-y-3 text-center">
                <span className="text-4xl">📄</span>
                <div>
                  <p className="text-xs font-bold text-emerald-950">File e-Rapor PAUD Digital Diterbitkan!</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">Silakan klik tombol di bawah untuk mengunduh PDF e-Rapor.</p>
                </div>
                <a href={raporUrl} download="e-Rapor-PAUD.pdf" className="inline-block bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs px-5 py-2.5 rounded-xl">
                  📥 Unduh File e-Rapor (PDF)
                </a>
              </div>
            )}
          </div>
        )}

        {/* Tab 8: Form PPDB Online */}
        {activeTab === "ppdb" && (
          <div className="bg-white p-5 rounded-2xl shadow-sm border space-y-4">
            <h2 className="text-sm font-bold text-slate-800 border-b pb-2">Formulir Pendaftaran Siswa Baru (PPDB Online)</h2>
            <form onSubmit={handlePPDBSubmit} className="space-y-3">
              <input type="text" placeholder="Nama Lengkap Anak" value={namaAnak} onChange={(e) => setNamaAnak(e.target.value)} className="w-full px-3 py-2 border rounded-lg text-xs" required />
              <input type="number" placeholder="16 Digit NIK Anak" value={nikAnak} onChange={(e) => setNikAnak(e.target.value)} className="w-full px-3 py-2 border rounded-lg text-xs" required />
              <select value={kelasTarget} onChange={(e) => setKelasTarget(e.target.value)} className="w-full px-3 py-2 border rounded-lg text-xs">
                <option value="Kelas A">Kelas A (4-5 Tahun)</option>
                <option value="Kelas B">Kelas B (5-6 Tahun)</option>
              </select>
              <div className="grid grid-cols-2 gap-2">
                <input type="text" placeholder="Tempat Lahir" value={tempatLahir} onChange={(e) => setTempatLahir(e.target.value)} className="w-full px-3 py-2 border rounded-lg text-xs" required />
                <input type="date" value={tanggalLahir} onChange={(e) => setTanggalLahir(e.target.value)} className="w-full px-3 py-2 border rounded-lg text-xs" required />
              </div>
              <textarea placeholder="Alamat Domisili Lengkap" value={alamat} onChange={(e) => setAlamat(e.target.value)} className="w-full px-3 py-2 border rounded-lg text-xs" required></textarea>
              <div className="grid grid-cols-2 gap-2">
                <input type="text" placeholder="Nama Ayah" value={namaAyah} onChange={(e) => setNamaAyah(e.target.value)} className="w-full px-3 py-2 border rounded-lg text-xs" required />
                <input type="text" placeholder="Pekerjaan Ayah" value={pekerjaanAyah} onChange={(e) => setPekerjaanAyah(e.target.value)} className="w-full px-3 py-2 border rounded-lg text-xs" required />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <input type="text" placeholder="Nama Ibu" value={namaIbu} onChange={(e) => setNamaIbu(e.target.value)} className="w-full px-3 py-2 border rounded-lg text-xs" required />
                <input type="text" placeholder="Pekerjaan Ibu" value={pekerjaanIbu} onChange={(e) => setPekerjaanIbu(e.target.value)} className="w-full px-3 py-2 border rounded-lg text-xs" required />
              </div>
              <button type="submit" className="w-full bg-emerald-700 text-white font-semibold py-2.5 rounded-lg text-xs">Kirim Formulir PPDB Online</button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}