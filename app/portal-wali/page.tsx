"use client";

import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function PortalWali() {
  const TENANT_ID = "aba-sadirejo";

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [waWali, setWaWali] = useState("");
  const [namaWaliInput, setNamaWaliInput] = useState("");

  const [activeTab, setActiveTab] = useState<"kartu" | "bayar" | "infaq" | "jurnal" | "tabungan" | "rapor" | "ppdb">("kartu");

  const [dataSiswa, setDataSiswa] = useState<any>(null);
  const [riwayatBayar, setRiwayatBayar] = useState<any[]>([]);
  const [riwayatJurnal, setRiwayatJurnal] = useState<any[]>([]);
  const [saldoTabunganTotal, setSaldoTabunganTotal] = useState(0);
  const [fileRaporUrl, setFileRaporUrl] = useState<string | null>(null);

  const [formPpdb, setFormPpdb] = useState({
    namaAnak: "",
    nikAnak: "",
    kelasTarget: "Kelas A",
    tempatLahir: "",
    tanggalLahir: "",
    alamat: "",
    namaAyah: "",
    pekerjaanAyah: "",
    namaIbu: "",
    pekerjaanIbu: "",
  });

  const [jenisBayar, setJenisBayar] = useState("SPP Bulanan");
  const [nominalBayar, setNominalBayar] = useState("");
  const [buktiBayarUrl, setBuktiBayarUrl] = useState("");
  const [pesanInfaq, setPesanInfaq] = useState("");

  const syncDataWali = async () => {
    if (!waWali) return;

    const { data: siswa } = await supabase
      .from("siswa")
      .select("*")
      .eq("tenant_id", TENANT_ID)
      .eq("wa_wali", waWali)
      .single();

    if (siswa) {
      setDataSiswa(siswa);

      const { data: bayar } = await supabase
        .from("pembayaran")
        .select("*")
        .eq("tenant_id", TENANT_ID)
        .eq("nama_anak", siswa.nama_anak)
        .order("created_at", { ascending: false });

      if (bayar) setRiwayatBayar(bayar);

      const { data: jurnal } = await supabase
        .from("jurnal")
        .select("*")
        .eq("tenant_id", TENANT_ID)
        .eq("nama_anak", siswa.nama_anak)
        .order("created_at", { ascending: false });

      if (jurnal) setRiwayatJurnal(jurnal);

      const { data: tabungan } = await supabase
        .from("tabungan")
        .select("*")
        .eq("tenant_id", TENANT_ID)
        .eq("nama_anak", siswa.nama_anak);

      if (tabungan) {
        let total = 0;
        tabungan.forEach((t: any) => {
          if (t.jenis === "setor") total += Number(t.nominal);
          else total -= Number(t.nominal);
        });
        setSaldoTabunganTotal(total);
      }

      const { data: rapor } = await supabase
        .from("rapor")
        .select("*")
        .eq("tenant_id", TENANT_ID)
        .eq("nama_anak", siswa.nama_anak)
        .single();

      if (rapor) setFileRaporUrl(rapor.file_url);
    }
  };

  useEffect(() => {
    syncDataWali();
    const interval = setInterval(syncDataWali, 3000);
    return () => clearInterval(interval);
  }, [waWali, isLoggedIn]);

  const handleSubmitPPDB = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formPpdb.namaAnak || !formPpdb.nikAnak) return alert("Lengkapi nama dan NIK anak!");

    const { error } = await supabase.from("siswa").insert([
      {
        tenant_id: TENANT_ID,
        nama_anak: formPpdb.namaAnak,
        nik_anak: formPpdb.nikAnak,
        kelas_target: formPpdb.kelasTarget,
        tempat_lahir: formPpdb.tempatLahir,
        tanggal_lahir: formPpdb.tanggalLahir,
        alamat: formPpdb.alamat,
        nama_wali: namaWaliInput,
        wa_wali: waWali,
        nama_ayah: formPpdb.namaAyah,
        pekerjaan_ayah: formPpdb.pekerjaanAyah,
        nama_ibu: formPpdb.namaIbu,
        pekerjaan_ibu: formPpdb.pekerjaanIbu,
        status: "TERDAFTAR (Menunggu Pembayaran / Verifikasi TU)",
      },
    ]);

    if (!error) {
      alert("Formulir PPDB Berhasil Dikirim! Silakan lakukan pembayaran pendaftaran.");
      syncDataWali();
      setActiveTab("kartu");
    }
  };

  const handleKirimPembayaran = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dataSiswa) return alert("Data siswa tidak ditemukan! Selesaikan pendaftaran PPDB dulu.");

    const { error } = await supabase.from("pembayaran").insert([
      {
        tenant_id: TENANT_ID,
        nama_anak: dataSiswa.nama_anak,
        wali: waWali,
        jenis: jenisBayar,
        nominal: Number(nominalBayar),
        bukti_url: buktiBayarUrl || "https://via.placeholder.com/150",
        status: "pending",
      },
    ]);

    if (!error) {
      alert("Konfirmasi pembayaran terkirim ke TU! Menunggu verifikasi Kuitansi.");
      setNominalBayar("");
      setBuktiBayarUrl("");
      syncDataWali();
    }
  };

  const handleKirimInfaq = (e: React.FormEvent) => {
    e.preventDefault();
    setPesanInfaq("Assalamualaikum, terima kasih Bunda/Ayah sudah berinfaq hari ini. Semoga kebaikan kita diterima Allah Subhanahu wa Ta'ala, jazakallah khairan.");
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
        <div className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-md border">
          <div className="bg-teal-700 text-white p-4 rounded-xl text-center mb-6">
            <h1 className="font-bold text-lg">Login Portal Wali Murid</h1>
            <p className="text-xs text-teal-100">TK 'Aisyiyah Bustanul Athfal Sadirejo</p>
          </div>
          <form onSubmit={(e) => { e.preventDefault(); setIsLoggedIn(true); }} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Nama Lengkap Wali</label>
              <input type="text" placeholder="Masukkan Nama Wali" value={namaWaliInput} onChange={(e) => setNamaWaliInput(e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm" required />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Nomor WhatsApp Wali</label>
              <input type="text" placeholder="Contoh: 08123456789" value={waWali} onChange={(e) => setWaWali(e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm" required />
            </div>
            <button type="submit" className="w-full bg-teal-700 hover:bg-teal-800 text-white font-semibold py-2.5 rounded-lg text-sm">Masuk Portal Wali</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 p-4 pb-12">
      <div className="max-w-3xl mx-auto space-y-4">
        <div className="bg-teal-800 text-white p-4 rounded-2xl flex justify-between items-center shadow">
          <div>
            <h1 className="font-bold text-base">Portal Wali Murid</h1>
            <p className="text-xs text-teal-100">Selamat Datang, {namaWaliInput} ({waWali})</p>
          </div>
          <button onClick={() => setIsLoggedIn(false)} className="bg-teal-900 px-3 py-1.5 rounded-lg text-xs font-semibold">Keluar</button>
        </div>

        <div className="bg-white p-2 rounded-2xl border shadow-sm flex flex-wrap gap-1">
          <button onClick={() => setActiveTab("kartu")} className={`flex-1 min-w-[70px] py-2 text-xs font-bold rounded-xl ${activeTab === "kartu" ? "bg-teal-700 text-white" : "text-slate-600"}`}>🪪 Kartu</button>
          <button onClick={() => setActiveTab("ppdb")} className={`flex-1 min-w-[70px] py-2 text-xs font-bold rounded-xl ${activeTab === "ppdb" ? "bg-teal-700 text-white" : "text-slate-600"}`}>📄 PPDB</button>
          <button onClick={() => setActiveTab("bayar")} className={`flex-1 min-w-[70px] py-2 text-xs font-bold rounded-xl ${activeTab === "bayar" ? "bg-teal-700 text-white" : "text-slate-600"}`}>💳 Bayar</button>
          <button onClick={() => setActiveTab("infaq")} className={`flex-1 min-w-[70px] py-2 text-xs font-bold rounded-xl ${activeTab === "infaq" ? "bg-teal-700 text-white" : "text-slate-600"}`}>🎁 Infaq</button>
          <button onClick={() => setActiveTab("jurnal")} className={`flex-1 min-w-[70px] py-2 text-xs font-bold rounded-xl ${activeTab === "jurnal" ? "bg-teal-700 text-white" : "text-slate-600"}`}>📖 Jurnal</button>
          <button onClick={() => setActiveTab("tabungan")} className={`flex-1 min-w-[70px] py-2 text-xs font-bold rounded-xl ${activeTab === "tabungan" ? "bg-teal-700 text-white" : "text-slate-600"}`}>💰 Tabungan</button>
          <button onClick={() => setActiveTab("rapor")} className={`flex-1 min-w-[70px] py-2 text-xs font-bold rounded-xl ${activeTab === "rapor" ? "bg-teal-700 text-white" : "text-slate-600"}`}>📂 e-Rapor</button>
        </div>

        {activeTab === "kartu" && (
          <div className="bg-white p-5 rounded-2xl border shadow-sm space-y-4">
            <h2 className="text-sm font-bold text-slate-800">Kartu Siswa Digital & Status Akademik Real-Time</h2>
            {dataSiswa ? (
              <div className="bg-gradient-to-r from-teal-800 to-emerald-900 text-white p-5 rounded-2xl shadow-md space-y-3">
                <div className="flex justify-between items-center border-b border-teal-600 pb-2">
                  <span className="font-bold text-xs tracking-wide">TK 'AISYIYAH SADIREJO</span>
                  <span className="text-[10px] bg-teal-700 px-2 py-0.5 rounded-full font-semibold">T.A. 2026/2027</span>
                </div>
                <div>
                  <p className="text-[10px] text-teal-200 uppercase font-semibold">Nama Siswa</p>
                  <p className="font-bold text-sm md:text-base">{dataSiswa.nama_anak}</p>
                  <p className="text-xs text-teal-100">Target: {dataSiswa.kelas_target} | NIK: {dataSiswa.nik_anak}</p>
                </div>
                <div className="pt-2">
                  <p className="text-[10px] text-teal-200 uppercase font-semibold mb-1">Status Pendaftaran / Akademik:</p>
                  <span className="inline-block bg-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow">
                    {dataSiswa.status}
                  </span>
                </div>
              </div>
            ) : (
              <div className="text-center py-6 text-xs text-slate-500">
                Belum ada data pendaftaran. Silakan isi form pada tab <b>PPDB</b>.
              </div>
            )}
          </div>
        )}

        {activeTab === "ppdb" && (
          <form onSubmit={handleSubmitPPDB} className="bg-white p-5 rounded-2xl border shadow-sm space-y-3">
            <h2 className="text-sm font-bold text-slate-800">Formulir Pendaftaran Siswa Baru (PPDB)</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input type="text" placeholder="Nama Lengkap Anak" value={formPpdb.namaAnak} onChange={(e) => setFormPpdb({ ...formPpdb, namaAnak: e.target.value })} className="p-2 border rounded-xl text-xs" required />
              <input type="text" placeholder="16 Digit NIK Anak" value={formPpdb.nikAnak} onChange={(e) => setFormPpdb({ ...formPpdb, nikAnak: e.target.value })} className="p-2 border rounded-xl text-xs" required />
              <select value={formPpdb.kelasTarget} onChange={(e) => setFormPpdb({ ...formPpdb, kelasTarget: e.target.value })} className="p-2 border rounded-xl text-xs">
                <option value="Kelas A">Kelas A</option>
                <option value="Kelas B">Kelas B</option>
              </select>
              <input type="text" placeholder="Tempat Lahir" value={formPpdb.tempatLahir} onChange={(e) => setFormPpdb({ ...formPpdb, tempatLahir: e.target.value })} className="p-2 border rounded-xl text-xs" />
              <input type="date" value={formPpdb.tanggalLahir} onChange={(e) => setFormPpdb({ ...formPpdb, tanggalLahir: e.target.value })} className="p-2 border rounded-xl text-xs" />
              <input type="text" placeholder="Alamat Domisili" value={formPpdb.alamat} onChange={(e) => setFormPpdb({ ...formPpdb, alamat: e.target.value })} className="p-2 border rounded-xl text-xs" />
              <input type="text" placeholder="Nama Ayah" value={formPpdb.namaAyah} onChange={(e) => setFormPpdb({ ...formPpdb, namaAyah: e.target.value })} className="p-2 border rounded-xl text-xs" />
              <input type="text" placeholder="Pekerjaan Ayah" value={formPpdb.pekerjaanAyah} onChange={(e) => setFormPpdb({ ...formPpdb, pekerjaanAyah: e.target.value })} className="p-2 border rounded-xl text-xs" />
              <input type="text" placeholder="Nama Ibu" value={formPpdb.namaIbu} onChange={(e) => setFormPpdb({ ...formPpdb, namaIbu: e.target.value })} className="p-2 border rounded-xl text-xs" />
              <input type="text" placeholder="Pekerjaan Ibu" value={formPpdb.pekerjaanIbu} onChange={(e) => setFormPpdb({ ...formPpdb, pekerjaanIbu: e.target.value })} className="p-2 border rounded-xl text-xs" />
            </div>
            <button type="submit" className="w-full bg-teal-700 hover:bg-teal-800 text-white py-2.5 rounded-xl text-xs font-bold shadow">
              🚀 Kirim Formulir Pendaftaran PPDB
            </button>
          </form>
        )}

        {activeTab === "bayar" && (
          <div className="space-y-4">
            <form onSubmit={handleKirimPembayaran} className="bg-white p-5 rounded-2xl border shadow-sm space-y-3">
              <h2 className="text-sm font-bold text-slate-800">Pembayaran (SPP, Pendaftaran, & Kegiatan)</h2>
              <select value={jenisBayar} onChange={(e) => setJenisBayar(e.target.value)} className="w-full p-2 border rounded-xl text-xs bg-white">
                <option value="SPP Bulanan">SPP Bulanan</option>
                <option value="Biaya Pendaftaran">Biaya Pendaftaran (Bisa Dicicil 2x 50%)</option>
                <option value="Biaya Kegiatan">Biaya Kegiatan Sekolah</option>
              </select>
              <input type="number" placeholder="Nominal Bayar Rp" value={nominalBayar} onChange={(e) => setNominalBayar(e.target.value)} className="w-full p-2 border rounded-xl text-xs" required />
              <input type="text" placeholder="Link Bukti Transfer (URL)" value={buktiBayarUrl} onChange={(e) => setBuktiBayarUrl(e.target.value)} className="w-full p-2 border rounded-xl text-xs" />
              <button type="submit" className="w-full bg-teal-700 hover:bg-teal-800 text-white py-2.5 rounded-xl text-xs font-bold shadow">
                📤 Kirim Konfirmasi Pembayaran
              </button>
            </form>

            <div className="bg-white p-5 rounded-2xl border shadow-sm space-y-3">
              <h2 className="text-sm font-bold text-slate-800">Riwayat & Bukti Kuitansi Resmi</h2>
              {riwayatBayar.map((b) => (
                <div key={b.id} className="p-4 border rounded-xl bg-slate-50 space-y-2">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-bold text-xs">{b.jenis}</p>
                      <p className="text-xs text-emerald-700 font-bold">Rp {Number(b.nominal).toLocaleString("id-ID")}</p>
                    </div>
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${b.status === "verified" ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"}`}>
                      {b.status === "verified" ? "✓ Verified" : "Menunggu Verifikasi TU"}
                    </span>
                  </div>

                  {b.status === "verified" && (
                    <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-xl text-xs text-emerald-900 space-y-1">
                      <p className="font-bold">📜 KUITANSI RESMI SEKOLAH</p>
                      <p>
                        Assalamualaikum Wr. Wb. Terima kasih Bunda/Ayah telah melakukan pembayaran <b>{b.jenis}</b> sebesar <b>Rp {Number(b.nominal).toLocaleString("id-ID")}</b>.
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "infaq" && (
          <form onSubmit={handleKirimInfaq} className="bg-white p-5 rounded-2xl border shadow-sm space-y-3">
            <h2 className="text-sm font-bold text-slate-800">Setor Infaq Sekolah</h2>
            <input type="number" placeholder="Nominal Infaq Rp" className="w-full p-2 border rounded-xl text-xs" required />
            <button type="submit" className="w-full bg-teal-700 hover:bg-teal-800 text-white py-2.5 rounded-xl text-xs font-bold shadow">
              🎁 Setor Infaq
            </button>
            {pesanInfaq && (
              <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl text-xs text-emerald-900 font-medium">
                {pesanInfaq}
              </div>
            )}
          </form>
        )}

        {activeTab === "jurnal" && (
          <div className="bg-white p-5 rounded-2xl border shadow-sm space-y-3">
            <h2 className="text-sm font-bold text-slate-800">Jurnal Aktivitas Harian Anak (Inputan Guru)</h2>
            {riwayatJurnal.map((j, i) => (
              <div key={i} className="p-3 border rounded-xl bg-slate-50 space-y-1">
                <p className="font-bold text-xs text-teal-800">{j.tanggal}</p>
                <div className="flex flex-wrap gap-1">
                  {j.aktivitas?.map((akt: string, idx: number) => (
                    <span key={idx} className="bg-teal-100 text-teal-800 text-[10px] font-semibold px-2 py-0.5 rounded-md">
                      ✓ {akt}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "tabungan" && (
          <div className="bg-white p-5 rounded-2xl border shadow-sm space-y-3 text-center py-6">
            <h2 className="text-sm font-bold text-slate-800">Total Saldo Tabungan Siswa</h2>
            <p className="text-2xl font-bold text-emerald-700">Rp {saldoTabunganTotal.toLocaleString("id-ID")}</p>
            <p className="text-xs text-slate-400">Diakumulasi dari setoran harian yang dicatat oleh Guru Kelas.</p>
          </div>
        )}

        {activeTab === "rapor" && (
          <div className="bg-white p-5 rounded-2xl border shadow-sm space-y-3 text-center py-6">
            <h2 className="text-sm font-bold text-slate-800">Dokumen e-Rapor Perkembangan Anak</h2>
            {fileRaporUrl ? (
              <a href={fileRaporUrl} target="_blank" rel="noreferrer" className="inline-block bg-teal-700 text-white text-xs px-4 py-2 rounded-xl font-bold shadow">
                📥 Unduh / Lihat File PDF e-Rapor
              </a>
            ) : (
              <p className="text-xs text-slate-400">Dokumen e-Rapor semester ini belum di-upload oleh Guru Kelas.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}