"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '../supabase';

interface TagihanSPP {
  id: string;
  created_at: string;
  nama_siswa: string;
  bulan: string;
  tahun: string;
  nominal: number;
  biaya_admin: number;
  status: string;
  tanggal_bayar: string | null;
  catatan: string | null;
}

export default function SPPPage() {
  const [listSpp, setListSpp] = useState<TagihanSPP[]>([]);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [metodeBayar, setMetodeBayar] = useState<'qris' | 'transfer'>('qris');

  const [namaSiswa, setNamaSiswa] = useState('');
  const [bulan, setBulan] = useState('Januari');
  const [tahun, setTahun] = useState('2026');
  const [nominal, setNominal] = useState('150000');
  const [biayaAdmin] = useState('2000');
  const [searchName, setSearchName] = useState('');

  useEffect(() => {
    const role = localStorage.getItem('userRole');
    setUserRole(role);
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('spp')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error) {
      setListSpp(data || []);
    }
    setLoading(false);
  };

  const handleTambahTagihan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!namaSiswa) return;

    const { error } = await supabase.from('spp').insert([
      {
        nama_siswa: namaSiswa,
        bulan,
        tahun,
        nominal: parseFloat(nominal),
        biaya_admin: parseFloat(biayaAdmin),
        status: 'Belum Lunas',
      },
    ]);

    if (error) {
      alert('Gagal menambah tagihan: ' + error.message);
    } else {
      alert(`Tagihan SPP ${bulan} ${tahun} untuk ${namaSiswa} berhasil dibuat!`);
      setNamaSiswa('');
      fetchData();
    }
  };

  const handleTandaiLunas = async (id: string) => {
    const today = new Date().toISOString().split('T')[0];
    const { error } = await supabase
      .from('spp')
      .update({ status: 'Lunas', tanggal_bayar: today })
      .eq('id', id);

    if (error) {
      alert('Gagal memperbarui status: ' + error.message);
    } else {
      alert('Status SPP berhasil diubah menjadi LUNAS! ✅');
      fetchData();
    }
  };

  const filteredSpp = listSpp.filter((item) =>
    item.nama_siswa.toLowerCase().includes(searchName.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      <header className="bg-amber-600 text-white p-4 shadow-md sticky top-0 z-10">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <Link href="/" className="text-xs bg-amber-700 hover:bg-amber-800 text-amber-100 px-3 py-1.5 rounded-lg font-semibold">
            ← Kembali
          </Link>
          <h1 className="text-base font-bold">Pembayaran SPP Bulanan</h1>
          <div className="w-12"></div>
        </div>
      </header>

      <main className="max-w-md mx-auto p-4 space-y-4">
        {/* MODUL PILIHAN PEMBAYARAN (QRIS & TRANSFER) */}
        <div className="bg-white border border-slate-100 p-4 rounded-2xl shadow-sm space-y-3">
          <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider border-b pb-2">
            💳 Metode Pembayaran Resmi Sekolah
          </h2>

          {/* TAB PILIHAN METODE */}
          <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-bold">
            <button
              onClick={() => setMetodeBayar('qris')}
              className={`flex-1 py-2 rounded-lg transition ${
                metodeBayar === 'qris' ? 'bg-amber-600 text-white shadow-sm' : 'text-slate-600'
              }`}
            >
              📱 Scan QRIS (Rekomendasi)
            </button>
            <button
              onClick={() => setMetodeBayar('transfer')}
              className={`flex-1 py-2 rounded-lg transition ${
                metodeBayar === 'transfer' ? 'bg-amber-600 text-white shadow-sm' : 'text-slate-600'
              }`}
            >
              🏦 Transfer Bank BSI
            </button>
          </div>

          {/* TAMPILAN JIKA PILIH QRIS */}
          {metodeBayar === 'qris' && (
            <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl text-center space-y-3">
              <div className="inline-block bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
                {/* Kode QRIS Dinamis / Gambar QRIS Sekolah */}
                <div className="w-48 h-48 bg-slate-100 border-2 border-dashed border-amber-400 rounded-lg flex flex-col items-center justify-center p-2 text-center mx-auto">
                  <span className="text-3xl mb-1">📲</span>
                  <p className="text-xs font-bold text-slate-700">QRIS RA PERMATA HATI</p>
                  <p className="text-[10px] text-slate-400 mt-1">NMID: ID102030405060</p>
                  <p className="text-[9px] text-amber-800 font-bold mt-2 bg-amber-100 px-2 py-0.5 rounded">
                    Mendukung Semua M-Banking & e-Wallet
                  </p>
                </div>
              </div>

              <div className="bg-white p-3 rounded-xl border border-amber-200 text-left space-y-1 text-xs">
                <p className="font-bold text-slate-800 border-b pb-1">Rincian Nominal Scan QRIS:</p>
                <div className="flex justify-between text-slate-600">
                  <span>SPP Bulanan</span>
                  <span>Rp 150.000</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Biaya Layanan Sistem</span>
                  <span>Rp 2.000</span>
                </div>
                <div className="flex justify-between font-bold text-amber-900 pt-1 border-t text-sm">
                  <span>Total yang Di-scan:</span>
                  <span>Rp 152.000</span>
                </div>
              </div>
              <p className="text-[10px] text-amber-800 italic">
                *Cukup masukkan nominal <b>Rp 152.000</b> saat melakukan scan QRIS di aplikasi HP Anda.
              </p>
            </div>
          )}

          {/* TAMPILAN JIKA PILIH TRANSFER BANK */}
          {metodeBayar === 'transfer' && (
            <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-3 text-xs">
              <div className="bg-white p-3 rounded-xl border border-slate-200 space-y-1">
                <p className="font-semibold text-slate-600">Bank BSI (Bank Syariah Indonesia)</p>
                <p className="font-bold text-amber-700 text-base">7123-4567-89</p>
                <p className="text-[11px] text-slate-500 font-medium">a.n. RA PERMATA HATI</p>
              </div>

              <div className="bg-white p-3 rounded-xl border border-slate-200 space-y-1">
                <p className="font-bold text-slate-800 border-b pb-1">Rincian Transfer:</p>
                <div className="flex justify-between text-slate-600">
                  <span>SPP Bulanan</span>
                  <span>Rp 150.000</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Biaya Admin Sistem</span>
                  <span>Rp 2.000</span>
                </div>
                <div className="flex justify-between font-bold text-slate-900 pt-1 border-t text-sm">
                  <span>Total Transfer ke Sekolah:</span>
                  <span>Rp 152.000</span>
                </div>
              </div>
              <p className="text-[10px] text-slate-500 italic">
                *Note: Jika transfer BI-Fast dari BCA/Mandiri/BRI, bank Anda memotong tarif standar Rp 2.500. Total pengeluaran Anda = Rp 154.500.
              </p>
            </div>
          )}
        </div>

        {/* FORM BUAT TAGIHAN BARU (KHUSUS ADMIN) */}
        {userRole === 'admin' && (
          <form onSubmit={handleTambahTagihan} className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 space-y-3">
            <h3 className="text-xs font-bold text-slate-800 border-b pb-2">➕ Buat Tagihan SPP Baru (Admin)</h3>
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">Nama Siswa</label>
              <input
                type="text"
                required
                placeholder="Contoh: Ahmad Rayhan"
                className="w-full p-2 text-xs border border-slate-300 rounded-lg focus:outline-amber-600"
                value={namaSiswa}
                onChange={(e) => setNamaSiswa(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Bulan</label>
                <select
                  className="w-full p-2 text-xs border border-slate-300 rounded-lg focus:outline-amber-600"
                  value={bulan}
                  onChange={(e) => setBulan(e.target.value)}
                >
                  {['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'].map((b) => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Tahun</label>
                <input
                  type="text"
                  required
                  className="w-full p-2 text-xs border border-slate-300 rounded-lg focus:outline-amber-600"
                  value={tahun}
                  onChange={(e) => setTahun(e.target.value)}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Nominal SPP (Rp)</label>
                <input
                  type="number"
                  required
                  className="w-full p-2 text-xs border border-slate-300 rounded-lg focus:outline-amber-600"
                  value={nominal}
                  onChange={(e) => setNominal(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Biaya Admin (Rp)</label>
                <input
                  type="number"
                  disabled
                  className="w-full p-2 text-xs border border-slate-200 bg-slate-100 rounded-lg text-slate-500 font-bold"
                  value={biayaAdmin}
                />
              </div>
            </div>
            <button
              type="submit"
              className="w-full bg-amber-600 text-white font-bold text-xs py-2.5 rounded-xl shadow hover:bg-amber-700 transition"
            >
              Simpan Tagihan Baru
            </button>
          </form>
        )}

        {/* DAFTAR TAGIHAN SPP */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 space-y-3">
          <div className="flex justify-between items-center border-b pb-2">
            <h3 className="text-xs font-bold text-slate-800">📋 Daftar Tagihan & Status SPP</h3>
            <span className="text-[10px] bg-amber-100 text-amber-800 font-semibold px-2 py-0.5 rounded-full">
              Realtime
            </span>
          </div>

          <div>
            <input
              type="text"
              placeholder="🔍 Cari nama siswa..."
              className="w-full p-2 text-xs border border-slate-200 rounded-lg focus:outline-amber-600"
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
            />
          </div>

          {loading ? (
            <p className="text-center text-xs text-slate-400 py-4">Memuat data SPP...</p>
          ) : filteredSpp.length === 0 ? (
            <p className="text-center text-xs text-slate-400 py-4">Belum ada data tagihan SPP.</p>
          ) : (
            <div className="space-y-2">
              {filteredSpp.map((item) => {
                const totalTransfer = (item.nominal || 0) + (item.biaya_admin || 2000);
                return (
                  <div key={item.id} className="p-3 border rounded-xl bg-slate-50 flex justify-between items-center text-xs">
                    <div>
                      <p className="font-bold text-slate-800">{item.nama_siswa}</p>
                      <p className="text-[11px] text-slate-500">
                        SPP {item.bulan} {item.tahun}
                      </p>
                      <p className="text-[10px] text-amber-800 font-bold mt-0.5">
                        Total Bayar: Rp {totalTransfer.toLocaleString('id-ID')} <span className="text-slate-400 font-normal">(inc. admin 2rb)</span>
                      </p>
                      {item.tanggal_bayar && (
                        <p className="text-[10px] text-emerald-600 font-medium mt-0.5">
                          Lunas Tgl: {new Date(item.tanggal_bayar).toLocaleDateString('id-ID')}
                        </p>
                      )}
                    </div>

                    <div className="text-right space-y-1">
                      <span
                        className={`inline-block text-[10px] font-bold px-2.5 py-1 rounded-full ${
                          item.status === 'Lunas' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {item.status}
                      </span>

                      {userRole === 'admin' && item.status !== 'Lunas' && (
                        <div>
                          <button
                            onClick={() => handleTandaiLunas(item.id)}
                            className="text-[10px] bg-emerald-600 text-white font-semibold px-2 py-1 rounded shadow hover:bg-emerald-700 transition mt-1"
                          >
                            ✔ Tandai Lunas
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}