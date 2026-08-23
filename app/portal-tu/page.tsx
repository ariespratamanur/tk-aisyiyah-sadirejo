"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function PortalTU() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [nbm, setNbm] = useState("");
  const [password, setPassword] = useState("");

  // Options Tahun Ajaran & Filter
  const [opsiTahunAjaran] = useState([
    "2026/2027",
    "2027/2028",
    "2028/2029",
    "2029/2030",
    "2030/2031",
  ]);
  const [tahunAjaran, setTahunAjaran] = useState("2026/2027");
  const [filterKelasTagihan, setFilterKelasTagihan] = useState("SEMUA"); // "SEMUA", "Kelas A", "Kelas B"
  const [filterKelasInfo, setFilterKelasInfo] = useState("SEMUA"); // "SEMUA", "Kelas A", "Kelas B"
  const [searchQuery, setSearchQuery] = useState("");

  const [activeTab, setActiveTab] = useState<"ppdb" | "laporan" | "tabungan" | "rapor" | "tagihan" | "wa">("ppdb");

  const [daftarPPDB, setDaftarPPDB] = useState<any[]>([]);
  const [daftarPembayaran, setDaftarPembayaran] = useState<any[]>([]);
  const [rekapTabungan, setRekapTabungan] = useState<any[]>([]);
  const [raporUrl, setRaporUrl] = useState<string | null>(null);

  // Form Tagihan WA
  const [siswaTargetTagihan, setSiswaTargetTagihan] = useState("");
  const [jenisTagihanInput, setJenisTagihanInput] = useState("SPP Bulanan");
  const [nominalTagihanInput, setNominalTagihanInput] = useState("");
  const [periodeTagihanInput, setPeriodeTagihanInput] = useState("Agustus 2026");

  // Form Info WA Kegiatan
  const [waliTargetWA, setWaliTargetWA] = useState("");
  const [namaAcara, setNamaAcara] = useState("");
  const [tanggalAcara, setTanggalAcara] = useState("");
  const [jamAcara, setJamAcara] = useState("");
  const [tempatAcara, setTempatAcara] = useState("");
  const [detailAcara, setDetailAcara] = useState("");

  useEffect(() => {
    const savedTA = localStorage.getItem("selected_ta");
    if (savedTA) setTahunAjaran(savedTA);
  }, []);

  const handleTAChange = (taBaru: string) => {
    setTahunAjaran(taBaru);
    localStorage.setItem("selected_ta", taBaru);
  };

  const syncTUData = () => {
    const savedPPDB = JSON.parse(localStorage.getItem("tu_daftar_ppdb") || "[]");
    setDaftarPPDB(savedPPDB);

    const savedBayar = JSON.parse(localStorage.getItem("tu_daftar_pembayaran") || "[]");
    setDaftarPembayaran(savedBayar);

    const savedTabungan = JSON.parse(localStorage.getItem("integrated_tabungan") || "[]");
    setRekapTabungan(savedTabungan);

    const savedRapor = localStorage.getItem("integrated_rapor");
    if (savedRapor) setRaporUrl(savedRapor);
  };

  useEffect(() => {
    syncTUData();
    const interval = setInterval(syncTUData, 1000);
    return () => clearInterval(interval);
  }, [isLoggedIn]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (nbm && password) setIsLoggedIn(true);
    else alert("Harap isi NBM dan Password!");
  };

  // Status Siswa PPDB
  const handleUpdateStatusSiswa = (index: number, statusBaru: string) => {
    const updated = [...daftarPPDB];
    updated[index].status = statusBaru;

    if (statusBaru === "AKTIF (LUNAS 100%)") {
      updated[index].keteranganLunas = `✓ LUNAS PEMBAYARAN PENDAFTARAN (T.A. ${tahunAjaran})`;
      updated[index].persentaseBayar = 100;
    } else if (statusBaru === "DITERIMA (DP 50%)") {
      updated[index].persentaseBayar = 50;
    }

    localStorage.setItem("tu_daftar_ppdb", JSON.stringify(updated));
    setDaftarPPDB(updated);
    localStorage.setItem("ppdb_data_siswa", JSON.stringify(updated[index]));

    alert(`Status Siswa ${updated[index].namaAnak} Berhasil Diperbarui Menjadi: ${statusBaru}`);
  };

  // Cetak PDF Form PPDB
  const handleDownloadFormPPDB = (siswa: any) => {
    const printContent = `
      <html>
        <head>
          <title>Formulir PPDB - ${siswa.namaAnak}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 25px; color: #333; }
            .header { text-align: center; border-bottom: 2px solid #000; padding-bottom: 10px; margin-bottom: 20px; }
            .title { font-size: 16px; font-weight: bold; }
            .subtitle { font-size: 12px; }
            table { width: 100%; border-collapse: collapse; margin-top: 15px; }
            td { padding: 8px; font-size: 12px; border-bottom: 1px solid #ddd; }
            .label { font-weight: bold; width: 35%; }
            .footer { margin-top: 50px; text-align: right; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="title">TK 'AISYIYAH BUSTANUL ATHFAL SADIREJO</div>
            <div class="subtitle">FORMULIR PENDAFTARAN PESERTA DIDIK BARU (PPDB)</div>
            <div class="subtitle">TAHUN AJARAN ${siswa.tahunAjaran || tahunAjaran}</div>
          </div>
          <table>
            <tr><td class="label">Nama Lengkap Anak</td><td>: ${siswa.namaAnak}</td></tr>
            <tr><td class="label">NIK Anak</td><td>: ${siswa.nikAnak}</td></tr>
            <tr><td class="label">Kelompok Target</td><td>: ${siswa.kelasTarget}</td></tr>
            <tr><td class="label">Tempat, Tanggal Lahir</td><td>: ${siswa.tempatLahir}, ${siswa.tanggalLahir}</td></tr>
            <tr><td class="label">Alamat Lengkap</td><td>: ${siswa.alamat}</td></tr>
            <tr><td class="label">Nama Ayah / Pekerjaan</td><td>: ${siswa.namaAyah} (${siswa.pekerjaanAyah})</td></tr>
            <tr><td class="label">Nama Ibu / Pekerjaan</td><td>: ${siswa.namaIbu} (${siswa.pekerjaanIbu})</td></tr>
            <tr><td class="label">Nama Wali / No. WA</td><td>: ${siswa.namaWali} (${siswa.waWali})</td></tr>
            <tr><td class="label">Tanggal Pendaftaran</td><td>: ${siswa.tanggalDaftar}</td></tr>
            <tr><td class="label">Status Pendaftaran</td><td>: <strong>${siswa.status}</strong></td></tr>
          </table>
          <div class="footer">
            <p>Sadirejo, ${new Date().toLocaleDateString("id-ID")}</p>
            <br/><br/>
            <p><strong>( Petugas Tata Usaha )</strong></p>
          </div>
        </body>
      </html>
    `;

    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(printContent);
      printWindow.document.close();
      printWindow.print();
    }
  };

  // Lihat & Unduh Foto Bukti Bayar
  const handleLihatBukti = (buktiUrl: string) => {
    if (!buktiUrl) return alert("Wali murid belum mengunggah foto bukti pembayaran.");
    const win = window.open();
    if (win) {
      win.document.write(`
        <html>
          <head><title>Bukti Pembayaran Masuk</title></head>
          <body style="margin:0; background:#1e293b; display:flex; flex-direction:column; align-items:center; justify-content:center; padding:20px; color:#fff; font-family:sans-serif;">
            <h3 style="margin-bottom:15px;">Bukti Pembayaran Resmi Wali Murid</h3>
            <img src="${buktiUrl}" style="max-width:90%; max-height:80vh; border-radius:12px; box-shadow:0 10px 25px rgba(0,0,0,0.5);" />
            <br/>
            <a href="${buktiUrl}" download="Bukti-Bayar.png" style="background:#059669; color:#fff; padding:10px 20px; border-radius:8px; text-decoration:none; font-weight:bold; font-size:12px;">📥 Unduh Gambar Bukti Bayar</a>
          </body>
        </html>
      `);
    }
  };

  // Verifikasi Bayar & Terbitkan Kuitansi
  const handleVerifikasiBayar = (index: number) => {
    const targetBayar = daftarPembayaran[index];

    const newKuitansi = {
      id: Date.now(),
      jenis: targetBayar.jenis,
      nominal: targetBayar.nominal,
      tanggal: new Date().toLocaleDateString("id-ID"),
      pesan: `Assalamu'alaikum Wr. Wb. Terima kasih Bunda/Ayah ${targetBayar.wali} telah melakukan pembayaran ${targetBayar.jenis} sebesar Rp ${Number(targetBayar.nominal).toLocaleString("id-ID")}. Pembayaran telah resmi diterima oleh Tata Usaha TK 'Aisyiyah Bustanul Athfal Sadirejo (T.A. ${tahunAjaran}). Jazakumullah Khairan Katsiran.`,
    };

    const existingKuitansi = JSON.parse(localStorage.getItem("integrated_kuitansi") || "[]");
    existingKuitansi.unshift(newKuitansi);
    localStorage.setItem("integrated_kuitansi", JSON.stringify(existingKuitansi));

    const updatedBayar = [...daftarPembayaran];
    updatedBayar[index].status = "verified";
    localStorage.setItem("tu_daftar_pembayaran", JSON.stringify(updatedBayar));
    setDaftarPembayaran(updatedBayar);

    alert(`Pembayaran Rp ${Number(targetBayar.nominal).toLocaleString("id-ID")} Berhasil Diverifikasi! Kuitansi resmi otomatis terbit di Portal Wali.`);
  };

  // Kirim Tagihan via WA
  const handleKirimTagihanWA = (e: React.FormEvent) => {
    e.preventDefault();
    if (!siswaTargetTagihan || !nominalTagihanInput) return alert("Pilih siswa & isi nominal tagihan!");

    const studentObj = daftarPPDB.find((s) => s.namaAnak === siswaTargetTagihan);
    const noWA = studentObj?.waWali || "08123456789";

    const textPesan = `Assalamu'alaikum Wr. Wb. Yth. Wali Murid dari *${siswaTargetTagihan}*.\n\nBerikut Pemberitahuan Tagihan Wajib Sekolah TK 'Aisyiyah Bustanul Athfal Sadirejo (Tahun Ajaran ${tahunAjaran}):\n📌 *Jenis Biaya:* ${jenisTagihanInput}\n📌 *Periode/Keterangan:* ${periodeTagihanInput}\n💵 *Total Tagihan:* Rp ${Number(nominalTagihanInput).toLocaleString("id-ID")}\n\nPembayaran dapat ditunaikan secara online via Portal Wali Murid atau dikonfirmasi ke Kantor TU. Jazakumullah Khairan.`;

    const waLink = `https://wa.me/${noWA.replace(/^0/, "62")}?text=${encodeURIComponent(textPesan)}`;
    window.open(waLink, "_blank");

    alert("Tagihan berhasil diterbitkan & diteruskan ke WhatsApp Wali Murid!");
    setNominalTagihanInput("");
  };

  // Kirim Info WA Kegiatan
  const handleKirimInfoWA = (e: React.FormEvent) => {
    e.preventDefault();
    if (!namaAcara || !tanggalAcara) return alert("Isi nama acara dan tanggal kegiatan!");

    const studentObj = daftarPPDB.find((s) => s.namaAnak === waliTargetWA);
    const noWA = studentObj?.waWali || "08123456789";

    const textPesan = `📢 *PENGUMUMAN KEGIATAN SEKOLAH (T.A. ${tahunAjaran})*\n*TK 'AISYIYAH BUSTANUL ATHFAL SADIREJO*\n\n*Nama Acara:* ${namaAcara}\n📅 *Tanggal:* ${tanggalAcara}\n⏰ *Jam:* ${jamAcara}\n📍 *Tempat:* ${tempatAcara}\n\n*Detail Keterangan:* ${detailAcara}\n\nTerima kasih atas perhatian Bapak/Ibu Wali Murid.\nWassalamu'alaikum Wr. Wb.`;

    const waLink = `https://wa.me/${noWA.replace(/^0/, "62")}?text=${encodeURIComponent(textPesan)}`;
    window.open(waLink, "_blank");

    alert("Pesan informasi kegiatan berhasil dikirim ke WhatsApp Wali Murid!");
    setNamaAcara("");
    setDetailAcara("");
  };

  // Filter Data Global
  const filteredPPDB = daftarPPDB.filter((s) => {
    const matchTA = !s.tahunAjaran || s.tahunAjaran === tahunAjaran;
    const matchQuery = !searchQuery || s.namaAnak?.toLowerCase().includes(searchQuery.toLowerCase()) || s.nikAnak?.includes(searchQuery);
    return matchTA && matchQuery;
  });

  const filteredPembayaran = daftarPembayaran.filter((p) => {
    const matchTA = !p.tahunAjaran || p.tahunAjaran === tahunAjaran;
    const matchQuery = !searchQuery || p.namaAnak?.toLowerCase().includes(searchQuery.toLowerCase()) || p.wali?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchTA && matchQuery;
  });

  // Filter Terpisah Siswa Kelas A & B untuk Buat Tagihan
  const listSiswaTagihanFiltered = filteredPPDB.filter((s) => {
    if (filterKelasTagihan === "SEMUA") return true;
    return s.kelasTarget === filterKelasTagihan;
  });

  // Filter Terpisah Siswa Kelas A & B untuk Info WA Kegiatan
  const listSiswaInfoFiltered = filteredPPDB.filter((s) => {
    if (filterKelasInfo === "SEMUA") return true;
    return s.kelasTarget === filterKelasInfo;
  });

  const hitungSaldoPerAnak = () => {
    const saldoMap: { [key: string]: number } = {};
    rekapTabungan.forEach((t) => {
      const nama = t.namaAnak || "Siswa";
      if (!saldoMap[nama]) saldoMap[nama] = 0;
      if (t.jenis === "setor") saldoMap[nama] += Number(t.nominal);
      else saldoMap[nama] -= Number(t.nominal);
    });
    return saldoMap;
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
        <div className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-md border border-slate-200">
          <div className="bg-orange-600 text-white p-4 rounded-xl text-center mb-6 space-y-2">
            <img src="/logo.png" alt="Logo" className="w-12 h-12 mx-auto object-contain bg-white/10 p-1 rounded-full" />
            <h1 className="font-bold text-lg">Login Portal Tata Usaha (TU)</h1>
            <p className="text-xs text-orange-100">TK 'AISYIYAH BUSTANUL ATHFAL SADIREJO</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <input type="text" placeholder="NBM" value={nbm} onChange={(e) => setNbm(e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm" required />
            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm" required />
            <button type="submit" className="w-full bg-orange-600 text-white font-semibold py-2.5 rounded-lg text-sm">Masuk Portal TU</button>
            <div className="text-center pt-2"><Link href="/" className="text-xs text-slate-500 hover:underline">Kembali ke Beranda</Link></div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 p-4">
      <div className="max-w-4xl mx-auto space-y-4">
        {/* Header Portal TU & Pilihan Tahun Ajaran */}
        <div className="bg-orange-600 text-white p-4 rounded-2xl shadow-sm flex flex-wrap justify-between items-center gap-2">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="Logo" className="w-10 h-10 object-contain bg-white/10 p-1 rounded-full" />
            <div>
              <h1 className="font-bold text-base">Portal Tata Usaha (TU)</h1>
              <p className="text-xs text-orange-100">TK 'AISYIYAH BUSTANUL ATHFAL SADIREJO</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="flex items-center bg-orange-700/80 px-2.5 py-1 rounded-xl border border-orange-400">
              <span className="text-[11px] text-orange-100 mr-2 font-semibold">Tahun Ajaran:</span>
              <select
                value={tahunAjaran}
                onChange={(e) => handleTAChange(e.target.value)}
                className="bg-orange-900 text-white font-bold text-xs px-2 py-1 rounded-lg focus:outline-none border border-orange-500 cursor-pointer"
              >
                {opsiTahunAjaran.map((ta) => (
                  <option key={ta} value={ta}>T.A. {ta}</option>
                ))}
              </select>
            </div>
            <button onClick={() => setIsLoggedIn(false)} className="bg-orange-800 hover:bg-orange-900 px-3 py-1.5 rounded-lg text-xs font-semibold">Keluar</button>
          </div>
        </div>

        {/* Pencarian Cepat Nama Siswa */}
        <div className="bg-white p-3 rounded-2xl shadow-sm border flex items-center gap-2">
          <span className="text-xs font-bold text-slate-600">🔍 Cari Siswa ({tahunAjaran}):</span>
          <input
            type="text"
            placeholder="Ketik Nama Siswa atau NIK..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 px-3 py-1.5 border rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-orange-500"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery("")} className="text-xs text-rose-600 font-bold px-2">Clear</button>
          )}
        </div>

        {/* Tab Navigasi Menu TU */}
        <div className="bg-white p-2 rounded-2xl shadow-sm border flex flex-wrap gap-1">
          <button onClick={() => setActiveTab("ppdb")} className={`flex-1 min-w-[100px] py-2 rounded-xl text-xs font-semibold ${activeTab === "ppdb" ? "bg-orange-600 text-white" : "text-slate-600 hover:bg-slate-50"}`}>📄 PPDB ({filteredPPDB.length})</button>
          <button onClick={() => setActiveTab("laporan")} className={`flex-1 min-w-[100px] py-2 rounded-xl text-xs font-semibold ${activeTab === "laporan" ? "bg-orange-600 text-white" : "text-slate-600 hover:bg-slate-50"}`}>📊 Laporan Uang Masuk</button>
          <button onClick={() => setActiveTab("tabungan")} className={`flex-1 min-w-[100px] py-2 rounded-xl text-xs font-semibold ${activeTab === "tabungan" ? "bg-orange-600 text-white" : "text-slate-600 hover:bg-slate-50"}`}>💰 Saldo Tabungan</button>
          <button onClick={() => setActiveTab("rapor")} className={`flex-1 min-w-[100px] py-2 rounded-xl text-xs font-semibold ${activeTab === "rapor" ? "bg-orange-600 text-white" : "text-slate-600 hover:bg-slate-50"}`}>📁 Unduh e-Rapor</button>
          <button onClick={() => setActiveTab("tagihan")} className={`flex-1 min-w-[100px] py-2 rounded-xl text-xs font-semibold ${activeTab === "tagihan" ? "bg-orange-600 text-white" : "text-slate-600 hover:bg-slate-50"}`}>💳 Buat Tagihan WA</button>
          <button onClick={() => setActiveTab("wa")} className={`flex-1 min-w-[100px] py-2 rounded-xl text-xs font-semibold ${activeTab === "wa" ? "bg-orange-600 text-white" : "text-slate-600 hover:bg-slate-50"}`}>📢 Info WA Kegiatan</button>
        </div>

        {/* Tab 1: PPDB */}
        {activeTab === "ppdb" && (
          <div className="bg-white p-5 rounded-2xl shadow-sm border space-y-4">
            <div className="flex justify-between items-center border-b pb-2">
              <h2 className="text-sm font-bold text-slate-800">Verifikasi PPDB Masuk (T.A. {tahunAjaran})</h2>
              <span className="text-xs font-bold text-orange-600 bg-orange-50 px-2.5 py-0.5 rounded-full">T.A. {tahunAjaran}</span>
            </div>

            {filteredPPDB.length === 0 ? (
              <div className="text-xs text-slate-500 bg-slate-50 p-8 rounded-xl text-center">Belum ada data pendaftar baru untuk Tahun Ajaran {tahunAjaran}.</div>
            ) : (
              <div className="space-y-3">
                {filteredPPDB.map((siswa, i) => (
                  <div key={i} className="p-4 border rounded-xl space-y-3 bg-slate-50">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-bold text-slate-800 text-sm">{siswa.namaAnak} ({siswa.kelasTarget})</h4>
                        <p className="text-xs text-slate-600">NIK: {siswa.nikAnak} | Alamat: {siswa.alamat}</p>
                        <p className="text-xs text-slate-600">Orang Tua: Ayah ({siswa.namaAyah}) | Ibu ({siswa.namaIbu})</p>
                        <p className="text-xs text-slate-500">Wali: {siswa.namaWali} ({siswa.waWali})</p>
                        {siswa.keteranganLunas && (
                          <p className="text-xs font-bold text-emerald-700 mt-1">{siswa.keteranganLunas}</p>
                        )}
                      </div>
                      <span className={`font-bold text-[10px] px-2.5 py-0.5 rounded-full uppercase ${siswa.status?.includes("AKTIF") ? "bg-emerald-100 text-emerald-800" : siswa.status?.includes("DITERIMA") ? "bg-sky-100 text-sky-800" : siswa.status?.includes("PINDAH") ? "bg-slate-200 text-slate-700" : siswa.status?.includes("LULUS") ? "bg-purple-100 text-purple-800" : "bg-amber-100 text-amber-800"}`}>{siswa.status}</span>
                    </div>

                    <div className="flex flex-wrap gap-1.5 pt-2 border-t text-xs">
                      <button onClick={() => handleDownloadFormPPDB(siswa)} className="bg-slate-700 text-white font-semibold px-3 py-1.5 rounded-lg text-[11px]">
                        📄 Cetak / Download Form PPDB (PDF)
                      </button>
                      <button onClick={() => handleUpdateStatusSiswa(i, "DITERIMA (DP 50%)")} className="bg-sky-600 text-white font-semibold px-2.5 py-1.5 rounded-lg text-[11px]">
                        ✓ Set DITERIMA (DP 50%)
                      </button>
                      <button onClick={() => handleUpdateStatusSiswa(i, "AKTIF (LUNAS 100%)")} className="bg-emerald-600 text-white font-semibold px-2.5 py-1.5 rounded-lg text-[11px]">
                        ✓ Set AKTIF (LUNAS 100%)
                      </button>
                      <button onClick={() => handleUpdateStatusSiswa(i, "PINDAH SEKOAH")} className="bg-slate-500 text-white font-semibold px-2.5 py-1.5 rounded-lg text-[11px]">
                        📦 Set PINDAH
                      </button>
                      <button onClick={() => handleUpdateStatusSiswa(i, "LULUS / ALUMNI")} className="bg-purple-600 text-white font-semibold px-2.5 py-1.5 rounded-lg text-[11px]">
                        🎓 Set LULUS
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Laporan Uang Masuk dengan Tombol Unduh / Lihat Bukti Bayar */}
        {activeTab === "laporan" && (
          <div className="bg-white p-5 rounded-2xl shadow-sm border space-y-4">
            <div className="flex justify-between items-center border-b pb-2">
              <h2 className="text-sm font-bold text-slate-800">Laporan Bukti Pembayaran Masuk (SPP, Pendaftaran, Kegiatan)</h2>
              <span className="text-xs font-bold text-orange-600 bg-orange-50 px-2.5 py-0.5 rounded-full">T.A. {tahunAjaran}</span>
            </div>

            {filteredPembayaran.length === 0 ? (
              <div className="text-xs text-slate-500 bg-slate-50 p-8 rounded-xl text-center">Belum ada bukti upload pembayaran masuk untuk T.A. {tahunAjaran}.</div>
            ) : (
              <div className="space-y-3">
                {filteredPembayaran.map((p, i) => (
                  <div key={i} className="p-4 border rounded-xl space-y-2 bg-slate-50 flex flex-wrap justify-between items-center gap-2">
                    <div>
                      <p className="font-bold text-slate-800 text-xs">{p.jenis} - Wali: {p.wali}</p>
                      <p className="text-xs text-slate-600">Siswa Target: <strong>{p.namaAnak}</strong></p>
                      <p className="text-[10px] text-slate-500">{p.tanggal} | Total: <strong className="text-emerald-700">Rp {Number(p.nominal).toLocaleString("id-ID")}</strong></p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        onClick={() => handleLihatBukti(p.buktiUrl)}
                        className="bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs px-3 py-2 rounded-xl transition flex items-center gap-1 shadow-sm"
                      >
                        🖼️ Lihat / Unduh Bukti Bayar
                      </button>

                      {p.status === "verified" ? (
                        <span className="bg-emerald-100 text-emerald-800 font-bold text-xs px-3 py-2 rounded-xl">✓ Kuitansi Terbit</span>
                      ) : (
                        <button onClick={() => handleVerifikasiBayar(i)} className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-3 py-2 rounded-xl transition shadow-sm">
                          ✓ Cek Bukti & Terbitkan Kuitansi
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Saldo Tabungan */}
        {activeTab === "tabungan" && (
          <div className="bg-white p-5 rounded-2xl shadow-sm border space-y-4">
            <div className="flex justify-between items-center border-b pb-2">
              <h2 className="text-sm font-bold text-slate-800">Rekap Saldo Tabungan Masing-Masing Siswa</h2>
              <span className="text-xs font-bold text-orange-600 bg-orange-50 px-2.5 py-0.5 rounded-full">T.A. {tahunAjaran}</span>
            </div>

            {Object.keys(hitungSaldoPerAnak()).length === 0 ? (
              <div className="text-xs text-slate-500 bg-slate-50 p-8 rounded-xl text-center">Belum ada data mutasi tabungan siswa.</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {Object.entries(hitungSaldoPerAnak()).map(([nama, saldo], idx) => (
                  <div key={idx} className="p-3.5 border rounded-xl bg-slate-50 flex justify-between items-center">
                    <div>
                      <p className="font-bold text-slate-800 text-xs">👤 {nama}</p>
                      <p className="text-[10px] text-slate-500">Saldo Tabungan Aktif</p>
                    </div>
                    <span className="font-bold text-emerald-800 text-sm">Rp {saldo.toLocaleString("id-ID")}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 4: Unduh e-Rapor */}
        {activeTab === "rapor" && (
          <div className="bg-white p-5 rounded-2xl shadow-sm border space-y-4">
            <div className="flex justify-between items-center border-b pb-2">
              <h2 className="text-sm font-bold text-slate-800">Arsip e-Rapor Digital Siswa (PDF)</h2>
              <span className="text-xs font-bold text-orange-600 bg-orange-50 px-2.5 py-0.5 rounded-full">T.A. {tahunAjaran}</span>
            </div>

            {!raporUrl ? (
              <div className="text-xs text-slate-500 bg-slate-50 p-8 rounded-xl text-center">Belum ada file e-Rapor yang diunggah oleh Guru Kelas.</div>
            ) : (
              <div className="p-5 bg-emerald-50 border border-emerald-200 rounded-xl flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">📄</span>
                  <div>
                    <h4 className="font-bold text-xs text-emerald-950">Dokumen e-Rapor PAUD Digital (T.A. {tahunAjaran})</h4>
                    <p className="text-[10px] text-slate-500">Format PDF - Siap Diunduh untuk Arsip TU</p>
                  </div>
                </div>
                <a href={raporUrl} download="Arsip-eRapor-TU.pdf" className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs px-4 py-2 rounded-xl">
                  📥 Unduh PDF Rapor
                </a>
              </div>
            )}
          </div>
        )}

        {/* Tab 5: Buat Tagihan WA dengan Filter Terpisah Kelas A & Kelas B */}
        {activeTab === "tagihan" && (
          <div className="bg-white p-5 rounded-2xl shadow-sm border space-y-4">
            <div className="flex justify-between items-center border-b pb-2">
              <h2 className="text-sm font-bold text-slate-800">Terbitkan Tagihan Wajib Biaya Sekolah</h2>
              <span className="text-xs font-bold text-orange-600 bg-orange-50 px-2.5 py-0.5 rounded-full">T.A. {tahunAjaran}</span>
            </div>

            <form onSubmit={handleKirimTagihanWA} className="space-y-3">
              {/* Filter Terpisah Kelas A & Kelas B */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">1. Filter Kelompok Kelas Siswa</label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setFilterKelasTagihan("SEMUA");
                      setSiswaTargetTagihan("");
                    }}
                    className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold border ${filterKelasTagihan === "SEMUA" ? "bg-orange-600 text-white border-orange-600" : "bg-slate-50 text-slate-700"}`}
                  >
                    Semua Siswa
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setFilterKelasTagihan("Kelas A");
                      setSiswaTargetTagihan("");
                    }}
                    className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold border ${filterKelasTagihan === "Kelas A" ? "bg-orange-600 text-white border-orange-600" : "bg-slate-50 text-slate-700"}`}
                  >
                    Siswa Kelas A
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setFilterKelasTagihan("Kelas B");
                      setSiswaTargetTagihan("");
                    }}
                    className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold border ${filterKelasTagihan === "Kelas B" ? "bg-orange-600 text-white border-orange-600" : "bg-slate-50 text-slate-700"}`}
                  >
                    Siswa Kelas B
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">2. Pilih Siswa Target ({filterKelasTagihan})</label>
                <select
                  value={siswaTargetTagihan}
                  onChange={(e) => setSiswaTargetTagihan(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg text-xs font-medium"
                  required
                >
                  <option value="">-- Pilih Siswa ({listSiswaTagihanFiltered.length} Terdaftar) --</option>
                  {listSiswaTagihanFiltered.map((s, i) => (
                    <option key={i} value={s.namaAnak}>
                      {s.namaAnak} ({s.kelasTarget}) - Wali: {s.namaWali}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Jenis Biaya Tagihan Wajib</label>
                <select value={jenisTagihanInput} onChange={(e) => setJenisTagihanInput(e.target.value)} className="w-full px-3 py-2 border rounded-lg text-xs">
                  <option value="SPP Bulanan">SPP Bulanan</option>
                  <option value="Biaya Pendaftaran DP 50%">Biaya Pendaftaran DP 50%</option>
                  <option value="Pelunasan Pendaftaran 100%">Pelunasan Pendaftaran 100%</option>
                  <option value="Biaya Kegiatan Sekolah Lainnya">Biaya Kegiatan Sekolah Lainnya</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Nominal Tagihan (Rp)</label>
                <input type="number" placeholder="Contoh: 150000" value={nominalTagihanInput} onChange={(e) => setNominalTagihanInput(e.target.value)} className="w-full px-3 py-2 border rounded-lg text-xs" required />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Periode / Keterangan</label>
                <input type="text" placeholder="Contoh: Bulan Agustus 2026" value={periodeTagihanInput} onChange={(e) => setPeriodeTagihanInput(e.target.value)} className="w-full px-3 py-2 border rounded-lg text-xs" required />
              </div>

              <button type="submit" className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-2.5 rounded-lg text-xs transition flex items-center justify-center gap-1">
                📲 Terbitkan Tagihan & Kirim ke WhatsApp Wali Murid
              </button>
            </form>
          </div>
        )}

        {/* Tab 6: Info WA Kegiatan dengan Filter Terpisah Kelas A & Kelas B */}
        {activeTab === "wa" && (
          <div className="bg-white p-5 rounded-2xl shadow-sm border space-y-4">
            <div className="flex justify-between items-center border-b pb-2">
              <h2 className="text-sm font-bold text-slate-800">Publikasi Info Kegiatan Sekolah via WA</h2>
              <span className="text-xs font-bold text-orange-600 bg-orange-50 px-2.5 py-0.5 rounded-full">T.A. {tahunAjaran}</span>
            </div>

            <form onSubmit={handleKirimInfoWA} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">1. Filter Kelompok Kelas Penerima</label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setFilterKelasInfo("SEMUA");
                      setWaliTargetWA("");
                    }}
                    className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold border ${filterKelasInfo === "SEMUA" ? "bg-orange-600 text-white border-orange-600" : "bg-slate-50 text-slate-700"}`}
                  >
                    Semua Kelas
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setFilterKelasInfo("Kelas A");
                      setWaliTargetWA("");
                    }}
                    className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold border ${filterKelasInfo === "Kelas A" ? "bg-orange-600 text-white border-orange-600" : "bg-slate-50 text-slate-700"}`}
                  >
                    Kelas A
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setFilterKelasInfo("Kelas B");
                      setWaliTargetWA("");
                    }}
                    className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold border ${filterKelasInfo === "Kelas B" ? "bg-orange-600 text-white border-orange-600" : "bg-slate-50 text-slate-700"}`}
                  >
                    Kelas B
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">2. Pilih Wali Murid Penerima ({filterKelasInfo})</label>
                <select value={waliTargetWA} onChange={(e) => setWaliTargetWA(e.target.value)} className="w-full px-3 py-2 border rounded-lg text-xs">
                  <option value="">-- Kirim Ke Semua Wali / Pilih Spesifik --</option>
                  {listSiswaInfoFiltered.map((s, i) => (
                    <option key={i} value={s.namaAnak}>
                      Wali dari {s.namaAnak} ({s.kelasTarget}) - {s.namaWali}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Nama Acara / Kegiatan Sekolah</label>
                <input type="text" placeholder="Contoh: Manasik Haji Cilik PAUD" value={namaAcara} onChange={(e) => setNamaAcara(e.target.value)} className="w-full px-3 py-2 border rounded-lg text-xs" required />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Tanggal Acara</label>
                  <input type="text" placeholder="Contoh: Sabtu, 29 Agustus 2026" value={tanggalAcara} onChange={(e) => setTanggalAcara(e.target.value)} className="w-full px-3 py-2 border rounded-lg text-xs" required />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Jam Acara</label>
                  <input type="text" placeholder="Contoh: 07.30 - 11.00 WIB" value={jamAcara} onChange={(e) => setJamAcara(e.target.value)} className="w-full px-3 py-2 border rounded-lg text-xs" required />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Tempat / Lokasi</label>
                <input type="text" placeholder="Contoh: Halaman Utama TK 'Aisyiyah" value={tempatAcara} onChange={(e) => setTempatAcara(e.target.value)} className="w-full px-3 py-2 border rounded-lg text-xs" required />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Detail Keterangan & Instruksi Seragam</label>
                <textarea rows={3} placeholder="Tuliskan pakaian, perlengkapan yang perlu dibawa..." value={detailAcara} onChange={(e) => setDetailAcara(e.target.value)} className="w-full p-3 border rounded-lg text-xs" required></textarea>
              </div>

              <button type="submit" className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-2.5 rounded-lg text-xs transition flex items-center justify-center gap-1">
                📢 Publikasikan & Kirim Info Kegiatan ke WA Wali
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}