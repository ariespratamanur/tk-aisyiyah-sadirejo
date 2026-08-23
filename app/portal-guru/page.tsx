"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function PortalGuru() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [nip, setNip] = useState("");
  const [password, setPassword] = useState("");

  // Options Tahun Ajaran & Filter Kelas
  const [opsiTahunAjaran] = useState([
    "2026/2027",
    "2027/2028",
    "2028/2029",
    "2029/2030",
    "2030/2031",
  ]);
  const [tahunAjaran, setTahunAjaran] = useState("2026/2027");
  const [filterKelas, setFilterKelas] = useState("Kelas A"); // "Kelas A" atau "Kelas B"

  const [activeTab, setActiveTab] = useState<"jurnal" | "tabungan" | "rapor">("jurnal");

  // State Data Sinkronisasi
  const [daftarSiswaTU, setDaftarSiswaTU] = useState<any[]>([]);
  const [selectedSiswa, setSelectedSiswa] = useState("");

  // Form Jurnal
  const [tanggalJurnal, setTanggalJurnal] = useState(new Date().toISOString().split("T")[0]);
  const [aktivitasChecklist, setAktivitasChecklist] = useState({
    sholat: true,
    hafalan: true,
    kemandirian: true,
    membaca: true,
    menghitung: true,
    melukis: true,
    ekskul: true,
  });

  // Form Tabungan
  const [tanggalTabungan, setTanggalTabungan] = useState(new Date().toISOString().split("T")[0]);
  const [nominalTabungan, setNominalTabungan] = useState("");
  const [jenisMutasi, setJenisMutasi] = useState<"setor" | "tarik">("setor");

  // Form e-Rapor
  const [raporFileUrl, setRaporFileUrl] = useState<string | null>(null);

  useEffect(() => {
    const savedTA = localStorage.getItem("selected_ta");
    if (savedTA) setTahunAjaran(savedTA);
  }, []);

  // Sync Data Siswa dari Portal TU/PPDB
  const syncSiswaData = () => {
    const savedTU = JSON.parse(localStorage.getItem("tu_daftar_ppdb") || "[]");
    setDaftarSiswaTU(savedTU);
  };

  useEffect(() => {
    syncSiswaData();
    const interval = setInterval(syncSiswaData, 1000);
    return () => clearInterval(interval);
  }, [isLoggedIn]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (nip && password) setIsLoggedIn(true);
    else alert("Harap isi NIP/NBM dan Password Guru!");
  };

  // Filter Siswa Berdasarkan Tahun Ajaran dan Kelas A / Kelas B
  const siswaFiltered = daftarSiswaTU.filter((s) => {
    const matchTA = !s.tahunAjaran || s.tahunAjaran === tahunAjaran;
    const matchKelas = s.kelasTarget === filterKelas;
    return matchTA && matchKelas;
  });

  // 1. Simpan Jurnal Harian -> Kirim ke Portal Wali
  const handleSimpanJurnal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSiswa) return alert("Pilih Nama Siswa terlebih dahulu!");

    const daftarAktivitas: string[] = [];
    if (aktivitasChecklist.sholat) daftarAktivitas.push("Sholat Dhuha Berjamaah");
    if (aktivitasChecklist.hafalan) daftarAktivitas.push("Muraja'ah Hafalan Doa & Surah Pendek");
    if (aktivitasChecklist.kemandirian) daftarAktivitas.push("Kemandirian & Adab Makan/Minum");
    if (aktivitasChecklist.membaca) daftarAktivitas.push("Membaca (Iqra / Hijaiyah)");
    if (aktivitasChecklist.menghitung) daftarAktivitas.push("Menghitung / Mengenal Angka");
    if (aktivitasChecklist.melukis) daftarAktivitas.push("Melukis / Mewarnai Kreatif");
    if (aktivitasChecklist.ekskul) daftarAktivitas.push("Kegiatan Ekskul / Seni");

    const newJurnal = {
      id: Date.now(),
      namaAnak: selectedSiswa,
      tanggal: tanggalJurnal,
      aktivitas: daftarAktivitas,
      tahunAjaran,
      kelas: filterKelas,
    };

    const existingJurnal = JSON.parse(localStorage.getItem("integrated_jurnal") || "[]");
    existingJurnal.unshift(newJurnal);
    localStorage.setItem("integrated_jurnal", JSON.stringify(existingJurnal));

    alert(`Jurnal harian untuk ${selectedSiswa} (${filterKelas}) berhasil disimpan & dikirim ke Portal Wali!`);
  };

  // 2. Simpan Setoran Tabungan -> Kirim ke Portal Wali & TU
  const handleSimpanTabungan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSiswa || !nominalTabungan) return alert("Pilih Nama Siswa & Isi Nominal Tabungan!");

    const newTabungan = {
      id: Date.now(),
      namaAnak: selectedSiswa,
      tanggal: tanggalTabungan,
      nominal: Number(nominalTabungan),
      jenis: jenisMutasi,
      tahunAjaran,
      kelas: filterKelas,
    };

    const existingTabungan = JSON.parse(localStorage.getItem("integrated_tabungan") || "[]");
    existingTabungan.unshift(newTabungan);
    localStorage.setItem("integrated_tabungan", JSON.stringify(existingTabungan));

    alert(`Setoran tabungan Rp ${Number(nominalTabungan).toLocaleString("id-ID")} untuk ${selectedSiswa} berhasil disetorkan! Otomatis tersinkron ke Portal Wali & TU.`);
    setNominalTabungan("");
  };

  // 3. Upload File e-Rapor PDF -> Kirim ke Portal Wali & TU
  const handleFileUploadRapor = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setRaporFileUrl(result);
        localStorage.setItem("integrated_rapor", result);
        alert(`File e-Rapor PAUD (${filterKelas}) berhasil diunggah! Terbit otomatis di Portal Wali dan TU.`);
      };
      reader.readAsDataURL(file);
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
        <div className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-md border border-slate-200">
          <div className="bg-emerald-800 text-white p-4 rounded-xl text-center mb-6 space-y-2">
            <img src="/logo.png" alt="Logo" className="w-12 h-12 mx-auto object-contain bg-white/10 p-1 rounded-full" />
            <h1 className="font-bold text-lg">Login Portal Guru Kelas</h1>
            <p className="text-xs text-emerald-100">TK 'AISYIYAH BUSTANUL ATHFAL SADIREJO</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <input type="text" placeholder="NIP / NBM Guru" value={nip} onChange={(e) => setNip(e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm" required />
            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm" required />
            <button type="submit" className="w-full bg-emerald-800 hover:bg-emerald-900 text-white font-semibold py-2.5 rounded-lg text-sm">Masuk Portal Guru</button>
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
        <div className="bg-emerald-800 text-white p-4 rounded-2xl shadow-sm flex flex-wrap justify-between items-center gap-2">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="Logo" className="w-10 h-10 object-contain bg-white/10 p-1 rounded-full" />
            <div>
              <h1 className="font-bold text-base">Portal Guru Kelas</h1>
              <p className="text-xs text-emerald-100">TK 'AISYIYAH BUSTANUL ATHFAL SADIREJO</p>
            </div>
          </div>
          <button onClick={() => setIsLoggedIn(false)} className="bg-emerald-900 hover:bg-emerald-950 px-3 py-1.5 rounded-lg text-xs font-semibold">Keluar</button>
        </div>

        {/* Filter Kelompok Kelas A / B & Tahun Ajaran */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">1. Pilih Kelompok Kelas Siswa</label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setFilterKelas("Kelas A");
                    setSelectedSiswa("");
                  }}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold border transition ${filterKelas === "Kelas A" ? "bg-emerald-700 text-white border-emerald-700" : "bg-slate-50 text-slate-700"}`}
                >
                  Kelompok Kelas A
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setFilterKelas("Kelas B");
                    setSelectedSiswa("");
                  }}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold border transition ${filterKelas === "Kelas B" ? "bg-emerald-700 text-white border-emerald-700" : "bg-slate-50 text-slate-700"}`}
                >
                  Kelompok Kelas B
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">2. Pilih Tahun Ajaran</label>
              <select
                value={tahunAjaran}
                onChange={(e) => {
                  setTahunAjaran(e.target.value);
                  localStorage.setItem("selected_ta", e.target.value);
                }}
                className="w-full px-3 py-2 border rounded-xl text-xs font-bold bg-slate-50"
              >
                {opsiTahunAjaran.map((ta) => (
                  <option key={ta} value={ta}>T.A. {ta}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">3. Pilih Siswa Aktif ({filterKelas} - T.A. {tahunAjaran})</label>
            <select
              value={selectedSiswa}
              onChange={(e) => setSelectedSiswa(e.target.value)}
              className="w-full px-3 py-2 border rounded-xl text-xs font-bold bg-white"
            >
              <option value="">-- Pilih Siswa ({siswaFiltered.length} Terdaftar di TU) --</option>
              {siswaFiltered.map((s, i) => (
                <option key={i} value={s.namaAnak}>
                  {s.namaAnak} ({s.kelasTarget}) - Wali: {s.namaWali}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white p-2 rounded-2xl shadow-sm border flex gap-1">
          <button onClick={() => setActiveTab("jurnal")} className={`flex-1 py-2 text-xs font-semibold rounded-xl ${activeTab === "jurnal" ? "bg-emerald-700 text-white" : "text-slate-600 hover:bg-slate-50"}`}>📖 Jurnal Harian</button>
          <button onClick={() => setActiveTab("tabungan")} className={`flex-1 py-2 text-xs font-semibold rounded-xl ${activeTab === "tabungan" ? "bg-emerald-700 text-white" : "text-slate-600 hover:bg-slate-50"}`}>💰 Input Tabungan</button>
          <button onClick={() => setActiveTab("rapor")} className={`flex-1 py-2 text-xs font-semibold rounded-xl ${activeTab === "rapor" ? "bg-emerald-700 text-white" : "text-slate-600 hover:bg-slate-50"}`}>📁 Upload e-Rapor</button>
        </div>

        {/* Tab 1: Input Jurnal Harian */}
        {activeTab === "jurnal" && (
          <div className="bg-white p-5 rounded-2xl shadow-sm border space-y-4">
            <h2 className="text-sm font-bold text-slate-800 border-b pb-2">Input Aktivitas Harian Siswa ({filterKelas})</h2>
            <form onSubmit={handleSimpanJurnal} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Tanggal Aktivitas</label>
                <input type="date" value={tanggalJurnal} onChange={(e) => setTanggalJurnal(e.target.value)} className="w-full px-3 py-2 border rounded-lg text-xs" required />
              </div>

              <div className="space-y-2 pt-1">
                <label className="block text-xs font-bold text-slate-700">Checklist Kegiatan Harian Siswa:</label>
                {[
                  { key: "sholat", label: "Sholat Dhuha Berjamaah" },
                  { key: "hafalan", label: "Muraja'ah Hafalan Doa & Surah Pendek" },
                  { key: "kemandirian", label: "Kemandirian & Adab Makan/Minum" },
                  { key: "membaca", label: "Membaca (Iqra / Hijaiyah)" },
                  { key: "menghitung", label: "Menghitung / Mengenal Angka" },
                  { key: "melukis", label: "Melukis / Mewarnai Kreatif" },
                  { key: "ekskul", label: "Kegiatan Ekskul / Seni" },
                ].map((item) => (
                  <label key={item.key} className="flex items-center gap-2 p-2.5 border rounded-xl text-xs bg-slate-50 hover:bg-emerald-50/50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={(aktivitasChecklist as any)[item.key]}
                      onChange={(e) => setAktivitasChecklist({ ...aktivitasChecklist, [item.key]: e.target.checked })}
                      className="w-4 h-4 accent-emerald-700"
                    />
                    <span className="font-semibold text-slate-700">{item.label}</span>
                  </label>
                ))}
              </div>

              <button type="submit" className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-semibold py-2.5 rounded-lg text-xs transition">
                💾 Simpan Jurnal & Kirim ke Portal Wali
              </button>
            </form>
          </div>
        )}

        {/* Tab 2: Input Tabungan Siswa */}
        {activeTab === "tabungan" && (
          <div className="bg-white p-5 rounded-2xl shadow-sm border space-y-4">
            <h2 className="text-sm font-bold text-slate-800 border-b pb-2">Input Setoran Tabungan Siswa ({filterKelas})</h2>
            <form onSubmit={handleSimpanTabungan} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Tanggal Transaksi</label>
                <input type="date" value={tanggalTabungan} onChange={(e) => setTanggalTabungan(e.target.value)} className="w-full px-3 py-2 border rounded-lg text-xs" required />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Jenis Mutasi</label>
                <select value={jenisMutasi} onChange={(e) => setJenisMutasi(e.target.value as any)} className="w-full px-3 py-2 border rounded-lg text-xs font-bold">
                  <option value="setor">🟢 Setoran Tabungan (+)</option>
                  <option value="tarik">🔴 Penarikan Tabungan (-)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Nominal Setoran (Rp)</label>
                <input type="number" placeholder="Contoh: 5000" value={nominalTabungan} onChange={(e) => setNominalTabungan(e.target.value)} className="w-full px-3 py-2 border rounded-lg text-xs font-bold" required />
              </div>

              <button type="submit" className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-semibold py-2.5 rounded-lg text-xs transition">
                💾 Simpan Setoran & Update ke Portal Wali & TU
              </button>
            </form>
          </div>
        )}

        {/* Tab 3: Upload e-Rapor PAUD */}
        {activeTab === "rapor" && (
          <div className="bg-white p-5 rounded-2xl shadow-sm border space-y-4">
            <h2 className="text-sm font-bold text-slate-800 border-b pb-2">Upload e-Rapor PAUD Digital (PDF)</h2>
            <div className="space-y-3">
              <label className="block text-xs font-semibold text-slate-700">Pilih File e-Rapor (Format PDF) *</label>
              <input type="file" accept="application/pdf" onChange={handleFileUploadRapor} className="w-full text-xs p-2.5 border rounded-xl bg-slate-50" />

              {raporFileUrl && (
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl space-y-2 text-xs text-emerald-950">
                  <p className="font-bold">✓ Dokumen e-Rapor Aktif Berhasil Diunggah!</p>
                  <p className="text-[11px] text-slate-600">Dokumen sudah dapat diunduh dan dicetak secara langsung dari Portal Wali Murid maupun Portal TU.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}