"use client";

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://tncvbyhgsjtoswlyxcrl.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function PortalGuru() {
  const TENANT_ID = "aba-sadirejo";

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [nip, setNip] = useState("");
  const [password, setPassword] = useState("");

  const [tahunAjaran, setTahunAjaran] = useState("2026/2027");
  const [filterKelas, setFilterKelas] = useState("Kelas A");

  const [activeTab, setActiveTab] = useState<"jurnal" | "tabungan" | "rapor">("jurnal");

  const [daftarSiswa, setDaftarSiswa] = useState<any[]>([]);
  const [selectedSiswa, setSelectedSiswa] = useState("");

  // Form Jurnal & Tabungan
  const [tanggalJurnal, setTanggalJurnal] = useState(new Date().toISOString().split("T")[0]);
  const [nominalTabungan, setNominalTabungan] = useState("");

  const fetchSiswaGuru = async () => {
    const { data } = await supabase
      .from("siswa")
      .select("*")
      .eq("tenant_id", TENANT_ID)
      .eq("kelas_target", filterKelas);

    if (data) setDaftarSiswa(data);
  };

  useEffect(() => {
    fetchSiswaGuru();
  }, [filterKelas, isLoggedIn]);

  const handleSimpanJurnal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSiswa) return alert("Pilih nama siswa terlebih dahulu!");

    const { error } = await supabase.from("jurnal").insert([
      {
        tenant_id: TENANT_ID,
        nama_anak: selectedSiswa,
        kelas: filterKelas,
        tanggal: tanggalJurnal,
        aktivitas: ["Sholat Dhuha Berjamaah", "Muraja'ah Hafalan", "Membaca & Menghitung"],
        tahun_ajaran: tahunAjaran,
      },
    ]);

    if (!error) alert(`Jurnal ${selectedSiswa} tersimpan di Supabase Cloud & terkirim ke Wali!`);
  };

  const handleSimpanTabungan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSiswa || !nominalTabungan) return alert("Isi nama siswa dan nominal!");

    const { error } = await supabase.from("tabungan").insert([
      {
        tenant_id: TENANT_ID,
        nama_anak: selectedSiswa,
        kelas: filterKelas,
        tanggal: tanggalJurnal,
        nominal: Number(nominalTabungan),
        jenis: "setor",
        tahun_ajaran: tahunAjaran,
      },
    ]);

    if (!error) {
      alert(`Setoran tabungan Rp ${Number(nominalTabungan).toLocaleString("id-ID")} tersimpan di Supabase Cloud!`);
      setNominalTabungan("");
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
        <div className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-md border">
          <div className="bg-emerald-800 text-white p-4 rounded-xl text-center mb-6">
            <h1 className="font-bold text-lg">Login Portal Guru (Supabase Connected)</h1>
          </div>
          <form onSubmit={(e) => { e.preventDefault(); setIsLoggedIn(true); }} className="space-y-4">
            <input type="text" placeholder="NIP / NBM Guru" value={nip} onChange={(e) => setNip(e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm" required />
            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm" required />
            <button type="submit" className="w-full bg-emerald-800 text-white font-semibold py-2.5 rounded-lg text-sm">Masuk Portal Guru</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 p-4">
      <div className="max-w-3xl mx-auto space-y-4">
        <div className="bg-emerald-800 text-white p-4 rounded-2xl flex justify-between items-center">
          <h1 className="font-bold text-base">Portal Guru Kelas (Supabase Cloud)</h1>
          <button onClick={() => setIsLoggedIn(false)} className="bg-emerald-900 px-3 py-1.5 rounded-lg text-xs font-semibold">Keluar</button>
        </div>

        <div className="bg-white p-4 rounded-2xl border space-y-3">
          <div className="flex gap-2">
            <button onClick={() => setFilterKelas("Kelas A")} className={`flex-1 py-2 rounded-xl text-xs font-bold ${filterKelas === "Kelas A" ? "bg-emerald-700 text-white" : "bg-slate-100"}`}>Kelas A</button>
            <button onClick={() => setFilterKelas("Kelas B")} className={`flex-1 py-2 rounded-xl text-xs font-bold ${filterKelas === "Kelas B" ? "bg-emerald-700 text-white" : "bg-slate-100"}`}>Kelas B</button>
          </div>

          <select value={selectedSiswa} onChange={(e) => setSelectedSiswa(e.target.value)} className="w-full p-2 border rounded-xl text-xs font-bold">
            <option value="">-- Pilih Siswa ({daftarSiswa.length} Siswa Terdaftar) --</option>
            {daftarSiswa.map((s, i) => (
              <option key={i} value={s.nama_anak}>{s.nama_anak} - Wali: {s.nama_wali}</option>
            ))}
          </select>
        </div>

        <div className="bg-white p-2 rounded-2xl border flex gap-1">
          <button onClick={() => setActiveTab("jurnal")} className={`flex-1 py-2 text-xs font-semibold rounded-xl ${activeTab === "jurnal" ? "bg-emerald-700 text-white" : "text-slate-600"}`}>📖 Jurnal</button>
          <button onClick={() => setActiveTab("tabungan")} className={`flex-1 py-2 text-xs font-semibold rounded-xl ${activeTab === "tabungan" ? "bg-emerald-700 text-white" : "text-slate-600"}`}>💰 Input Tabungan</button>
        </div>

        {activeTab === "jurnal" && (
          <form onSubmit={handleSimpanJurnal} className="bg-white p-5 rounded-2xl border space-y-3">
            <h2 className="text-sm font-bold">Input Jurnal Harian Siswa</h2>
            <input type="date" value={tanggalJurnal} onChange={(e) => setTanggalJurnal(e.target.value)} className="w-full p-2 border rounded-lg text-xs" />
            <button type="submit" className="w-full bg-emerald-700 text-white py-2 rounded-lg text-xs font-bold">💾 Simpan Jurnal ke Supabase Cloud</button>
          </form>
        )}

        {activeTab === "tabungan" && (
          <form onSubmit={handleSimpanTabungan} className="bg-white p-5 rounded-2xl border space-y-3">
            <h2 className="text-sm font-bold">Input Setoran Tabungan Siswa</h2>
            <input type="number" placeholder="Nominal Rp" value={nominalTabungan} onChange={(e) => setNominalTabungan(e.target.value)} className="w-full p-2 border rounded-lg text-xs font-bold" />
            <button type="submit" className="w-full bg-emerald-700 text-white py-2 rounded-lg text-xs font-bold">💾 Simpan Setoran ke Supabase Cloud</button>
          </form>
        )}
      </div>
    </div>
  );
}