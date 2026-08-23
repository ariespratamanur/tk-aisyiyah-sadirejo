"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '../supabase';

interface TagihanKegiatan {
  id: string;
  nama_kegiatan: string;
  nominal: number;
  nama_siswa: string;
  status: string;
}

interface Agenda {
  id: string;
  tanggal: string;
  nama_agenda: string;
  kategori: string;
  keterangan: string;
}

export default function KegiatanPage() {
  const [userRole, setUserRole] = useState<string | null>(null);
  const [listTagihan, setListTagihan] = useState<TagihanKegiatan[]>([]);
  const [listAgenda, setListAgenda] = useState<Agenda[]>([]);
  const [loading, setLoading] = useState(true);

  // Form Pencarian & Bayar Ortua
  const [searchName, setSearchName] = useState('');
  const [selectedTagihan, setSelectedTagihan] = useState<TagihanKegiatan | null>(null);

  // Form Admin (Buat Tagihan Baru)
  const [namaKegiatan, setNamaKegiatan] = useState('');
  const [nominal, setNominal] = useState('');
  const [namaSiswa, setNamaSiswa] = useState('');

  // Form Admin (Tambah Agenda Kalender)
  const [tglAgenda, setTglAgenda] = useState('');
  const [judulAgenda, setJudulAgenda] = useState('');
  const [kategoriAgenda, setKategoriAgenda] = useState('Kegiatan');

  useEffect(() => {
    setUserRole(localStorage.getItem('userRole'));
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const { data: dataTagihan } = await supabase.from('kegiatan_tagihan').select('*').order('created_at', { ascending: false });
    const { data: dataAgenda } = await supabase.from('kalender_sekolah').select('*').order('tanggal', { ascending: true });

    if (dataTagihan) setListTagihan(dataTagihan);
    if (dataAgenda) setListAgenda(dataAgenda);
    setLoading(false);
  };

  // Handler Admin Buat Tagihan
  const handleTambahTagihan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!namaKegiatan || !nominal || !namaSiswa) return alert('Lengkapi semua field!');

    const { error } = await supabase.from('kegiatan_tagihan').insert([
      { nama_kegiatan: namaKegiatan, nominal: parseInt(nominal), nama_siswa: namaSiswa }
    ]);

    if (!error) {
      alert('Tagihan kegiatan berhasil diterbitkan!');
      setNamaKegiatan(''); setNominal(''); setNamaSiswa('');
      fetchData();
    }
  };

  // Handler Admin Tambah Kalender
  const handleTambahAgenda = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tglAgenda || !judulAgenda) return alert('Lengkapi tanggal dan agenda!');

    const { error } = await supabase.from('kalender_sekolah').insert([
      { tanggal: tglAgenda, nama_agenda: judulAgenda, kategori: kategoriAgenda }
    ]);

    if (!error) {
      alert('Agenda kalender berhasil ditambahkan!');
      setTglAgenda(''); setJudulAgenda('');
      fetchData();
    }
  };

  // Update Status Lunas (Admin)
  const handleSetLunas = async (id: string) => {
    const { error } = await supabase.from('kegiatan_tagihan').update({ status: 'LUNAS', tanggal_bayar: new Date().toISOString() }).eq('id', id);
    if (!error) {
      alert('Status berhasil diubah menjadi LUNAS!');
      fetchData();
    }
  };

  const filteredTagihan = listTagihan.filter((t) =>
    t.nama_siswa.toLowerCase().includes(searchName.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 pb-12">
      <header className="bg-emerald-600 text-white p-4 shadow-md sticky top-0 z-10">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <Link href="/" className="text-xs bg-emerald-700 hover:bg-emerald-800 text-emerald-100 px-3 py-1.5 rounded-lg font-semibold">
            ← Kembali
          </Link>
          <h1 className="text-base font-bold">Kegiatan & Kalender RA</h1>
          <div className="w-12"></div>
        </div>
      </header>

      <main className="max-w-md mx-auto p-4 space-y-6">

        {/* SECTION 1: KALENDER AKADEMIK & AGENDA */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 space-y-3">
          <h2 className="text-xs font-bold text-slate-800 border-b pb-2 flex items-center gap-2">
            <span>📅</span> Kalender Kegiatan & Agenda RA
          </h2>

          {/* Form Admin Add Agenda */}
          {userRole === 'admin' && (
            <form onSubmit={handleTambahAgenda} className="bg-emerald-50 p-3 rounded-xl space-y-2 text-xs border border-emerald-100">
              <p className="font-bold text-emerald-900">+ Tambah Agenda Baru</p>
              <input type="date" required value={tglAgenda} onChange={(e) => setTglAgenda(e.target.value)} className="w-full p-2 border rounded-lg" />
              <input type="text" placeholder="Nama Agenda (misal: Manasik Haji)" required value={judulAgenda} onChange={(e) => setJudulAgenda(e.target.value)} className="w-full p-2 border rounded-lg" />
              <select value={kategoriAgenda} onChange={(e) => setKategoriAgenda(e.target.value)} className="w-full p-2 border rounded-lg">
                <option value="Kegiatan">Kegiatan Siswa</option>
                <option value="Libur">Libur Sekolah</option>
                <option value="Ujian">Evaluasi / Rapor</option>
              </select>
              <button type="submit" className="w-full bg-emerald-600 text-white py-2 rounded-lg font-bold">Simpan Agenda</button>
            </form>
          )}

          {/* List Agenda */}
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {listAgenda.length === 0 ? (
              <p className="text-center text-xs text-slate-400 py-2">Belum ada agenda terdekat.</p>
            ) : (
              listAgenda.map((ag) => (
                <div key={ag.id} className="flex justify-between items-center p-2.5 bg-slate-50 border rounded-xl text-xs">
                  <div>
                    <p className="font-bold text-slate-800">{ag.nama_agenda}</p>
                    <p className="text-[10px] text-slate-500">📅 {ag.tanggal}</p>
                  </div>
                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${ag.kategori === 'Libur' ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-800'}`}>
                    {ag.kategori}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* SECTION 2: TAGIHAN KEGIATAN (NON-SPP) */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 space-y-3">
          <h2 className="text-xs font-bold text-slate-800 border-b pb-2 flex items-center gap-2">
            <span>💳</span> Tagihan Kegiatan (Manasik, Wisuda, Seragam, dll)
          </h2>

          {/* Form Admin Add Tagihan Non-SPP */}
          {userRole === 'admin' && (
            <form onSubmit={handleTambahTagihan} className="bg-blue-50 p-3 rounded-xl space-y-2 text-xs border border-blue-100">
              <p className="font-bold text-blue-900">+ Buat Tagihan Kegiatan Baru</p>
              <input type="text" placeholder="Nama Kegiatan (misal: Manasik Haji)" required value={namaKegiatan} onChange={(e) => setNamaKegiatan(e.target.value)} className="w-full p-2 border rounded-lg" />
              <input type="number" placeholder="Nominal (misal: 460000)" required value={nominal} onChange={(e) => setNominal(e.target.value)} className="w-full p-2 border rounded-lg" />
              <input type="text" placeholder="Nama Siswa" required value={namaSiswa} onChange={(e) => setNamaSiswa(e.target.value)} className="w-full p-2 border rounded-lg" />
              <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-lg font-bold">Terbit Tagihan</button>
            </form>
          )}

          {/* Pencarian Orang Tua */}
          <input
            type="text"
            placeholder="🔍 Cari nama siswa untuk melihat tagihan..."
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            className="w-full p-2 text-xs border rounded-lg focus:outline-emerald-600"
          />

          {/* Daftar Tagihan Non-SPP */}
          <div className="space-y-2">
            {filteredTagihan.length === 0 ? (
              <p className="text-center text-xs text-slate-400 py-3">Tidak ada data tagihan kegiatan.</p>
            ) : (
              filteredTagihan.map((item) => (
                <div key={item.id} className="p-3 border rounded-xl bg-slate-50 space-y-2 text-xs">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-bold text-slate-800">{item.nama_siswa}</p>
                      <p className="text-[11px] text-emerald-700 font-medium">{item.nama_kegiatan}</p>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${item.status === 'LUNAS' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                      {item.status}
                    </span>
                  </div>

                  <div className="flex justify-between items-center pt-2 border-t border-slate-200">
                    <div>
                      <p className="text-[10px] text-slate-400">Total Tagihan:</p>
                      <p className="font-bold text-slate-900">Rp {(item.nominal + 2000).toLocaleString('id-ID')}</p>
                      <p className="text-[9px] text-slate-400">*inc. admin Rp 2.000</p>
                    </div>

                    {item.status === 'BELUM LUNAS' && (
                      <button
                        onClick={() => setSelectedTagihan(item)}
                        className="bg-emerald-600 text-white px-3 py-1.5 rounded-lg font-bold text-[11px]"
                      >
                        Bayar Sekarang
                      </button>
                    )}

                    {userRole === 'admin' && item.status === 'BELUM LUNAS' && (
                      <button
                        onClick={() => handleSetLunas(item.id)}
                        className="bg-blue-600 text-white px-2 py-1 rounded text-[10px] font-bold ml-2"
                      >
                        Set Lunas
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* MODAL QRIS PEMBAYARAN BIAYA LAIN-LAIN */}
        {selectedTagihan && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white p-5 rounded-2xl max-w-xs w-full space-y-3 text-center text-xs">
              <h3 className="font-bold text-slate-800 text-sm">Pembayaran {selectedTagihan.nama_kegiatan}</h3>
              <p className="text-slate-500">Siswa: <b>{selectedTagihan.nama_siswa}</b></p>
              
              <div className="bg-slate-100 p-3 rounded-xl space-y-1">
                <p className="text-[10px] text-slate-500">Total Pembayaran (+Admin Rp 2.000):</p>
                <p className="text-lg font-bold text-emerald-600">Rp {(selectedTagihan.nominal + 2000).toLocaleString('id-ID')}</p>
              </div>

              <div className="bg-white p-2 border rounded-xl">
                <img src="/qris.jpg" alt="QRIS" className="w-48 h-48 mx-auto object-contain" />
                <p className="text-[10px] text-slate-400 mt-1">Scan via GoPay, ShopeePay, M-Banking</p>
              </div>

              <div className="text-left bg-emerald-50 p-2.5 rounded-xl text-[10px] text-emerald-900 space-y-1">
                <p className="font-bold">Konfirmasi Otomatis / Manual:</p>
                <p>Setelah transfer, harap konfirmasi via WhatsApp Bendahara RA dengan melampirkan resi.</p>
              </div>

              <button
                onClick={() => setSelectedTagihan(null)}
                className="w-full bg-slate-200 text-slate-700 py-2 rounded-xl font-bold"
              >
                Tutup
              </button>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}