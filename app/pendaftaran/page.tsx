"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { supabase } from '../supabase';

export default function Pendaftaran() {
  const [formData, setFormData] = useState({
    namaLengkap: '',
    tempatLahir: '',
    tanggalLahir: '',
    jenisKelamin: 'Laki-laki',
    alamat: '',
    namaOrtu: '',
    noWa: '',
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Simpan data ke database Supabase
      const { data, error } = await supabase
        .from('pendaftaran')
        .insert([
          {
            nama_lengkap: formData.namaLengkap,
            tempat_lahir: formData.tempatLahir,
            tanggal_lahir: formData.tanggalLahir,
            jenis_kelamin: formData.jenisKelamin,
            alamat: formData.alamat,
            nama_ortu: formData.namaOrtu,
            no_wa: formData.noWa,
          },
        ]);

      if (error) {
        alert('Gagal menyimpan data: ' + error.message);
      } else {
        alert(`Pendaftaran atas nama ${formData.namaLengkap} berhasil tersimpan di Database!`);
        // Reset Form
        setFormData({
          namaLengkap: '',
          tempatLahir: '',
          tanggalLahir: '',
          jenisKelamin: 'Laki-laki',
          alamat: '',
          namaOrtu: '',
          noWa: '',
        });
      }
    } catch (err) {
      alert('Terjadi kesalahan koneksi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      {/* Header */}
      <header className="bg-emerald-600 text-white p-4 shadow-md sticky top-0 z-10">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <Link href="/" className="text-sm font-semibold text-emerald-100 hover:text-white">
            ← Kembali
          </Link>
          <h1 className="text-base font-bold">PPDB Online</h1>
          <div className="w-12"></div>
        </div>
      </header>

      <main className="max-w-md mx-auto p-4 space-y-4">
        <form onSubmit={handleSubmit} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 space-y-4">
          
          <div className="border-b pb-3">
            <h2 className="text-base font-bold text-slate-800">Formulir Pendaftaran Siswa Baru</h2>
            <p className="text-xs text-slate-500">Isi data calon siswa dan orang tua dengan lengkap</p>
          </div>

          {/* SECTION 1: DATA SISWA */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-emerald-700 uppercase tracking-wider">A. Data Calon Siswa</h3>
            
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Nama Lengkap Siswa</label>
              <input
                type="text"
                required
                placeholder="Contoh: Ahmad Rayhan"
                className="w-full p-2.5 text-xs border border-slate-300 rounded-lg focus:outline-emerald-600"
                value={formData.namaLengkap}
                onChange={(e) => setFormData({ ...formData, namaLengkap: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Tempat Lahir</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Jakarta"
                  className="w-full p-2.5 text-xs border border-slate-300 rounded-lg focus:outline-emerald-600"
                  value={formData.tempatLahir}
                  onChange={(e) => setFormData({ ...formData, tempatLahir: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Tanggal Lahir</label>
                <input
                  type="date"
                  required
                  className="w-full p-2.5 text-xs border border-slate-300 rounded-lg focus:outline-emerald-600"
                  value={formData.tanggalLahir}
                  onChange={(e) => setFormData({ ...formData, tanggalLahir: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Jenis Kelamin</label>
              <select
                className="w-full p-2.5 text-xs border border-slate-300 rounded-lg focus:outline-emerald-600"
                value={formData.jenisKelamin}
                onChange={(e) => setFormData({ ...formData, jenisKelamin: e.target.value })}
              >
                <option value="Laki-laki">Laki-laki</option>
                <option value="Perempuan">Perempuan</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Alamat Tempat Tinggal</label>
              <textarea
                required
                rows={2}
                placeholder="Jl. Merdeka No. 12, RT 01/RW 02..."
                className="w-full p-2.5 text-xs border border-slate-300 rounded-lg focus:outline-emerald-600"
                value={formData.alamat}
                onChange={(e) => setFormData({ ...formData, alamat: e.target.value })}
              />
            </div>
          </div>

          {/* SECTION 2: DATA ORANG TUA */}
          <div className="space-y-3 pt-2 border-t">
            <h3 className="text-xs font-bold text-emerald-700 uppercase tracking-wider">B. Data Orang Tua / Wali</h3>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Nama Ayah / Ibu / Wali</label>
              <input
                type="text"
                required
                placeholder="Contoh: Budi Santoso"
                className="w-full p-2.5 text-xs border border-slate-300 rounded-lg focus:outline-emerald-600"
                value={formData.namaOrtu}
                onChange={(e) => setFormData({ ...formData, namaOrtu: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">No. WhatsApp Aktif</label>
              <input
                type="tel"
                required
                placeholder="Contoh: 08123456789"
                className="w-full p-2.5 text-xs border border-slate-300 rounded-lg focus:outline-emerald-600"
                value={formData.noWa}
                onChange={(e) => setFormData({ ...formData, noWa: e.target.value })}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-600 text-white font-bold text-sm py-3 rounded-xl shadow hover:bg-emerald-700 transition mt-4 disabled:bg-slate-400"
          >
            {loading ? 'Mengirim Data...' : 'Kirim Pendaftaran'}
          </button>
        </form>
      </main>
    </div>
  );
}