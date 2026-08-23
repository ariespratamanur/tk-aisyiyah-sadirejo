"use client";

import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function PortalTU() {
  const TENANT_ID = "aba-sadirejo";

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [nbm, setNbm] = useState("");
  const [password, setPassword] = useState("");

  const [opsiTahunAjaran] = useState(["2026/2027", "2027/2028", "2028/2029"]);
  const [tahunAjaran, setTahunAjaran] = useState("2026/2027");

  const [filterKelasPpdb, setFilterKelasPpdb] = useState("SEMUA");
  const [filterKelasTabungan, setFilterKelasTabungan] = useState("SEMUA");
  const [filterKelasRapor, setFilterKelasRapor] = useState("SEMUA");
  const [filterKelasTagihan, setFilterKelasTagihan] = useState("SEMUA");

  const [activeTab, setActiveTab] = useState<"ppdb" | "laporan" | "tabungan" | "rapor" | "tagihan" | "wa">("ppdb");

  const [daftarPPDB, setDaftarPPDB] = useState<any[]>([]);
  const [daftarPembayaran, setDaftarPembayaran] = useState<any[]>([]);
  const [rekapTabungan, setRekapTabungan] = useState<any[]>([]);

  // Form WA Tagihan & Broadcast Info
  const [siswaTargetTagihan, setSiswaTargetTagihan] = useState("");
  const [jenisTagihanInput, setJenisTagihanInput] = useState("SPP Bulanan");
  const [nominalTagihanInput, setNominalTagihanInput] = useState("");
  const [judulAcara, setJudulAcara] = useState("");
  const [tanggalAcara, setTanggalAcara] = useState("");
  const [jamAcara, setJamAcara] = useState("");

  const syncTUSupabase = async () => {
    // Fetch Data Siswa / PPDB
    const { data: siswaData } = await supabase
      .from("siswa")
      .select("*")
      .eq("tenant_id", TENANT_ID)
      .order("created_at", { ascending: false });

    if (siswaData) {
      setDaftarPPDB(
        siswaData.map((s: any) => ({
          id: s.id,
          namaAnak: s.nama_anak,
          nikAnak: s.nik_anak,
          kelasTarget: s.kelas_target || "Kelas A",
          status: s.status,
          tahunAjaran: s.tahun_ajaran || "2026/2027",
          namaWali: s.nama_wali,
          waWali: s.wa_wali,
          tempatLahir: s.tempat_lahir || "-",
          tanggalLahir: s.tanggal_lahir || "-",
          alamat: s.alamat || "-",
          namaAyah: s.nama_ayah || "-",
          pekerjaanAyah: s.pekerjaan_ayah || "-",
          namaIbu: s.nama_ibu || "-",
          pekerjaanIbu: s.pekerjaan_ibu || "-",
        }))
      );
    }

    // Fetch Laporan Pembayaran
    const { data: bayarData } = await supabase
      .from("pembayaran")
      .select("*")
      .eq("tenant_id", TENANT_ID)
      .order("created_at", { ascending: false });

    if (bayarData) {
      setDaftarPembayaran(
        bayarData.map((b: any) => ({
          id: b.id,
          jenis: b.jenis,
          nominal: b.nominal,
          wali: b.wali,
          namaAnak: b.nama_anak,
          buktiUrl: b.bukti_url,
          status: b.status,
          tanggal: new Date(b.created_at).toLocaleDateString("id-ID"),
        }))
      );
    }

    // Fetch Tabungan
    const { data: tabunganData } = await supabase
      .from("tabungan")
      .select("*")
      .eq("tenant_id", TENANT_ID);

    if (tabunganData) {
      setRekapTabungan(
        tabunganData.map((t: any) => ({
          namaAnak: t.nama_anak,
          kelas: t.kelas || "Kelas A",
          nominal: t.nominal,
          jenis: t.jenis,
        }))
      );
    }
  };

  useEffect(() => {
    syncTUSupabase();
    const interval = setInterval(syncTUSupabase, 3000);
    return () => clearInterval(interval);
  }, [isLoggedIn]);

  // Verifikasi Pembayaran & Terbit Kuitansi di Portal Wali
  const handleVerifikasiBayar = async (idPembayaran: number, jenisBayar: string) => {
    const { error } = await supabase
      .from("pembayaran")
      .update({ status: "verified" })
      .eq("id", idPembayaran);

    if (!error) {
      alert(`Kuitansi Resmi Pembayaran (${jenisBayar}) terbit & terkirim ke Portal Wali!`);
      syncTUSupabase();
    }
  };

  // Update Status Akademik Siswa
  const handleUpdateStatusSiswa = async (idSiswa: number, statusBaru: string) => {
    const { error } = await supabase
      .from("siswa")
      .update({ status: statusBaru })
      .eq("id", idSiswa);

    if (!error) {
      alert(`Status Siswa berhasil diperbarui menjadi: ${statusBaru} (Otomatis berubah di Portal Wali)`);
      syncTUSupabase();
    }
  };

  // Cetak / Download PDF Formulir PPDB
  const handleDownloadPdfPpdb = (siswa: any) => {
    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Formulir PPDB - ${siswa.namaAnak}</title>
            <style>
              body { font-family: Arial, sans-serif; padding: 20px; color: #333; }
              .header { text-align: center; border-bottom: 2px solid #000; padding-bottom: 10px; margin-bottom: 20px; }
              .header h2 { margin: 0; color: #b45309; }
              table { width: 100%; border-collapse: collapse; margin-top: 15px; }
              td { padding: 8px; border: 1px solid #ddd; font-size: 13px; }
              .label { font-weight: bold; background: #f9fafb; width: 35%; }
            </style>
          </head>
          <body>
            <div class="header">
              <h2>TK 'AISYIYAH BUSTANUL ATHFAL SADIREJO</h2>
              <p>Formulir Pendaftaran PPDB Tahun Ajaran ${tahunAjaran}</p>
            </div>
            <table>
              <tr><td class="label">Nama Lengkap Anak</td><td>${siswa.namaAnak}</td></tr>
              <tr><td class="label">16 Digit NIK Anak</td><td>${siswa.nikAnak}</td></tr>
              <tr><td class="label">Kelompok Target</td><td>${siswa.kelasTarget}</td></tr>
              <tr><td class="label">Tempat, Tanggal Lahir</td><td>${siswa.tempatLahir}, ${siswa.tanggalLahir}</td></tr>
              <tr><td class="label">Alamat Domisili</td><td>${siswa.alamat}</td></tr>
              <tr><td class="label">Nama Ayah / Pekerjaan</td><td>${siswa.namaAyah} / ${siswa.pekerjaanAyah}</td></tr>
              <tr><td class="label">Nama Ibu / Pekerjaan</td><td>${siswa.namaIbu} / ${siswa.pekerjaanIbu}</td></tr>
              <tr><td class="label">No. WhatsApp Wali</td><td>${siswa.waWali}</td></tr>
              <tr><td class="label">Status Akademik</td><td><b>${siswa.status || "TERDAFTAR"}</b></td></tr>
            </table>
            <script>window.print();</script>
          </body>
        </html>
      `);
      printWindow.document.close();
    }
  };

  const handleKirimTagihanWA = (e: React.FormEvent) => {
    e.preventDefault();
    const siswaPilih = daftarPPDB.find((s) => s.id.toString() === siswaTargetTagihan);
    if (!siswaPilih) return alert("Pilih nama siswa terlebih dahulu!");
    const pesan = `Halo Wali Murid dari *${siswaPilih.namaAnak}* (${siswaPilih.kelasTarget}), berikut tagihan T.A. ${tahunAjaran}: *${jenisTagihanInput}* sebesar *Rp ${Number(nominalTagihanInput).toLocaleString("id-ID")}*. Mohon lakukan pembayaran melalui Portal Wali Murid. Terima kasih.`;
    window.open(`https://wa.me/${siswaPilih.waWali || ""}?text=${encodeURIComponent(pesan)}`, "_blank");
  };

  const handleKirimInfoWA = (e: React.FormEvent) => {
    e.preventDefault();
    if (!judulAcara || !tanggalAcara) return alert("Judul dan Tanggal Acara wajib diisi!");
    const pesan = `📢 *PENGUMUMAN RESMI SEKOLAH (T.A. ${tahunAjaran})*\n\nKepada Yth. Wali Murid TK 'Aisyiyah Sadirejo,\n\nKami mengundang Bapak/Ibu untuk hadir dalam kegiatan:\n✨ *${judulAcara}*\n📅 Tanggal: ${tanggalAcara}\n⏰ Jam: ${jamAcara || "08.00 - Selesai"}\n\nTerima kasih.`;
    window.open(`https://wa.me/?text=${encodeURIComponent(pesan)}`, "_blank");
  };

  const hitungSaldoPerAnak = () => {
    const saldoMap: { [key: string]: { saldo: number; kelas: string } } = {};
    rekapTabungan.forEach((t) => {
      const nama = t.namaAnak || "Siswa";
      const kelasSiswa = t.kelas || "Kelas A";
      if (filterKelasTabungan === "SEMUA" || kelasSiswa === filterKelasTabungan) {
        if (!saldoMap[nama]) saldoMap[nama] = { saldo: 0, kelas: kelasSiswa };
        if (t.jenis === "setor") saldoMap[nama].saldo += Number(t.nominal);
        else saldoMap[nama].saldo -= Number(t.nominal);
      }
    });
    return saldoMap;
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
        <div className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-md border">
          <div className="bg-orange-600 text-white p-4 rounded-xl text-center mb-6">
            <h1 className="font-bold text-lg">Login Portal Tata Usaha (TU)</h1>
            <p className="text-xs text-orange-100">EduMu Aisyiyah - Supabase Connected</p>
          </div>
          <form onSubmit={(e) => { e.preventDefault(); setIsLoggedIn(true); }} className="space-y-4">
            <input type="text" placeholder="NBM" value={nbm} onChange={(e) => setNbm(e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm" required />
            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm" required />
            <button type="submit" className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-2.5 rounded-lg text-sm">Masuk Portal TU</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 p-4 pb-12">
      <div className="max-w-4xl mx-auto space-y-4">
        {/* Header TU */}
        <div className="bg-orange-600 text-white p-4 rounded-2xl flex justify-between items-center shadow">
          <div>
            <h1 className="font-bold text-base">Portal Tata Usaha (TU)</h1>
            <p className="text-xs text-orange-100">TK 'Aisyiyah Sadirejo</p>
          </div>
          <div className="flex items-center gap-2">
            <select value={tahunAjaran} onChange={(e) => setTahunAjaran(e.target.value)} className="bg-orange-700 text-white text-xs px-2 py-1.5 rounded-lg font-bold border border-orange-500">
              {opsiTahunAjaran.map((th, i) => <option key={i} value={th} className="text-slate-800">{th}</option>)}
            </select>
            <button onClick={() => setIsLoggedIn(false)} className="bg-orange-800 px-3 py-1.5 rounded-lg text-xs font-bold">Keluar</button>
          </div>
        </div>

        {/* Tab Navigasi Menu */}
        <div className="bg-white p-2 rounded-2xl border shadow-sm flex flex-wrap gap-1">
          <button onClick={() => setActiveTab("ppdb")} className={`flex-1 min-w-[90px] py-2 text-xs font-bold rounded-xl ${activeTab === "ppdb" ? "bg-orange-600 text-white" : "text-slate-600"}`}>📄 PPDB ({daftarPPDB.length})</button>
          <button onClick={() => setActiveTab("laporan")} className={`flex-1 min-w-[90px] py-2 text-xs font-bold rounded-xl ${activeTab === "laporan" ? "bg-orange-600 text-white" : "text-slate-600"}`}>📊 Laporan</button>
          <button onClick={() => setActiveTab("tabungan")} className={`flex-1 min-w-[90px] py-2 text-xs font-bold rounded-xl ${activeTab === "tabungan" ? "bg-orange-600 text-white" : "text-slate-600"}`}>💰 Tabungan</button>
          <button onClick={() => setActiveTab("rapor")} className={`flex-1 min-w-[90px] py-2 text-xs font-bold rounded-xl ${activeTab === "rapor" ? "bg-orange-600 text-white" : "text-slate-600"}`}>📑 e-Rapor</button>
          <button onClick={() => setActiveTab("tagihan")} className={`flex-1 min-w-[90px] py-2 text-xs font-bold rounded-xl ${activeTab === "tagihan" ? "bg-orange-600 text-white" : "text-slate-600"}`}>💳 Tagihan WA</button>
          <button onClick={() => setActiveTab("wa")} className={`flex-1 min-w-[90px] py-2 text-xs font-bold rounded-xl ${activeTab === "wa" ? "bg-orange-600 text-white" : "text-slate-600"}`}>📢 Info WA</button>
        </div>

        {/* Tab 1: PPDB */}
        {activeTab === "ppdb" && (
          <div className="bg-white p-5 rounded-2xl border shadow-sm space-y-3">
            <div className="flex justify-between items-center">
              <h2 className="text-sm font-bold text-slate-800">Verifikasi Status PPDB (T.A. {tahunAjaran})</h2>
              <div className="flex gap-1">
                <button onClick={() => setFilterKelasPpdb("SEMUA")} className={`px-2.5 py-1 text-xs rounded-lg font-bold ${filterKelasPpdb === "SEMUA" ? "bg-orange-600 text-white" : "bg-slate-100 text-slate-700"}`}>Semua</button>
                <button onClick={() => setFilterKelasPpdb("Kelas A")} className={`px-2.5 py-1 text-xs rounded-lg font-bold ${filterKelasPpdb === "Kelas A" ? "bg-orange-600 text-white" : "bg-slate-100 text-slate-700"}`}>Kelas A</button>
                <button onClick={() => setFilterKelasPpdb("Kelas B")} className={`px-2.5 py-1 text-xs rounded-lg font-bold ${filterKelasPpdb === "Kelas B" ? "bg-orange-600 text-white" : "bg-slate-100 text-slate-700"}`}>Kelas B</button>
              </div>
            </div>
            {daftarPPDB.filter((s) => filterKelasPpdb === "SEMUA" || s.kelasTarget === filterKelasPpdb).map((siswa) => (
              <div key={siswa.id} className="p-4 border rounded-xl bg-slate-50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <div>
                  <p className="font-bold text-xs">{siswa.namaAnak} <span className="text-orange-600">({siswa.kelasTarget})</span></p>
                  <p className="text-[11px] text-slate-500">Wali: {siswa.namaWali} ({siswa.waWali})</p>
                  <span className="text-[10px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full font-bold">{siswa.status || "TERDAFTAR"}</span>
                </div>
                <div className="flex gap-1 flex-wrap">
                  <button onClick={() => handleDownloadPdfPpdb(siswa)} className="bg-slate-700 text-white text-[10px] px-2 py-1.5 rounded-lg font-bold">📥 Download PDF</button>
                  <button onClick={() => handleUpdateStatusSiswa(siswa.id, "DITERIMA (DP 50%)")} className="bg-blue-600 text-white text-[10px] px-2 py-1.5 rounded-lg font-bold">Diterima (DP 50%)</button>
                  <button onClick={() => handleUpdateStatusSiswa(siswa.id, "AKTIF (LUNAS 100%)")} className="bg-emerald-600 text-white text-[10px] px-2 py-1.5 rounded-lg font-bold">✓ Aktif (Lunas)</button>
                  <button onClick={() => handleUpdateStatusSiswa(siswa.id, "PINDAH")} className="bg-rose-600 text-white text-[10px] px-2 py-1.5 rounded-lg font-bold">Pindah</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab 2: Laporan */}
        {activeTab === "laporan" && (
          <div className="bg-white p-5 rounded-2xl border shadow-sm space-y-3">
            <h2 className="text-sm font-bold text-slate-800">Laporan Pembayaran & Terbit Kuitansi (T.A. {tahunAjaran})</h2>
            {daftarPembayaran.map((p) => (
              <div key={p.id} className="p-4 border rounded-xl bg-slate-50 flex justify-between items-center">
                <div>
                  <p className="font-bold text-xs">{p.jenis} - Anak: {p.namaAnak} (Wali: {p.wali})</p>
                  <p className="text-xs text-emerald-700 font-bold">Rp {Number(p.nominal).toLocaleString("id-ID")}</p>
                </div>
                <div className="flex gap-1.5 items-center">
                  {p.buktiUrl && <a href={p.buktiUrl} target="_blank" rel="noreferrer" className="bg-slate-700 text-white text-[10px] px-2.5 py-1.5 rounded-lg font-bold">📥 Bukti Bayar</a>}
                  {p.status === "verified" ? (
                    <span className="bg-emerald-100 text-emerald-800 text-[10px] px-2.5 py-1.5 rounded-lg font-bold">✓ Verified</span>
                  ) : (
                    <button onClick={() => handleVerifikasiBayar(p.id, p.jenis)} className="bg-emerald-600 text-white text-[10px] px-2.5 py-1.5 rounded-lg font-bold">Verifikasi & Kuitansi</button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab 3: Tabungan */}
        {activeTab === "tabungan" && (
          <div className="bg-white p-5 rounded-2xl border shadow-sm space-y-3">
            <div className="flex justify-between items-center">
              <h2 className="text-sm font-bold text-slate-800">Rekap Tabungan Siswa (T.A. {tahunAjaran})</h2>
              <div className="flex gap-1">
                <button onClick={() => setFilterKelasTabungan("SEMUA")} className={`px-2.5 py-1 text-xs rounded-lg font-bold ${filterKelasTabungan === "SEMUA" ? "bg-orange-600 text-white" : "bg-slate-100"}`}>Semua</button>
                <button onClick={() => setFilterKelasTabungan("Kelas A")} className={`px-2.5 py-1 text-xs rounded-lg font-bold ${filterKelasTabungan === "Kelas A" ? "bg-orange-600 text-white" : "bg-slate-100"}`}>Kelas A</button>
                <button onClick={() => setFilterKelasTabungan("Kelas B")} className={`px-2.5 py-1 text-xs rounded-lg font-bold ${filterKelasTabungan === "Kelas B" ? "bg-orange-600 text-white" : "bg-slate-100"}`}>Kelas B</button>
              </div>
            </div>
            {Object.entries(hitungSaldoPerAnak()).map(([nama, obj], idx) => (
              <div key={idx} className="p-3 border rounded-xl bg-slate-50 flex justify-between">
                <div><span className="font-bold text-xs">{nama}</span> <span className="text-[10px] bg-orange-100 text-orange-800 px-1.5 py-0.5 rounded-full font-bold ml-1">{obj.kelas}</span></div>
                <span className="font-bold text-xs text-emerald-800">Rp {obj.saldo.toLocaleString("id-ID")}</span>
              </div>
            ))}
          </div>
        )}

        {/* Tab 4: e-Rapor */}
        {activeTab === "rapor" && (
          <div className="bg-white p-5 rounded-2xl border shadow-sm space-y-3 text-center py-6">
            <h2 className="text-sm font-bold text-slate-800">Pusat Cetak e-Rapor (T.A. {tahunAjaran})</h2>
            <div className="flex justify-center gap-1 my-2">
              <button onClick={() => setFilterKelasRapor("Kelas A")} className={`px-3 py-1 text-xs rounded-lg font-bold ${filterKelasRapor === "Kelas A" ? "bg-orange-600 text-white" : "bg-slate-100"}`}>Kelas A</button>
              <button onClick={() => setFilterKelasRapor("Kelas B")} className={`px-3 py-1 text-xs rounded-lg font-bold ${filterKelasRapor === "Kelas B" ? "bg-orange-600 text-white" : "bg-slate-100"}`}>Kelas B</button>
            </div>
            <button onClick={() => window.print()} className="bg-orange-600 text-white text-xs px-4 py-2 rounded-xl font-bold">🖨️ Cetak / Unduh Rekap e-Rapor {filterKelasRapor}</button>
          </div>
        )}

        {/* Tab 5: Tagihan WA */}
        {activeTab === "tagihan" && (
          <form onSubmit={handleKirimTagihanWA} className="bg-white p-5 rounded-2xl border shadow-sm space-y-3">
            <h2 className="text-sm font-bold text-slate-800">Buat & Kirim Tagihan WhatsApp Wali</h2>
            <select value={filterKelasTagihan} onChange={(e) => setFilterKelasTagihan(e.target.value)} className="w-full border rounded-lg p-2 text-xs bg-white">
              <option value="SEMUA">Semua Kelas</option>
              <option value="Kelas A">Kelas A</option>
              <option value="Kelas B">Kelas B</option>
            </select>
            <select value={siswaTargetTagihan} onChange={(e) => setSiswaTargetTagihan(e.target.value)} className="w-full border rounded-lg p-2 text-xs bg-white" required>
              <option value="">-- Pilih Siswa Target --</option>
              {daftarPPDB.filter((s) => filterKelasTagihan === "SEMUA" || s.kelasTarget === filterKelasTagihan).map((s) => (
                <option key={s.id} value={s.id}>{s.namaAnak} ({s.kelasTarget})</option>
              ))}
            </select>
            <select value={jenisTagihanInput} onChange={(e) => setJenisTagihanInput(e.target.value)} className="w-full border rounded-lg p-2 text-xs bg-white">
              <option value="SPP Bulanan">SPP Bulanan</option>
              <option value="Biaya Pendaftaran">Biaya Pendaftaran</option>
              <option value="Biaya Kegiatan">Biaya Kegiatan Sekolah</option>
            </select>
            <input type="number" placeholder="Nominal Rp" value={nominalTagihanInput} onChange={(e) => setNominalTagihanInput(e.target.value)} className="w-full border rounded-lg p-2 text-xs" required />
            <button type="submit" className="w-full bg-orange-600 text-white py-2.5 rounded-lg text-xs font-bold">📱 Terbitkan Tagihan WA</button>
          </form>
        )}

        {/* Tab 6: Info WA */}
        {activeTab === "wa" && (
          <form onSubmit={handleKirimInfoWA} className="bg-white p-5 rounded-2xl border shadow-sm space-y-3">
            <h2 className="text-sm font-bold text-slate-800">Broadcast Info Kegiatan ke WhatsApp Wali</h2>
            <input type="text" placeholder="Judul Kegiatan" value={judulAcara} onChange={(e) => setJudulAcara(e.target.value)} className="w-full border rounded-lg p-2 text-xs" required />
            <div className="grid grid-cols-2 gap-2">
              <input type="date" value={tanggalAcara} onChange={(e) => setTanggalAcara(e.target.value)} className="w-full border rounded-lg p-2 text-xs" required />
              <input type="text" placeholder="Jam Pelaksanaan" value={jamAcara} onChange={(e) => setJamAcara(e.target.value)} className="w-full border rounded-lg p-2 text-xs" />
            </div>
            <button type="submit" className="w-full bg-emerald-600 text-white py-2.5 rounded-lg text-xs font-bold">🚀 Broadcast Pengumuman WA</button>
          </form>
        )}
      </div>
    </div>
  );
}