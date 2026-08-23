"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '../supabase';

interface Pendaftaran {
  id: string;
  nama_siswa: string;
  nik: string;
  kelompok_kelas?: string;
  tempat_lahir: string;
  tanggal_lahir: string;
  jenis_kelamin: string;
  nama_ortu: string;
  pekerjaan_ayah: string;
  nama_ibu: string;
  pekerjaan_ibu: string;
  no_wa: string;
  alamat: string;
  status: string;
  created_at: string;
}

export default function PpdbPage() {
  const [userRole, setUserRole] = useState<string | null>(null);
  const [listPendaftaran, setListPendaftaran] = useState<Pendaftaran[]>([]);
  const [loading, setLoading] = useState(false);

  // Form State Siswa & Orang Tua
  const [namaSiswa, setNamaSiswa] = useState('');
  const [nik, setNik] = useState('');
  const [kelompokKelas, setKelompokKelas] = useState('Kelas A');
  const [tempatLahir, setTempatLahir] = useState('');
  const [tanggalLahir, setTanggalLahir] = useState('');
  const [jenisKelamin, setJenisKelamin] = useState('Laki-laki');
  
  // Data Ayah & Ibu
  const [namaOrtu, setNamaOrtu] = useState(''); // Nama Ayah
  const [pekerjaanAyah, setPekerjaanAyah] = useState('');
  const [namaIbu, setNamaIbu] = useState('');
  const [pekerjaanIbu, setPekerjaanIbu] = useState('');
  
  const [noWa, setNoWa] = useState('');
  const [alamat, setAlamat] = useState('');

  const [selectedBukti, setSelectedBukti] = useState<Pendaftaran | null>(null);

  useEffect(() => {
    setUserRole(localStorage.getItem('userRole'));
    fetchPendaftaran();
  }, []);

  const fetchPendaftaran = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('ppdb_pendaftaran')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setListPendaftaran(data);
    }
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      nama_siswa: namaSiswa,
      nik,
      kelompok_kelas: kelompokKelas,
      tempat_lahir: tempatLahir,
      tanggal_lahir: tanggalLahir,
      jenis_kelamin: jenisKelamin,
      nama_ortu: namaOrtu,
      pekerjaan_ayah: pekerjaanAyah,
      nama_ibu: namaIbu,
      pekerjaan_ibu: pekerjaanIbu,
      no_wa: noWa,
      alamat,
      status: 'TERDAFTAR'
    };

    const { data, error } = await supabase.from('ppdb_pendaftaran').insert([payload]).select();

    if (error) {
      alert('Gagal mengirim pendaftaran: ' + error.message);
    } else {
      alert('Pendaftaran Berhasil dikirim!');
      if (data && data[0]) {
        setSelectedBukti(data[0]);
      }
      // Reset Form
      setNamaSiswa('');
      setNik('');
      setKelompokKelas('Kelas A');
      setTempatLahir('');
      setTanggalLahir('');
      setNamaOrtu('');
      setPekerjaanAyah('');
      setNamaIbu('');
      setPekerjaanIbu('');
      setNoWa('');
      setAlamat('');
      fetchPendaftaran();
    }
    setLoading(false);
  };

  const handleUpdateStatus = async (id: string, statusBaru: string) => {
    const { error } = await supabase
      .from('ppdb_pendaftaran')
      .update({ status: statusBaru })
      .eq('id', id);

    if (!error) {
      alert(`Status siswa berhasil diubah menjadi: ${statusBaru}`);
      fetchPendaftaran();
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 pb-12">
      <header className="bg-emerald-600 text-white p-4 shadow-md print:hidden">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <Link href="/" className="text-xs bg-emerald-700 hover:bg-emerald-800 text-emerald-100 px-3 py-1.5 rounded-lg font-semibold">
            ← Kembali
          </Link>
          <h1 className="text-sm font-bold">PPDB & Kelola Siswa RA</h1>
          <div className="w-12"></div>
        </div>
      </header>

      <main className="max-w-md mx-auto p-4 space-y-6 print:p-0 print:max-w-none">
        
        {/* FORM PENDAFTARAN LENGKAP */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 space-y-4 print:hidden">
          <div>
            <h2 className="text-sm font-bold text-slate-800">Formulir Pendaftaran Siswa Baru</h2>
            <p className="text-[11px] text-slate-500">Isi data calon siswa & orang tua secara lengkap.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3 text-xs">
            {/* DATA SISWA */}
            <div className="space-y-2">
              <p className="font-extrabold text-emerald-700 uppercase tracking-wider text-[10px] border-b pb-1">A. DATA CALON SISWA</p>
              
              <div>
                <label className="block font-bold text-slate-700 mb-1">Nama Lengkap Anak</label>
                <input type="text" required placeholder="Contoh: Muhammad Rizky" value={namaSiswa} onChange={(e) => setNamaSiswa(e.target.value)} className="w-full p-2.5 border rounded-xl focus:outline-emerald-600 bg-slate-50" />
              </div>

              {/* FITUR BARU: PILIHAN KELOMPOK BELAJAR */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">Pilihan Kelompok Belajar</label>
                <select value={kelompokKelas} onChange={(e) => setKelompokKelas(e.target.value)} className="w-full p-2.5 border rounded-xl focus:outline-emerald-600 bg-slate-50 font-semibold text-emerald-800">
                  <option value="Kelas A">Kelompok A (Usia 4 - 5 Tahun)</option>
                  <option value="Kelas B">Kelompok B (Usia 5 - 6 Tahun)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">NIK Anak / No. KK</label>
                  <input type="text" required placeholder="3271..." value={nik} onChange={(e) => setNik(e.target.value)} className="w-full p-2.5 border rounded-xl focus:outline-emerald-600 bg-slate-50 font-mono" />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Jenis Kelamin</label>
                  <select value={jenisKelamin} onChange={(e) => setJenisKelamin(e.target.value)} className="w-full p-2.5 border rounded-xl focus:outline-emerald-600 bg-slate-50">
                    <option value="Laki-laki">Laki-laki</option>
                    <option value="Perempuan">Perempuan</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Tempat Lahir</label>
                  <input type="text" required placeholder="Jakarta" value={tempatLahir} onChange={(e) => setTempatLahir(e.target.value)} className="w-full p-2.5 border rounded-xl focus:outline-emerald-600 bg-slate-50" />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Tanggal Lahir</label>
                  <input type="date" required value={tanggalLahir} onChange={(e) => setTanggalLahir(e.target.value)} className="w-full p-2.5 border rounded-xl focus:outline-emerald-600 bg-slate-50" />
                </div>
              </div>
            </div>

            {/* DATA ORANG TUA */}
            <div className="space-y-2 pt-2">
              <p className="font-extrabold text-emerald-700 uppercase tracking-wider text-[10px] border-b pb-1">B. DATA ORANG TUA / WALI</p>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Nama Ayah</label>
                  <input type="text" required placeholder="Hendra Pratama" value={namaOrtu} onChange={(e) => setNamaOrtu(e.target.value)} className="w-full p-2.5 border rounded-xl focus:outline-emerald-600 bg-slate-50" />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Pekerjaan Ayah</label>
                  <input type="text" placeholder="Karyawan Swasta" value={pekerjaanAyah} onChange={(e) => setPekerjaanAyah(e.target.value)} className="w-full p-2.5 border rounded-xl focus:outline-emerald-600 bg-slate-50" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Nama Ibu</label>
                  <input type="text" required placeholder="Siti Rahmawati" value={namaIbu} onChange={(e) => setNamaIbu(e.target.value)} className="w-full p-2.5 border rounded-xl focus:outline-emerald-600 bg-slate-50" />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Pekerjaan Ibu</label>
                  <input type="text" placeholder="Ibu Rumah Tangga" value={pekerjaanIbu} onChange={(e) => setPekerjaanIbu(e.target.value)} className="w-full p-2.5 border rounded-xl focus:outline-emerald-600 bg-slate-50" />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">No. WhatsApp Aktif</label>
                <input type="tel" required placeholder="08123456789" value={noWa} onChange={(e) => setNoWa(e.target.value)} className="w-full p-2.5 border rounded-xl focus:outline-emerald-600 bg-slate-50 font-mono" />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Alamat Rumah Lengkap</label>
                <textarea required rows={2} placeholder="Jl. Mawar No. 12 RT 01/RW 02..." value={alamat} onChange={(e) => setAlamat(e.target.value)} className="w-full p-2.5 border rounded-xl focus:outline-emerald-600 bg-slate-50"></textarea>
              </div>
            </div>

            <button type="submit" disabled={loading} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-xl font-bold text-xs shadow-md transition mt-3">
              {loading ? 'Mengirim Data...' : 'Kirim Pendaftaran Now'}
            </button>
          </form>
        </div>

        {/* PANEL KELOLA DATA SISWA (ADMIN/GURU) */}
        {userRole === 'admin' && (
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 space-y-3 print:hidden">
            <h2 className="text-xs font-bold text-slate-800 border-b pb-2 flex justify-between items-center">
              <span>📋 Kelola Data Siswa ({listPendaftaran.length})</span>
              <span className="text-[10px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">Mode Admin</span>
            </h2>

            <div className="space-y-2 max-h-96 overflow-y-auto">
              {listPendaftaran.length === 0 ? (
                <p className="text-center text-xs text-slate-400 py-3">Belum ada siswa terdaftar.</p>
              ) : (
                listPendaftaran.map((item) => (
                  <div key={item.id} className="p-3 border rounded-xl bg-slate-50 space-y-2 text-xs">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-bold text-slate-800">{item.nama_siswa} <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded ml-1">{item.kelompok_kelas || 'Kelas A'}</span></p>
                        <p className="text-[10px] text-slate-500">Ayah: {item.nama_ortu} | Ibu: {item.nama_ibu || '-'}</p>
                        <p className="text-[10px] text-slate-500">WA: {item.no_wa}</p>
                      </div>
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                        item.status === 'PINDAH / MUTASI' ? 'bg-red-100 text-red-700' :
                        item.status === 'DITERIMA' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {item.status}
                      </span>
                    </div>

                    <div className="flex gap-1 pt-1 border-t border-slate-200">
                      <button onClick={() => setSelectedBukti(item)} className="bg-slate-700 text-white px-2 py-1 rounded text-[10px] font-bold">
                        🖨️ Cetak Formulir Lengkap
                      </button>
                      
                      {item.status !== 'DITERIMA' && item.status !== 'PINDAH / MUTASI' && (
                        <button onClick={() => handleUpdateStatus(item.id, 'DITERIMA')} className="bg-emerald-600 text-white px-2 py-1 rounded text-[10px] font-bold">
                          ✓ Terima
                        </button>
                      )}

                      {item.status !== 'PINDAH / MUTASI' && (
                        <button onClick={() => handleUpdateStatus(item.id, 'PINDAH / MUTASI')} className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-[10px] font-bold ml-auto">
                          🚫 Set Pindah
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* MODAL CETAK FORMULIR DOKUMEN LENGKAP SISWA */}
        {selectedBukti && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50 print:p-0 print:static print:bg-white">
            <div className="bg-white p-6 rounded-2xl max-w-md w-full space-y-4 text-xs print:max-w-none print:w-full print:shadow-none print:p-0">
              
              {/* KOP RESMI SEKOLAH */}
              <div className="text-center border-b-2 border-slate-900 pb-3 space-y-1">
                <h3 className="font-black text-base uppercase tracking-wider text-slate-900">RA PERMATA HATI</h3>
                <p className="text-[10px] text-slate-600">Izin Operasional Kemenag • Terakreditasi A</p>
                <p className="text-[9px] text-slate-500">Jl. Komarudin, RT 007/RW 005, Pulo Gebang, Cakung, Jakarta Timur</p>
              </div>

              <div className="text-center space-y-1 pt-1">
                <p className="font-extrabold text-slate-900 uppercase tracking-widest text-xs">FORMULIR BUKTI PENDAFTARAN SISWA BARU</p>
                <p className="text-[10px] text-slate-500">Tahun Ajaran 2026/2027</p>
              </div>

              {/* TABLE DATA SUPER LENGKAP SISWA & ORTU */}
              <div className="border rounded-xl overflow-hidden text-[11px] space-y-0">
                <div className="flex border-b p-2 bg-slate-100 font-bold text-emerald-800"><span className="w-full">A. DATA CALON SISWA</span></div>
                <div className="flex border-b p-2 bg-slate-50"><span className="w-1/3 text-slate-500 font-medium">Nama Lengkap</span><span className="w-2/3 font-bold text-slate-900">{selectedBukti.nama_siswa}</span></div>
                <div className="flex border-b p-2"><span className="w-1/3 text-slate-500 font-medium">Pilihan Kelompok</span><span className="w-2/3 font-bold text-emerald-700">{selectedBukti.kelompok_kelas || 'Kelas A'}</span></div>
                <div className="flex border-b p-2 bg-slate-50"><span className="w-1/3 text-slate-500 font-medium">NIK / No. KK</span><span className="w-2/3 font-mono font-semibold text-slate-800">{selectedBukti.nik || '-'}</span></div>
                <div className="flex border-b p-2"><span className="w-1/3 text-slate-500 font-medium">Jenis Kelamin</span><span className="w-2/3 text-slate-800">{selectedBukti.jenis_kelamin || '-'}</span></div>
                <div className="flex border-b p-2 bg-slate-50"><span className="w-1/3 text-slate-500 font-medium">Tempat, Tgl Lahir</span><span className="w-2/3 text-slate-800">{selectedBukti.tempat_lahir || '-'}, {selectedBukti.tanggal_lahir || '-'}</span></div>
                
                <div className="flex border-b p-2 bg-slate-100 font-bold text-emerald-800"><span className="w-full">B. DATA ORANG TUA / WALI</span></div>
                <div className="flex border-b p-2 bg-slate-50"><span className="w-1/3 text-slate-500 font-medium">Nama Ayah</span><span className="w-2/3 font-semibold text-slate-800">{selectedBukti.nama_ortu || '-'}</span></div>
                <div className="flex border-b p-2"><span className="w-1/3 text-slate-500 font-medium">Pekerjaan Ayah</span><span className="w-2/3 text-slate-800">{selectedBukti.pekerjaan_ayah || '-'}</span></div>
                <div className="flex border-b p-2 bg-slate-50"><span className="w-1/3 text-slate-500 font-medium">Nama Ibu</span><span className="w-2/3 font-semibold text-slate-800">{selectedBukti.nama_ibu || '-'}</span></div>
                <div className="flex border-b p-2"><span className="w-1/3 text-slate-500 font-medium">Pekerjaan Ibu</span><span className="w-2/3 text-slate-800">{selectedBukti.pekerjaan_ibu || '-'}</span></div>
                <div className="flex border-b p-2 bg-slate-50"><span className="w-1/3 text-slate-500 font-medium">No. WhatsApp</span><span className="w-2/3 font-mono text-slate-800">{selectedBukti.no_wa}</span></div>
                <div className="flex border-b p-2"><span className="w-1/3 text-slate-500 font-medium">Alamat Rumah</span><span className="w-2/3 text-slate-800">{selectedBukti.alamat || '-'}</span></div>
                <div className="flex p-2 bg-slate-50"><span className="w-1/3 text-slate-500 font-medium">Status Pendaftaran</span><span className="w-2/3 font-bold text-emerald-600">{selectedBukti.status}</span></div>
              </div>

              <div className="text-[9px] text-slate-400 text-center italic">
                *Dokumen resmi pendaftaran siswa RA Permata Hati.
              </div>

              <div className="flex gap-2 pt-2 print:hidden">
                <button onClick={() => window.print()} className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 rounded-xl font-bold shadow transition">
                  🖨️ Cetak PDF Lengkap
                </button>
                <button onClick={() => setSelectedBukti(null)} className="bg-slate-200 hover:bg-slate-300 text-slate-700 px-4 py-2.5 rounded-xl font-bold transition">
                  Tutup
                </button>
              </div>

            </div>
          </div>
        )}

      </main>
    </div>
  );
}