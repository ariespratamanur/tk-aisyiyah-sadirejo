"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "@/supabase";

export default function PortalTU() {
  const TENANT_ID = "aba-sadirejo";

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [nbm, setNbm] = useState("");
  const [password, setPassword] = useState("");

  const [opsiTahunAjaran] = useState(["2026/2027", "2027/2028", "2028/2029"]);
  const [tahunAjaran, setTahunAjaran] = useState("2026/2027");
  const [filterKelasTagihan, setFilterKelasTagihan] = useState("SEMUA");
  const [filterKelasInfo, setFilterKelasInfo] = useState("SEMUA");
  const [searchQuery, setSearchQuery] = useState("");

  const [activeTab, setActiveTab] = useState<"ppdb" | "laporan" | "tabungan" | "rapor" | "tagihan" | "wa">("ppdb");

  const [daftarPPDB, setDaftarPPDB] = useState<any[]>([]);
  const [daftarPembayaran, setDaftarPembayaran] = useState<any[]>([]);
  const [rekapTabungan, setRekapTabungan] = useState<any[]>([]);

  // Form Tagihan WA & Info
  const [siswaTargetTagihan, setSiswaTargetTagihan] = useState("");
  const [jenisTagihanInput, setJenisTagihanInput] = useState("SPP Bulanan");
  const [nominalTagihanInput, setNominalTagihanInput] = useState("");

  const syncTUSupabase = async () => {
    // 1. Fetch Siswa
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
          kelasTarget: s.kelas_target,
          status: s.status,
          tahunAjaran: s.tahun_ajaran,
          namaWali: s.nama_wali,
          waWali: s.wa_wali,
        }))
      );
    }

    // 2. Fetch Pembayaran
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

    // 3. Fetch Tabungan
    const { data: tabunganData } = await supabase
      .from("tabungan")
      .select("*")
      .eq("tenant_id", TENANT_ID);

    if (tabunganData) {
      setRekapTabungan(
        tabunganData.map((t: any) => ({
          namaAnak: t.nama_anak,
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

  const handleVerifikasiBayar = async (idPembayaran: number) => {
    const { error } = await supabase
      .from("pembayaran")
      .update({ status: "verified" })
      .eq("id", idPembayaran);

    if (!error) {
      alert("Pembayaran berhasil diverifikasi di Supabase Cloud & Kuitansi terbit di Portal Wali!");
      syncTUSupabase();
    }
  };

  const handleUpdateStatusSiswa = async (idSiswa: number, statusBaru: string) => {
    const { error } = await supabase
      .from("siswa")
      .update({ status: statusBaru })
      .eq("id", idSiswa);

    if (!error) {
      alert(`Status Siswa berhasil di-update menjadi: ${statusBaru}`);
      syncTUSupabase();
    }
  };

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
        <div className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-md border">
          <div className="bg-orange-600 text-white p-4 rounded-xl text-center mb-6">
            <h1 className="font-bold text-lg">Login Portal TU (Supabase Connected)</h1>
          </div>
          <form onSubmit={(e) => { e.preventDefault(); setIsLoggedIn(true); }} className="space-y-4">
            <input type="text" placeholder="NBM" value={nbm} onChange={(e) => setNbm(e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm" required />
            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm" required />
            <button type="submit" className="w-full bg-orange-600 text-white font-semibold py-2.5 rounded-lg text-sm">Masuk Portal TU</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 p-4">
      <div className="max-w-4xl mx-auto space-y-4">
        <div className="bg-orange-600 text-white p-4 rounded-2xl flex justify-between items-center">
          <div>
            <h1 className="font-bold text-base">Portal Tata Usaha (TU)</h1>
            <p className="text-xs text-orange-100">Tenant: TK 'Aisyiyah Sadirejo</p>
          </div>
          <button onClick={() => setIsLoggedIn(false)} className="bg-orange-800 px-3 py-1.5 rounded-lg text-xs font-semibold">Keluar</button>
        </div>

        {/* Tab Navigasi */}
        <div className="bg-white p-2 rounded-2xl shadow-sm border flex flex-wrap gap-1">
          <button onClick={() => setActiveTab("ppdb")} className={`flex-1 py-2 text-xs font-semibold rounded-xl ${activeTab === "ppdb" ? "bg-orange-600 text-white" : "text-slate-600"}`}>📄 PPDB ({daftarPPDB.length})</button>
          <button onClick={() => setActiveTab("laporan")} className={`flex-1 py-2 text-xs font-semibold rounded-xl ${activeTab === "laporan" ? "bg-orange-600 text-white" : "text-slate-600"}`}>📊 Uang Masuk</button>
          <button onClick={() => setActiveTab("tabungan")} className={`flex-1 py-2 text-xs font-semibold rounded-xl ${activeTab === "tabungan" ? "bg-orange-600 text-white" : "text-slate-600"}`}>💰 Saldo Tabungan</button>
        </div>

        {/* Tab PPDB */}
        {activeTab === "ppdb" && (
          <div className="bg-white p-5 rounded-2xl border space-y-3">
            <h2 className="text-sm font-bold text-slate-800">Verifikasi Data Siswa Supabase Cloud</h2>
            {daftarPPDB.map((siswa) => (
              <div key={siswa.id} className="p-4 border rounded-xl bg-slate-50 flex justify-between items-center">
                <div>
                  <p className="font-bold text-xs">{siswa.namaAnak} ({siswa.kelasTarget})</p>
                  <p className="text-[11px] text-slate-500">Wali: {siswa.namaWali} ({siswa.waWali})</p>
                  <span className="text-[10px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full font-bold">{siswa.status}</span>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => handleUpdateStatusSiswa(siswa.id, "AKTIF (LUNAS 100%)")} className="bg-emerald-600 text-white text-[10px] px-2.5 py-1.5 rounded-lg font-bold">✓ Set AKTIF</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab Laporan Uang Masuk */}
        {activeTab === "laporan" && (
          <div className="bg-white p-5 rounded-2xl border space-y-3">
            <h2 className="text-sm font-bold text-slate-800">Laporan Bukti Pembayaran (Supabase Cloud)</h2>
            {daftarPembayaran.map((p) => (
              <div key={p.id} className="p-4 border rounded-xl bg-slate-50 flex justify-between items-center">
                <div>
                  <p className="font-bold text-xs">{p.jenis} - Wali: {p.wali}</p>
                  <p className="text-xs text-emerald-700 font-bold">Rp {Number(p.nominal).toLocaleString("id-ID")}</p>
                </div>
                {p.status === "verified" ? (
                  <span className="bg-emerald-100 text-emerald-800 text-xs px-3 py-1.5 rounded-xl font-bold">✓ Verified</span>
                ) : (
                  <button onClick={() => handleVerifikasiBayar(p.id)} className="bg-emerald-600 text-white text-xs px-3 py-1.5 rounded-xl font-bold">✓ Cek & Terbit Kuitansi</button>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Tab Saldo Tabungan */}
        {activeTab === "tabungan" && (
          <div className="bg-white p-5 rounded-2xl border space-y-3">
            <h2 className="text-sm font-bold text-slate-800">Rekap Saldo Tabungan Siswa</h2>
            {Object.entries(hitungSaldoPerAnak()).map(([nama, saldo], idx) => (
              <div key={idx} className="p-3 border rounded-xl bg-slate-50 flex justify-between">
                <span className="font-bold text-xs">{nama}</span>
                <span className="font-bold text-xs text-emerald-800">Rp {saldo.toLocaleString("id-ID")}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}