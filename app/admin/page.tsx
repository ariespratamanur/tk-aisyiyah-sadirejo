"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '../supabase';

interface Pendaftar {
  id: string;
  created_at: string;
  nama_lengkap: string;
  tempat_lahir: string;
  tanggal_lahir: string;
  jenis_kelamin: string;
  alamat: string;
  nama_ortu: string;
  no_wa: string;
}

export default function AdminDashboard() {
  const [dataPendaftar, setDataPendaftar] = useState<Pendaftar[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMurid, setSelectedMurid] = useState<Pendaftar | null>(null);

  const fetchData = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('pendaftaran')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      alert('Gagal mengambil data: ' + error.message);
    } else {
      setDataPendaftar(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCetak = (murid: Pendaftar) => {
    setSelectedMurid(murid);
    setTimeout(() => {
      window.print();
    }, 300);
  };

  return (
    <div className="min-h-screen bg-slate-100 font-sans text-slate-800 print:bg-white print:p-0">
      {/* Header Admin (Sembunyi Saat Dicetak) */}
      <header className="bg-emerald-700 text-white p-4 shadow-md sticky top-0 z-10 print:hidden">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="text-xs bg-emerald-800 px-3 py-1.5 rounded-lg hover:bg-emerald-900 text-emerald-100">
              ← Ke Web Utama
            </Link>
            <h1 className="text-base font-bold">Dashboard Admin PPDB</h1>
          </div>
          <button 
            onClick={fetchData} 
            className="text-xs bg-emerald-600 hover:bg-emerald-500 text-white font-semibold px-3 py-1.5 rounded-lg shadow"
          >
            🔄 Refresh Data
          </button>
        </div>
      </header>

      {/* Konten Dashboard (Sembunyi Saat Dicetak) */}
      <main className="max-w-5xl mx-auto p-4 space-y-4 print:hidden">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <p className="text-xs font-semibold text-slate-500">Total Pendaftar</p>
            <p className="text-2xl font-bold text-emerald-600">{dataPendaftar.length} <span className="text-xs text-slate-400 font-normal">Siswa</span></p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <p className="text-xs font-semibold text-slate-500">Laki-Laki</p>
            <p className="text-2xl font-bold text-blue-600">
              {dataPendaftar.filter(m => m.jenis_kelamin === 'Laki-laki').length}
            </p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm col-span-2 md:col-span-1">
            <p className="text-xs font-semibold text-slate-500">Perempuan</p>
            <p className="text-2xl font-bold text-pink-600">
              {dataPendaftar.filter(m => m.jenis_kelamin === 'Perempuan').length}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-4 border-b bg-slate-50 flex justify-between items-center">
            <h2 className="text-sm font-bold text-slate-700">Daftar Calon Murid Baru</h2>
            <span className="text-xs bg-emerald-100 text-emerald-800 font-semibold px-2.5 py-0.5 rounded-full">
              Data Realtime Supabase
            </span>
          </div>

          {loading ? (
            <div className="p-8 text-center text-xs text-slate-500">Memuat data pendaftar...</div>
          ) : dataPendaftar.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-500">Belum ada data pendaftaran yang masuk.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-100 text-slate-600 font-semibold border-b">
                    <th className="p-3">No</th>
                    <th className="p-3">Tgl Daftar</th>
                    <th className="p-3">Nama Siswa</th>
                    <th className="p-3">TTL</th>
                    <th className="p-3">L/P</th>
                    <th className="p-3">Nama Orang Tua</th>
                    <th className="p-3">No. WA</th>
                    <th className="p-3 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {dataPendaftar.map((item, index) => (
                    <tr key={item.id} className="hover:bg-slate-50">
                      <td className="p-3 font-medium text-slate-500">{index + 1}</td>
                      <td className="p-3 text-slate-500">
                        {new Date(item.created_at).toLocaleDateString('id-ID')}
                      </td>
                      <td className="p-3 font-bold text-slate-800">{item.nama_lengkap}</td>
                      <td className="p-3 text-slate-600">{item.tempat_lahir}, {item.tanggal_lahir}</td>
                      <td className="p-3">{item.jenis_kelamin === 'Laki-laki' ? 'L' : 'P'}</td>
                      <td className="p-3 text-slate-700">{item.nama_ortu}</td>
                      <td className="p-3">
                        <a 
                          href={`https://wa.me/${item.no_wa.replace(/^0/, '62')}`} 
                          target="_blank" 
                          rel="noreferrer"
                          className="text-emerald-600 hover:underline font-semibold"
                        >
                          {item.no_wa}
                        </a>
                      </td>
                      <td className="p-3 text-center">
                        <button
                          onClick={() => handleCetak(item)}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-2.5 py-1 rounded shadow text-[11px] transition"
                        >
                          🖨️ Cetak / Simpan PDF
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* DOKUMEN CETAK FORMULIR (TAMPIL KHUSUS SAAT MODE CETAK/PRINT) */}
      {selectedMurid && (
        <div className="hidden print:block p-8 bg-white font-sans text-slate-800">
          <div className="border-b-2 border-slate-800 pb-3 mb-4 text-center">
            <h1 className="text-xl font-bold uppercase tracking-wide">RAUDHATUL AHFAL (RA) PERMANA</h1>
            <p className="text-xs text-slate-600">Formulir Penerimaan Peserta Didik Baru (PPDB) Tahun Ajaran 2026/2027</p>
            <p className="text-[10px] text-slate-500 italic">Jl. Pendidikan No. 123, Kota / Kabupaten, Indonesia</p>
          </div>

          <h2 className="text-center font-bold text-sm text-slate-800 underline mb-6">FORMULIR PENDAFTARAN SISWA BARU</h2>

          <table className="w-full text-xs mb-8 border-collapse">
            <tbody>
              <tr className="border-b">
                <td className="py-2.5 font-semibold w-1/3 text-slate-600">Nama Lengkap Siswa</td>
                <td className="py-2.5 font-bold text-slate-900">: {selectedMurid.nama_lengkap}</td>
              </tr>
              <tr className="border-b">
                <td className="py-2.5 font-semibold text-slate-600">Tempat, Tanggal Lahir</td>
                <td className="py-2.5 text-slate-900">: {selectedMurid.tempat_lahir}, {selectedMurid.tanggal_lahir}</td>
              </tr>
              <tr className="border-b">
                <td className="py-2.5 font-semibold text-slate-600">Jenis Kelamin</td>
                <td className="py-2.5 text-slate-900">: {selectedMurid.jenis_kelamin}</td>
              </tr>
              <tr className="border-b">
                <td className="py-2.5 font-semibold text-slate-600">Alamat Tempat Tinggal</td>
                <td className="py-2.5 text-slate-900">: {selectedMurid.alamat}</td>
              </tr>
              <tr className="border-b">
                <td className="py-2.5 font-semibold text-slate-600">Nama Orang Tua / Wali</td>
                <td className="py-2.5 text-slate-900">: {selectedMurid.nama_ortu}</td>
              </tr>
              <tr className="border-b">
                <td className="py-2.5 font-semibold text-slate-600">No. WhatsApp Aktif</td>
                <td className="py-2.5 text-slate-900">: {selectedMurid.no_wa}</td>
              </tr>
              <tr className="border-b">
                <td className="py-2.5 font-semibold text-slate-600">Tanggal Mendaftar</td>
                <td className="py-2.5 text-slate-900">: {new Date(selectedMurid.created_at).toLocaleString('id-ID')}</td>
              </tr>
            </tbody>
          </table>

          <div className="flex justify-between items-end mt-16 pt-6">
            <div className="w-28 h-36 border-2 border-dashed border-slate-400 flex items-center justify-center text-center p-2 text-[10px] text-slate-400 font-semibold">
              Pas Foto<br/>3 x 4<br/>Latar Merah
            </div>

            <div className="text-center text-xs space-y-16">
              <p>Panitia PPDB / Orang Tua Wali</p>
              <p className="font-bold underline text-slate-900">( ............................................ )</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}