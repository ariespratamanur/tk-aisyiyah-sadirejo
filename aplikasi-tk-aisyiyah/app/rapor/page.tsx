"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '../supabase';

interface DataRapor {
  id: string;
  created_at: string;
  nama_siswa: string;
  semester: string;
  tahun_ajaran: string;
  file_url: string;
}

export default function RaporPage() {
  const [listRapor, setListRapor] = useState<DataRapor[]>([]);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<string | null>(null);

  // Form Guru (Upload Rapor PDF Langsung)
  const [namaSiswa, setNamaSiswa] = useState('');
  const [semester, setSemester] = useState('Semester 1 (Ganjil)');
  const [tahunAjaran, setTahunAjaran] = useState('2025/2026');
  const [fileUrl, setFileUrl] = useState('');
  const [uploading, setUploading] = useState(false);

  // Form Pencarian Orang Tua
  const [searchName, setSearchName] = useState('');

  useEffect(() => {
    const role = localStorage.getItem('userRole');
    setUserRole(role);
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('rapor')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error) {
      setListRapor(data || []);
    }
    setLoading(false);
  };

  // FUNGSI UPLOAD FILE PDF LANGSUNG DARI LAPTOP/HP
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      if (!e.target.files || e.target.files.length === 0) return;

      const file = e.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `rapor-pdf/${fileName}`;

      // Upload ke Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('documents')
        .upload(filePath, file);

      if (uploadError) {
        alert('Gagal mengunggah file: ' + uploadError.message + '\nPastikan Storage Bucket "documents" di Supabase sudah dibuat.');
        return;
      }

      // Ambil Link Public PDF
      const { data } = supabase.storage.from('documents').getPublicUrl(filePath);
      setFileUrl(data.publicUrl);
      alert('✅ File PDF Rapor RDM berhasil diunggah!');
    } catch (err: any) {
      alert('Error: ' + err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleSimpanRapor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!namaSiswa || !fileUrl) {
      alert('Harap pilih file PDF Rapor terlebih dahulu!');
      return;
    }

    const { error } = await supabase.from('rapor').insert([
      {
        nama_siswa: namaSiswa,
        semester,
        tahun_ajaran: tahunAjaran,
        file_url: fileUrl,
      },
    ]);

    if (error) {
      alert('Gagal menyimpan rapor: ' + error.message);
    } else {
      alert(`Rapor RDM untuk ${namaSiswa} berhasil dipublikasikan ke Wali Murid! 🎉`);
      setNamaSiswa('');
      setFileUrl('');
      fetchData();
    }
  };

  const filteredRapor = listRapor.filter((item) =>
    item.nama_siswa.toLowerCase().includes(searchName.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      <header className="bg-blue-600 text-white p-4 shadow-md sticky top-0 z-10">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <Link href="/" className="text-xs bg-blue-700 hover:bg-blue-800 text-blue-100 px-3 py-1.5 rounded-lg font-semibold">
            ← Kembali
          </Link>
          <h1 className="text-base font-bold">Portal Rapor Digital RDM</h1>
          <div className="w-12"></div>
        </div>
      </header>

      <main className="max-w-md mx-auto p-4 space-y-4">
        {/* INFO LITERASI PAPERLESS */}
        <div className="bg-blue-50 border border-blue-200 p-4 rounded-2xl shadow-sm space-y-2 text-xs text-blue-900">
          <h2 className="font-bold uppercase tracking-wider flex items-center gap-1.5">
            <span>📖</span> Rapor Digital Sah & Resmi Kemenag
          </h2>
          <p className="text-[11px] text-blue-800 leading-relaxed">
            Rapor yang diunggah di portal ini merupakan hasil ekspor resmi dari <b>Rapor Digital Madrasah (RDM) Kemenag RI</b> yang telah dilengkapi Tanda Tangan Digital & QR Code Verifikasi Autentik.
          </p>
        </div>

        {/* FORM UPLOAD RAPOR PDF (KHUSUS GURU / ADMIN) */}
        {userRole === 'admin' && (
          <form onSubmit={handleSimpanRapor} className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 space-y-3">
            <h3 className="text-xs font-bold text-slate-800 border-b pb-2">📤 Unggah File PDF Rapor RDM (Guru/TU)</h3>
            
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">Nama Siswa</label>
              <input
                type="text"
                required
                placeholder="Contoh: Ahmad Rayhan"
                className="w-full p-2 text-xs border border-slate-300 rounded-lg focus:outline-blue-600"
                value={namaSiswa}
                onChange={(e) => setNamaSiswa(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Semester</label>
                <select
                  className="w-full p-2 text-xs border border-slate-300 rounded-lg focus:outline-blue-600"
                  value={semester}
                  onChange={(e) => setSemester(e.target.value)}
                >
                  <option value="Semester 1 (Ganjil)">Semester 1 (Ganjil)</option>
                  <option value="Semester 2 (Genap)">Semester 2 (Genap)</option>
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Tahun Ajaran</label>
                <input
                  type="text"
                  required
                  className="w-full p-2 text-xs border border-slate-300 rounded-lg focus:outline-blue-600"
                  value={tahunAjaran}
                  onChange={(e) => setTahunAjaran(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">Pilih File PDF Rapor dari Komputer/HP</label>
              <input
                type="file"
                accept="application/pdf"
                required
                onChange={handleFileUpload}
                className="w-full text-xs text-slate-500 file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              {uploading && <p className="text-[10px] text-amber-600 mt-1 font-semibold">Mengunggah file PDF...</p>}
            </div>

            <button
              type="submit"
              disabled={uploading || !fileUrl}
              className={`w-full text-white font-bold text-xs py-2.5 rounded-xl shadow transition ${
                fileUrl ? 'bg-blue-600 hover:bg-blue-700' : 'bg-slate-300 cursor-not-allowed'
              }`}
            >
              Publikasikan Rapor ke Wali Murid
            </button>
          </form>
        )}

        {/* DAFTAR RAPOR & FITUR DOWNLOAD WALI MURID */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 space-y-3">
          <div className="flex justify-between items-center border-b pb-2">
            <h3 className="text-xs font-bold text-slate-800">📥 Unduh PDF Rapor Hasil Belajar Siswa</h3>
            <span className="text-[10px] bg-blue-100 text-blue-800 font-semibold px-2 py-0.5 rounded-full">
              Resmi RDM
            </span>
          </div>

          <div>
            <input
              type="text"
              placeholder="🔍 Cari nama siswa..."
              className="w-full p-2 text-xs border border-slate-200 rounded-lg focus:outline-blue-600"
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
            />
          </div>

          {loading ? (
            <p className="text-center text-xs text-slate-400 py-4">Memuat data rapor...</p>
          ) : filteredRapor.length === 0 ? (
            <p className="text-center text-xs text-slate-400 py-4">Belum ada dokumen rapor yang dipublikasikan.</p>
          ) : (
            <div className="space-y-2">
              {filteredRapor.map((item) => (
                <div key={item.id} className="p-3 border rounded-xl bg-slate-50 flex justify-between items-center text-xs">
                  <div>
                    <p className="font-bold text-slate-800">{item.nama_siswa}</p>
                    <p className="text-[11px] text-slate-500">
                      {item.semester} • TA {item.tahun_ajaran}
                    </p>
                  </div>

                  <div>
                    <a
                      href={item.file_url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-[11px] bg-blue-600 text-white font-bold px-3 py-1.5 rounded-lg shadow hover:bg-blue-700 transition"
                    >
                      📄 Unduh PDF
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}