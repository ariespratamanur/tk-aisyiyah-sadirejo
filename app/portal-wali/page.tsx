"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";

// Inisialisasi Supabase SDK langsung di dalam file agar aman dari masalah path
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://tncvbyhgsjtoswlyxcrl.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function PortalWali() {
  const TENANT_ID = "aba-sadirejo";

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

  // Form PPDB Lengkap
  const [namaAnak, setNamaAnak] = useState("");
  const [nikAnak, setNikAnak] = useState("");
  const [jenisKelamin, setJenisKelamin] = useState("Laki-laki");
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
  const [buktiFile, setBuktiFile] = useState<string | null>(null);
  const [statusBayarSPP, setStatusBayarSPP] = useState<"idle" | "pending" | "verified">("idle");

  useEffect(() => {
    const savedNamaWali = localStorage.getItem("wali_nama");
    const savedWaWali = localStorage.getItem("wali_wa");
    if (savedNamaWali && savedWaWali) {
      setNamaWaliInput(savedNamaWali);
      setNoWaInput(savedWaWali);
      setIsWaliLoggedIn(true);
    }
  }, []);

  // Sync Data dari Supabase Cloud
  const syncDataFromSupabase = async () => {
    if (!noWaInput) return;

    try {
      const { data: siswaData } = await supabase
        .from("siswa")
        .select("*")
        .eq("tenant_id", TENANT_ID)
        .eq("wa_wali", noWaInput)
        .maybeSingle();

      if (siswaData) {
        setDataSiswa({
          id: siswaData.id,
          namaAnak: siswaData.nama_anak,
          nikAnak: siswaData.nik_anak,
          jenisKelamin: siswaData.jenis_kelamin || "Laki-laki",
          kelasTarget: siswaData.kelas_target,
          status: siswaData.status,
          tahunAjaran: siswaData.tahun_ajaran,
        });

        const { data: jurnalData } = await supabase
          .from("jurnal")
          .select("*")
          .eq("tenant_id", TENANT_ID)
          .eq("nama_anak", siswaData.nama_anak)
          .order("tanggal", { ascending: false });

        if (jurnalData) setJurnalSiswa(jurnalData);

        const { data: tabunganData } = await supabase
          .from("tabungan")
          .select("*")
          .eq("tenant_id", TENANT_ID)
          .eq("nama_anak", siswaData.nama_anak)
          .order("tanggal", { ascending: false });

        if (tabunganData) setTabunganSiswa(tabunganData);

        const { data: bayarData } = await supabase
          .from("pembayaran")
          .select("*")
          .eq("tenant_id", TENANT_ID)
          .eq("nama_anak", siswaData.nama_anak)
          .eq("status", "verified")
          .order("created_at", { ascending: false });

        if (bayarData) {
          setKuitansiList(
            bayarData.map((k: any) => ({
              id: k.id,
              jenis: k.jenis,
              nominal: k.nominal,
              tanggal: new Date(k.created_at).toLocaleDateString("id-ID"),
              pesan: `Assalamu'alaikum Wr. Wb. Terima kasih Bunda/Ayah ${k.wali} telah melakukan pembayaran ${k.jenis} sebesar Rp ${Number(k.nominal).toLocaleString("id-ID")}. Pembayaran telah resmi diterima oleh Tata Usaha. Jazakumullah Khairan Katsiran.`,
            }))
          );
        }
      }
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    syncDataFromSupabase();
    const interval = setInterval(syncDataFromSupabase, 3000);
    return () => clearInterval(interval);
  }, [isWaliLoggedIn, noWaInput]);

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

  // Submit PPDB ke Supabase
  const handlePPDBSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const taAktif = localStorage.getItem("selected_ta") || "2026/2027";

    const { error } = await supabase.from("siswa").insert([
      {
        tenant_id: TENANT_ID,
        nama_anak: namaAnak,
        nik_anak: nikAnak,
        jenis_kelamin: jenisKelamin,
        kelas_target: kelasTarget,
        tahun_ajaran: taAktif,
        nama_wali: namaWaliInput,
        wa_wali: noWaInput,
        status: "TERDAFTAR (Menunggu Pembayaran / Verifikasi TU)",
      },
    ]);

    if (!error) {
      alert("Formulir PPDB berhasil dikirim dan tersimpan di Supabase Cloud!");
      setActiveTab("kartu");
      syncDataFromSupabase();
    } else {
      alert("Gagal mengirim data PPDB: " + error.message);
    }
  };

  const handleConfirmPembayaran = async () => {
    if (!buktiFile) return alert("Harap unggah foto bukti pembayaran terlebih dahulu!");

    const taAktif = localStorage.getItem("selected_ta") || "2026/2027";
    const totalMasuk = Number(nominalBiaya) + 2000;

    const { error } = await supabase.from("pembayaran").insert([
      {
        tenant_id: TENANT_ID,
        nama_anak: dataSiswa?.namaAnak || "Calon Siswa",
        wali: namaWaliInput,
        jenis: jenisBiaya,
        nominal: totalMasuk,
        bukti_url: buktiFile,
        status: "pending",
        tahun_ajaran: taAktif,
      },
    ]);

    if (!error) {
      setStatusBayarSPP("pending");
      alert("Bukti pembayaran berhasil terkirim ke Supabase Cloud & Portal TU!");
    } else {
      alert("Gagal mengirim bukti pembayaran: " + error.message);
    }
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

        {/* Tab Navigasi */}
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
                      <p className="text-base font-bold text-white">{dataSiswa.namaAnak} ({dataSiswa.jenisKelamin})</p>
                      <p className="text-[11px] text-emerald-200 mt-1">Target Kelompok: <strong>{dataSiswa.kelasTarget}</strong> | NIK: {dataSiswa.nikAnak}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] text-emerald-300 font-semibold uppercase mb-1">STATUS AKADEMIK</p>
                      <span className="bg-emerald-400 text-emerald-950 text-xs font-bold px-3 py-1 rounded-full shadow-sm">{dataSiswa.status}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Belajar Online */}
        {activeTab === "belajar" && (
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-4 text-center">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center mx-auto text-3xl font-bold">🚀</div>
            <div className="space-y-1">
              <span className="bg-amber-100 text-amber-800 font-bold text-[10px] px-3 py-1 rounded-full uppercase tracking-wider">Pengembangan Modul</span>
              <h2 className="text-lg font-bold text-slate-800 pt-2">Fitur Belajar Online (E-Learning)</h2>
              <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">Materi pembelajaran interaktif, video, dan tugas harian dari <strong>Tim PT</strong> sedang disiapkan dan akan segera diunggah di modul ini.</p>
            </div>
            <div className="p-4 bg-slate-50 border border-dashed border-slate-300 rounded-2xl text-xs text-slate-400 font-semibold">✨ STATUS: COMING SOON / SEGERA HADIR ✨</div>
          </div>
        )}

        {/* Tab 3: Bayar Biaya & Upload Bukti */}
        {activeTab === "spp" && (
          <div className="bg-white p-5 rounded-2xl shadow-sm border space-y-4">
            <h2 className="text-sm font-bold text-slate-800 border-b pb-2">Pembayaran Biaya Sekolah & Upload Bukti Bayar</h2>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Pilih Jenis Biaya</label>
                <select value={jenisBiaya} onChange={(e) => setJenisBiaya(e.target.value)} className="w-full px-3 py-2 border rounded-lg text-xs">
                  <option value="SPP Bulanan">SPP Bulanan</option>
                  <option value="Biaya Pendaftaran DP 50%">Biaya Pendaftaran (DP 50%)</option>
                  <option value="Pelunasan Pendaftaran 100%">Biaya Pendaftaran (Pelunasan 100%)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Nominal Biaya (Rp)</label>
                <input type="text" value={nominalBiaya} onChange={(e) => setNominalBiaya(e.target.value)} className="w-full px-3 py-2 border rounded-lg text-xs font-bold" />
              </div>

              <div className="space-y-2 pt-2 border-t">
                <label className="block text-xs font-semibold text-slate-700">Upload Bukti Transaksi (Struk / Screenshot) *</label>
                <input type="file" accept="image/*" onChange={handleFileUpload} className="w-full text-xs p-2 border rounded-lg" required />
              </div>

              <button onClick={handleConfirmPembayaran} className="w-full bg-emerald-700 text-white font-semibold py-2.5 rounded-lg text-xs">Konfirmasi & Kirim Pembayaran</button>
            </div>

            <div className="pt-4 border-t space-y-3">
              <h3 className="text-xs font-bold text-slate-800">🧾 Bukti Kuitansi Pembayaran Resmi:</h3>
              {kuitansiList.map((k) => (
                <div key={k.id} className="p-4 bg-emerald-50 border border-emerald-300 rounded-xl space-y-2 text-xs">
                  <p className="font-bold text-emerald-900">{k.jenis} - Rp {Number(k.nominal).toLocaleString("id-ID")}</p>
                  <p className="italic text-slate-700">{k.pesan}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 5: Jurnal Harian */}
        {activeTab === "jurnal" && (
          <div className="bg-white p-5 rounded-2xl shadow-sm border space-y-4">
            <h2 className="text-sm font-bold text-slate-800 border-b pb-2">Jurnal Harian Perkembangan Siswa (Input Guru)</h2>
            {jurnalSiswa.map((j, idx) => (
              <div key={idx} className="p-4 border rounded-xl bg-slate-50 space-y-2 text-xs">
                <p className="font-bold text-emerald-800">📅 Tanggal: {j.tanggal}</p>
                <ul className="list-disc list-inside text-slate-600 space-y-1">
                  {Array.isArray(j.aktivitas) ? j.aktivitas.map((act: string, i: number) => <li key={i}>{act}</li>) : <li>{j.aktivitas}</li>}
                </ul>
              </div>
            ))}
          </div>
        )}

        {/* Tab 6: Tabungan Siswa */}
        {activeTab === "tabungan" && (
          <div className="bg-white p-5 rounded-2xl shadow-sm border space-y-4">
            <h2 className="text-sm font-bold text-slate-800 border-b pb-2">Buku Tabungan Digital Siswa</h2>
            <div className="bg-emerald-800 text-white p-4 rounded-xl flex justify-between items-center">
              <div>
                <p className="text-[10px] font-bold text-emerald-200">TOTAL SALDO TABUNGAN AKTIF</p>
                <p className="text-2xl font-bold">Rp {hitungTotalSaldo().toLocaleString("id-ID")}</p>
              </div>
              <span className="text-3xl">💰</span>
            </div>
          </div>
        )}

        {/* Tab 8: Form PPDB Online Lengkap dengan Pilihan Jenis Kelamin */}
        {activeTab === "ppdb" && (
          <div className="bg-white p-5 rounded-2xl shadow-sm border space-y-4">
            <h2 className="text-sm font-bold text-slate-800 border-b pb-2">Formulir Pendaftaran Siswa Baru (PPDB Online)</h2>
            <form onSubmit={handlePPDBSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Nama Lengkap Anak *</label>
                <input type="text" placeholder="Masukkan nama lengkap anak" value={namaAnak} onChange={(e) => setNamaAnak(e.target.value)} className="w-full px-3 py-2 border rounded-lg text-xs" required />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">16 Digit NIK Anak *</label>
                <input type="number" placeholder="Masukkan 16 digit NIK anak" value={nikAnak} onChange={(e) => setNikAnak(e.target.value)} className="w-full px-3 py-2 border rounded-lg text-xs" required />
              </div>

              {/* DROPDOWN JENIS KELAMIN & KELAS TARGET */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-emerald-800 mb-1">Jenis Kelamin *</label>
                  <select value={jenisKelamin} onChange={(e) => setJenisKelamin(e.target.value)} className="w-full px-3 py-2 border-2 border-emerald-600 rounded-lg text-xs font-bold bg-white">
                    <option value="Laki-laki">👦 Laki-laki</option>
                    <option value="Perempuan">👧 Perempuan</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Kelompok Target *</label>
                  <select value={kelasTarget} onChange={(e) => setKelasTarget(e.target.value)} className="w-full px-3 py-2 border rounded-lg text-xs font-bold bg-white">
                    <option value="Kelas A">Kelas A (4-5 Tahun)</option>
                    <option value="Kelas B">Kelas B (5-6 Tahun)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Tempat Lahir *</label>
                  <input type="text" placeholder="Kota Lahir" value={tempatLahir} onChange={(e) => setTempatLahir(e.target.value)} className="w-full px-3 py-2 border rounded-lg text-xs" required />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Tanggal Lahir *</label>
                  <input type="date" value={tanggalLahir} onChange={(e) => setTanggalLahir(e.target.value)} className="w-full px-3 py-2 border rounded-lg text-xs" required />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Alamat Domisili Lengkap *</label>
                <textarea placeholder="Tuliskan alamat lengkap rumah" value={alamat} onChange={(e) => setAlamat(e.target.value)} className="w-full px-3 py-2 border rounded-lg text-xs" required></textarea>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <input type="text" placeholder="Nama Ayah" value={namaAyah} onChange={(e) => setNamaAyah(e.target.value)} className="w-full px-3 py-2 border rounded-lg text-xs" required />
                <input type="text" placeholder="Pekerjaan Ayah" value={pekerjaanAyah} onChange={(e) => setPekerjaanAyah(e.target.value)} className="w-full px-3 py-2 border rounded-lg text-xs" required />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <input type="text" placeholder="Nama Ibu" value={namaIbu} onChange={(e) => setNamaIbu(e.target.value)} className="w-full px-3 py-2 border rounded-lg text-xs" required />
                <input type="text" placeholder="Pekerjaan Ibu" value={pekerjaanIbu} onChange={(e) => setPekerjaanIbu(e.target.value)} className="w-full px-3 py-2 border rounded-lg text-xs" required />
              </div>

              <button type="submit" className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-semibold py-2.5 rounded-lg text-xs transition">
                Kirim Formulir PPDB Online
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}