"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '../supabase';

interface Student {
  id: string;
  nama_siswa: string;
  nik: string;
  tempat_lahir: string;
  tanggal_lahir: string;
  kelompok_kelas: string;
  nama_ortu: string;
  nama_ayah: string;
  pekerjaan_ayah: string;
  nama_ibu: string;
  pekerjaan_ibu: string;
  no_wa: string;
  alamat: string;
  status: string;
  tahun_ajaran?: string;
  rapor_url?: string;
}

export default function PortalTUPage() {
  const [nip, setNip] = useState('');
  const [activeTab, setActiveTab] = useState<'pendaftaran' | 'rapor_arsip' | 'pembayaran' | 'tabungan' | 'tagihan' | 'pengumuman'>('pendaftaran');
  const [students, setStudents] = useState<Student[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [tabunganRecords, setTabunganRecords] = useState<any[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(false);

  // State Filter Data PPDB
  const [filterTahun, setFilterTahun] = useState('2026/2027');
  const [filterStatus, setFilterStatus] = useState('ALL');

  // State Filter Arsip Rapor
  const [filterTahunRapor, setFilterTahunRapor] = useState('2026/2027');
  const [filterStatusRapor, setFilterStatusRapor] = useState('ALL');

  // State Filter Rekap Tabungan
  const [filterTahunTabungan, setFilterTahunTabungan] = useState('2026/2027');
  const [filterKelasTabungan, setFilterKelasTabungan] = useState('ALL');

  // State Tagihan
  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [jenisTagihan, setJenisTagihan] = useState('SPP Bulanan');
  const [nominalTagihan, setNominalTagihan] = useState('');
  const [periodeTagihan, setPeriodeTagihan] = useState('');

  // State Pengumuman
  const [selectedTargetWa, setSelectedTargetWa] = useState('SEMUA');
  const [judulInfo, setJudulInfo] = useState('');
  const [isiInfo, setIsiInfo] = useState('');

  useEffect(() => {
    setNip(localStorage.getItem('userNip') || '198502');
    fetchStudents();
    fetchPayments();
    fetchTabungan();
  }, []);

  const fetchStudents = async () => {
    const { data } = await supabase
      .from('ppdb_pendaftaran')
      .select('*')
      .order('created_at', { ascending: false });
    if (data) setStudents(data);
  };

  const fetchPayments = async () => {
    const { data } = await supabase
      .from('pembayaran_sekolah')
      .select('*, ppdb_pendaftaran(nama_siswa, nama_ortu)')
      .order('created_at', { ascending: false });
    if (data) setPayments(data);
  };

  const fetchTabungan = async () => {
    const { data } = await supabase
      .from('tabungan_siswa')
      .select('*');
    if (data) setTabunganRecords(data);
  };

  const handleUpdateStatus = async (studentId: string, statusBaru: string) => {
    const { error } = await supabase
      .from('ppdb_pendaftaran')
      .update({ status: statusBaru })
      .eq('id', studentId);

    if (error) {
      alert('Gagal memperbarui status: ' + error.message);
    } else {
      alert(`Status siswa berhasil diubah menjadi "${statusBaru}"!`);
      fetchStudents();
    }
  };

  // Filter Khusus Siswa Aktif untuk Dropdown Tagihan & WA
  const activeStudentsOnly = students.filter((st) => {
    const statusUpper = String(st.status || '').toUpperCase();
    return !statusUpper.includes('PINDAH') && !statusUpper.includes('MUTASI') && !statusUpper.includes('LULUS') && !statusUpper.includes('ALUMNI');
  });

  // Hitung Saldo Tabungan per Siswa
  const calculateStudentBalance = (student: Student) => {
    const statusUpper = String(student.status || '').toUpperCase();
    if (statusUpper.includes('PINDAH') || statusUpper.includes('MUTASI') || statusUpper.includes('LULUS') || statusUpper.includes('ALUMNI')) {
      return 0;
    }

    const records = tabunganRecords.filter((r) => r.student_id === student.id);
    return records.reduce((acc, curr) => {
      return curr.tipe === 'SETORAN' ? acc + Number(curr.nominal) : acc - Number(curr.nominal);
    }, 0);
  };

  // 1. BUAT TAGIHAN + WA AUTOMATIC
  const handleCreateBill = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const targetStudent = students.find((s) => s.id === selectedStudentId);

    if (!targetStudent) {
      alert('Silakan pilih siswa terlebih dahulu!');
      setLoading(false);
      return;
    }

    const { error } = await supabase.from('tagihan_sekolah').insert([
      {
        student_id: selectedStudentId,
        jenis_tagihan: jenisTagihan,
        nominal: parseInt(nominalTagihan),
        keterangan: periodeTagihan,
        status: 'BELUM_BAYAR',
      },
    ]);

    if (error) {
      alert('Gagal menerbitkan tagihan: ' + error.message);
      setLoading(false);
      return;
    }

    let waFormatted = targetStudent.no_wa.trim().replace(/[^0-9]/g, '');
    if (waFormatted.startsWith('0')) {
      waFormatted = '62' + waFormatted.slice(1);
    }

    const webUrl = 'https://ra-permatahati.vercel.app/portal-walimurid';
    const message = 
      `Assalamu'alaikum Wr. Wb.\n\n` +
      `Yth. Bapak/Ibu Wali Murid dari *${targetStudent.nama_siswa}*,\n\n` +
      `Pemberitahuan Tagihan Pembayaran Sekolah *RA Permata Hati*:\n` +
      `📌 *Jenis Tagihan:* ${jenisTagihan}\n` +
      `📅 *Periode/Keterangan:* ${periodeTagihan}\n` +
      `💰 *Nominal Tagihan:* Rp ${parseInt(nominalTagihan).toLocaleString('id-ID')}\n\n` +
      `Pembayaran dapat dilakukan secara online via Portal Web Sekolah:\n` +
      `🔗 *Link Portal Wali Murid:* ${webUrl}\n\n` +
      `Terima Kasih.\n*Tata Usaha RA Permata Hati*`;

    const waUrl = `https://wa.me/${waFormatted}?text=${encodeURIComponent(message)}`;
    window.open(waUrl, '_blank');

    alert('Tagihan berhasil diterbitkan! WhatsApp otomatis terbuka.');
    setNominalTagihan('');
    setPeriodeTagihan('');
    setLoading(false);
  };

  // 2. PUBLIKASI PENGUMUMAN + WA AUTOMATIC
  const handleCreateAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.from('pengumuman_sekolah').insert([
      {
        judul: judulInfo,
        isi: isiInfo,
        date: new Date().toISOString().split('T')[0],
      },
    ]);

    if (error) {
      alert('Gagal mempublikasikan informasi: ' + error.message);
      setLoading(false);
      return;
    }

    let targetWaNumber = '';
    if (selectedTargetWa !== 'SEMUA') {
      const targetStudent = students.find((s) => s.id === selectedTargetWa);
      if (targetStudent) {
        targetWaNumber = targetStudent.no_wa;
      }
    } else if (activeStudentsOnly.length > 0) {
      targetWaNumber = activeStudentsOnly[0].no_wa;
    }

    let waFormatted = targetWaNumber.trim().replace(/[^0-9]/g, '');
    if (waFormatted.startsWith('0')) {
      waFormatted = '62' + waFormatted.slice(1);
    }

    const webUrl = 'https://ra-permatahati.vercel.app/portal-walimurid';
    const message = 
      `Assalamu'alaikum Wr. Wb.\n\n` +
      `📢 *INFORMASI & KEGIATAN SEKOLAH RA PERMATA HATI*\n\n` +
      `*Judul:* ${judulInfo}\n\n` +
      `*Detail Informasi:*\n${isiInfo}\n\n` +
      `Pantau terus informasi kegiatan melalui Link Portal Web Sekolah:\n` +
      `🔗 *Link Portal Wali Murid:* ${webUrl}\n\n` +
      `Terima Kasih.\n*Tata Usaha RA Permata Hati*`;

    if (waFormatted) {
      const waUrl = `https://wa.me/${waFormatted}?text=${encodeURIComponent(message)}`;
      window.open(waUrl, '_blank');
    }

    alert('Pengumuman Berhasil Dipublikasikan!');
    setJudulInfo('');
    setIsiInfo('');
    setLoading(false);
  };

  const handlePrintForm = (student: Student) => {
    setSelectedStudent(student);
    setTimeout(() => {
      window.print();
    }, 300);
  };

  // Filter Data PPDB
  const filteredStudents = students.filter((st) => {
    const tahunMatch = (st.tahun_ajaran || '2026/2027') === filterTahun;
    const statusUpper = String(st.status || 'TERDAFTAR').toUpperCase();

    let statusMatch = true;
    if (filterStatus === 'AKTIF') {
      statusMatch = statusUpper.includes('TERDAFTAR') || statusUpper.includes('DITERIMA') || statusUpper.includes('AKTIF');
    } else if (filterStatus === 'PINDAH') {
      statusMatch = statusUpper.includes('PINDAH') || statusUpper.includes('MUTASI');
    } else if (filterStatus === 'ALUMNI') {
      statusMatch = statusUpper.includes('LULUS') || statusUpper.includes('ALUMNI');
    }

    return tahunMatch && statusMatch;
  });

  // Filter Arsip Rapor
  const filteredRaporStudents = students.filter((st) => {
    const tahunMatch = (st.tahun_ajaran || '2026/2027') === filterTahunRapor;
    const statusUpper = String(st.status || 'TERDAFTAR').toUpperCase();

    let statusMatch = true;
    if (filterStatusRapor === 'AKTIF') {
      statusMatch = statusUpper.includes('TERDAFTAR') || statusUpper.includes('DITERIMA') || statusUpper.includes('AKTIF');
    } else if (filterStatusRapor === 'ALUMNI') {
      statusMatch = statusUpper.includes('LULUS') || statusUpper.includes('ALUMNI');
    }

    return tahunMatch && statusMatch;
  });

  // Filter Tabungan Siswa
  const filteredTabunganStudents = students.filter((st) => {
    const tahunMatch = (st.tahun_ajaran || '2026/2027') === filterTahunTabungan;
    const kelasMatch = filterKelasTabungan === 'ALL' || (st.kelompok_kelas || 'Kelas A') === filterKelasTabungan;
    return tahunMatch && kelasMatch;
  });

  // Total Kas Hanya Dari Siswa Aktif
  const totalKasTabunganSekolah = filteredTabunganStudents.reduce((acc, st) => {
    return acc + calculateStudentBalance(st);
  }, 0);

  return (
    <div className="min-h-screen bg-slate-100 p-4 font-sans text-xs">
      <header className="bg-amber-600 text-white p-4 rounded-2xl shadow mb-4 max-w-2xl mx-auto flex justify-between items-center print:hidden">
        <div>
          <h1 className="text-sm font-bold">Portal Tata Usaha (TU)</h1>
          <p className="text-[10px] text-amber-100">NIP: {nip}</p>
        </div>
        <Link href="/login" className="text-xs bg-amber-700 hover:bg-amber-800 text-white px-3 py-1.5 rounded-lg">
          Keluar
        </Link>
      </header>

      <main className="max-w-2xl mx-auto space-y-4 print:hidden">
        {/* NAVIGASI 6 TAB MENU */}
        <div className="grid grid-cols-6 gap-1 bg-white p-1 rounded-xl border shadow-sm text-[9px]">
          <button
            onClick={() => setActiveTab('pendaftaran')}
            className={`py-2 font-bold rounded-lg transition ${
              activeTab === 'pendaftaran' ? 'bg-amber-600 text-white' : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            📋 PPDB
          </button>
          <button
            onClick={() => setActiveTab('rapor_arsip')}
            className={`py-2 font-bold rounded-lg transition ${
              activeTab === 'rapor_arsip' ? 'bg-amber-600 text-white' : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            📁 Rapor
          </button>
          <button
            onClick={() => setActiveTab('pembayaran')}
            className={`py-2 font-bold rounded-lg transition ${
              activeTab === 'pembayaran' ? 'bg-amber-600 text-white' : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            💵 Laporan
          </button>
          <button
            onClick={() => setActiveTab('tabungan')}
            className={`py-2 font-bold rounded-lg transition ${
              activeTab === 'tabungan' ? 'bg-amber-600 text-white' : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            💰 Tabungan
          </button>
          <button
            onClick={() => setActiveTab('tagihan')}
            className={`py-2 font-bold rounded-lg transition ${
              activeTab === 'tagihan' ? 'bg-amber-600 text-white' : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            💳 Tagihan
          </button>
          <button
            onClick={() => setActiveTab('pengumuman')}
            className={`py-2 font-bold rounded-lg transition ${
              activeTab === 'pengumuman' ? 'bg-amber-600 text-white' : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            📢 Info WA
          </button>
        </div>

        {/* TAB 1: DATA PPDB */}
        {activeTab === 'pendaftaran' && (
          <div className="bg-white p-4 rounded-2xl border shadow-sm space-y-3">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b pb-2">
              <h2 className="font-bold text-slate-800">Verifikasi Pendaftaran &amp; Kelola Status Siswa</h2>
              
              <div className="flex flex-wrap gap-1.5">
                <select
                  value={filterTahun}
                  onChange={(e) => setFilterTahun(e.target.value)}
                  className="p-1.5 border rounded-lg bg-slate-50 font-bold text-amber-800 text-[10px]"
                >
                  <option value="2026/2027">T.A. 2026/2027</option>
                  <option value="2027/2028">T.A. 2027/2028</option>
                  <option value="2028/2029">T.A. 2028/2029</option>
                </select>

                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="p-1.5 border rounded-lg bg-slate-50 font-bold text-slate-700 text-[10px]"
                >
                  <option value="ALL">Semua Status</option>
                  <option value="AKTIF">🟢 Aktif / Diterima</option>
                  <option value="PINDAH">🔴 Pindah Sekolah</option>
                  <option value="ALUMNI">🎓 Alumni (Lulus)</option>
                </select>
              </div>
            </div>

            {filteredStudents.length === 0 ? (
              <p className="text-center text-slate-400 py-4">Belum ada data pendaftaran siswa pada kategori ini.</p>
            ) : (
              <div className="space-y-3">
                {filteredStudents.map((st) => {
                  const statusUpper = String(st.status || '').toUpperCase();
                  const isDiterima = statusUpper.includes('DITERIMA');
                  const isPindah = statusUpper.includes('PINDAH') || statusUpper.includes('MUTASI');
                  const isLulus = statusUpper.includes('LULUS') || statusUpper.includes('ALUMNI');

                  return (
                    <div key={st.id} className="p-3 bg-slate-50 border rounded-xl space-y-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-bold text-slate-800">{st.nama_siswa} ({st.kelompok_kelas || 'Kelas A'})</p>
                          <p className="text-[10px] text-slate-500">Wali: {st.nama_ortu || st.nama_ayah} | WA: {st.no_wa}</p>
                        </div>
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          isDiterima 
                            ? 'bg-emerald-100 text-emerald-800' 
                            : isPindah 
                            ? 'bg-rose-100 text-rose-800' 
                            : isLulus
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          {st.status || 'TERDAFTAR'}
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-1.5 pt-1 border-t">
                        <button
                          onClick={() => handleUpdateStatus(st.id, 'DITERIMA')}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] px-2.5 py-1 rounded-lg font-semibold flex items-center gap-1"
                        >
                          ✓ Set Diterima
                        </button>
                        <button
                          onClick={() => handleUpdateStatus(st.id, 'PINDAH_SEKOLAH')}
                          className="bg-rose-600 hover:bg-rose-700 text-white text-[10px] px-2.5 py-1 rounded-lg font-semibold flex items-center gap-1"
                        >
                          ✕ Set Pindah Sekolah
                        </button>
                        <button
                          onClick={() => handleUpdateStatus(st.id, 'LULUS')}
                          className="bg-blue-600 hover:bg-blue-700 text-white text-[10px] px-2.5 py-1 rounded-lg font-semibold flex items-center gap-1"
                        >
                          🎓 Set Alumni (Lulus)
                        </button>
                        <button
                          onClick={() => handlePrintForm(st)}
                          className="bg-sky-500 hover:bg-sky-600 text-white text-[10px] px-2.5 py-1 rounded-lg font-bold transition flex items-center gap-1"
                        >
                          📥 Download Formulir PDF
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: ARSIP RAPOR */}
        {activeTab === 'rapor_arsip' && (
          <div className="bg-white p-4 rounded-2xl border shadow-sm space-y-3">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b pb-2">
              <div>
                <h2 className="font-bold text-slate-800">📂 Unduh Rapor Digital RDM (Arsip Fisik Sekolah)</h2>
                <p className="text-slate-500 text-[10px]">Cari &amp; cetak arsip rapor siswa berdasarkan Tahun Ajaran &amp; Status Alumni.</p>
              </div>

              <div className="flex flex-wrap gap-1.5">
                <select
                  value={filterTahunRapor}
                  onChange={(e) => setFilterTahunRapor(e.target.value)}
                  className="p-1.5 border rounded-lg bg-slate-50 font-bold text-amber-800 text-[10px]"
                >
                  <option value="2026/2027">T.A. 2026/2027</option>
                  <option value="2027/2028">T.A. 2027/2028</option>
                  <option value="2028/2029">T.A. 2028/2029</option>
                </select>

                <select
                  value={filterStatusRapor}
                  onChange={(e) => setFilterStatusRapor(e.target.value)}
                  className="p-1.5 border rounded-lg bg-slate-50 font-bold text-slate-700 text-[10px]"
                >
                  <option value="ALL">Semua Siswa</option>
                  <option value="AKTIF">🟢 Siswa Aktif</option>
                  <option value="ALUMNI">🎓 Alumni (Lulus)</option>
                </select>
              </div>
            </div>

            {filteredRaporStudents.length === 0 ? (
              <p className="text-center text-slate-400 py-4">Belum ada data arsip rapor pada Tahun Ajaran/Kategori ini.</p>
            ) : (
              <div className="space-y-3">
                {filteredRaporStudents.map((st) => (
                  <div key={st.id} className="p-3 bg-slate-50 border rounded-xl flex items-center justify-between">
                    <div>
                      <p className="font-bold text-slate-800">
                        {st.nama_siswa} 
                        <span className="text-[10px] text-amber-800 font-mono ml-2 font-normal">({st.tahun_ajaran || '2026/2027'})</span>
                      </p>
                      <p className="text-[10px] text-slate-500">
                        Kelompok: <strong>{st.kelompok_kelas || 'Kelas A'}</strong> | 
                        Status: <span className="font-bold text-slate-700">{st.status || 'TERDAFTAR'}</span> | 
                        File Rapor: <span className={st.rapor_url ? "text-emerald-700 font-bold" : "text-amber-700 font-bold"}>
                          {st.rapor_url ? 'Siap Dicetak' : 'Belum Ada'}
                        </span>
                      </p>
                    </div>

                    {st.rapor_url ? (
                      <a
                        href={st.rapor_url}
                        target="_blank"
                        rel="noreferrer"
                        className="bg-blue-600 hover:bg-blue-700 text-white text-[10px] px-3 py-1.5 rounded-lg font-bold transition flex items-center gap-1"
                      >
                        🖨️ Cetak Rapor PDF
                      </a>
                    ) : (
                      <button onClick={() => alert('File Rapor belum diunggah oleh Guru Kelas.')} className="bg-slate-200 text-slate-500 text-[10px] px-3 py-1.5 rounded-lg font-bold">
                        Belum Ada File
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: LAPORAN BAYAR */}
        {activeTab === 'pembayaran' && (
          <div className="bg-white p-4 rounded-2xl border shadow-sm space-y-3">
            <h2 className="font-bold text-slate-800 border-b pb-2">Laporan Pembayaran Masuk &amp; Bukti Transfer</h2>
            {payments.length === 0 ? (
              <p className="text-center text-slate-400 py-4">Belum ada riwayat pembayaran dari wali murid.</p>
            ) : (
              <div className="space-y-3">
                {payments.map((p) => (
                  <div key={p.id} className="p-3 bg-emerald-50/50 border border-emerald-200 rounded-xl space-y-1">
                    <div className="flex justify-between font-bold text-emerald-900">
                      <span>{p.ppdb_pendaftaran?.nama_siswa || 'Siswa'} - {p.jenis_pembayaran}</span>
                      <span className="text-[10px] bg-emerald-200 text-emerald-800 px-2 py-0.5 rounded-full">{p.status}</span>
                    </div>
                    <p className="text-[10px] text-slate-600">Periode: {p.periode} | Metode: {p.metode_pembayaran}</p>
                    <p className="font-mono font-bold text-slate-800">
                      Total Masuk: Rp {Number(p.total_bayar).toLocaleString('id-ID')} (Inc. Admin Rp 2.000)
                    </p>
                    <button
                      onClick={() => alert(`Mengunduh bukti kuitansi pembayaran ${p.no_kuitansi}...`)}
                      className="bg-blue-600 hover:bg-blue-700 text-white text-[10px] px-2.5 py-1 rounded-lg font-bold mt-1"
                    >
                      📄 Download Bukti Kuitansi
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 4: TABUNGAN SISWA */}
        {activeTab === 'tabungan' && (
          <div className="bg-white p-4 rounded-2xl border shadow-sm space-y-3">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b pb-2">
              <div>
                <h2 className="font-bold text-slate-800">💰 Kontrol &amp; Rekapitulasi Tabungan Siswa</h2>
                <p className="text-slate-500 text-[10px]">Pantau total saldo tabungan terintegrasi dari inputan Guru Kelas.</p>
              </div>

              <div className="flex flex-wrap gap-1.5">
                <select
                  value={filterTahunTabungan}
                  onChange={(e) => setFilterTahunTabungan(e.target.value)}
                  className="p-1.5 border rounded-lg bg-slate-50 font-bold text-amber-800 text-[10px]"
                >
                  <option value="2026/2027">T.A. 2026/2027</option>
                  <option value="2027/2028">T.A. 2027/2028</option>
                  <option value="2028/2029">T.A. 2028/2029</option>
                </select>

                <select
                  value={filterKelasTabungan}
                  onChange={(e) => setFilterKelasTabungan(e.target.value)}
                  className="p-1.5 border rounded-lg bg-slate-50 font-bold text-slate-700 text-[10px]"
                >
                  <option value="ALL">Semua Kelas</option>
                  <option value="Kelas A">Kelas A</option>
                  <option value="Kelas B">Kelas B</option>
                </select>
              </div>
            </div>

            <div className="bg-gradient-to-r from-emerald-700 to-teal-800 text-white p-3.5 rounded-xl flex justify-between items-center shadow-xs">
              <div>
                <p className="text-[10px] text-emerald-200 uppercase font-extrabold">Total Kas Tabungan Aktif ({filterKelasTabungan})</p>
                <h3 className="text-lg font-mono font-black mt-0.5">Rp {totalKasTabunganSekolah.toLocaleString('id-ID')}</h3>
              </div>
              <span className="text-2xl">🏦</span>
            </div>

            {filteredTabunganStudents.length === 0 ? (
              <p className="text-center text-slate-400 py-4">Belum ada siswa pada filter kelas/tahun ajaran ini.</p>
            ) : (
              <div className="space-y-2">
                {filteredTabunganStudents.map((st) => {
                  const saldoSiswa = calculateStudentBalance(st);
                  const statusUpper = String(st.status || '').toUpperCase();
                  const isPindah = statusUpper.includes('PINDAH') || statusUpper.includes('MUTASI');
                  const isLulus = statusUpper.includes('LULUS') || statusUpper.includes('ALUMNI');

                  return (
                    <div key={st.id} className="p-3 bg-slate-50 border rounded-xl space-y-1.5">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-bold text-slate-800">
                            {st.nama_siswa}
                            <span className="text-[10px] text-slate-500 font-normal ml-2">({st.kelompok_kelas || 'Kelas A'})</span>
                          </p>
                          <p className="text-[10px] text-slate-500">Wali: {st.nama_ortu || st.nama_ayah} | T.A. {st.tahun_ajaran || '2026/2027'}</p>
                        </div>

                        <div className="text-right">
                          <p className="text-[9px] text-slate-400 uppercase font-bold">Saldo Akhir</p>
                          <p className={`font-mono font-extrabold text-xs ${isPindah || isLulus ? 'text-slate-400 line-through' : 'text-emerald-700'}`}>
                            Rp {saldoSiswa.toLocaleString('id-ID')}
                          </p>
                        </div>
                      </div>

                      {isPindah && (
                        <div className="bg-rose-50 border border-rose-200 p-2 rounded-lg text-[10px] text-rose-800 font-medium">
                          🔴 <strong>Siswa Non-Aktif (Pindah/Mutasi):</strong> Tabungan sudah ditutup dan seluruh dana telah ditarik/dicairkan oleh wali murid pada tanggal kepindahan.
                        </div>
                      )}

                      {isLulus && (
                        <div className="bg-blue-50 border border-blue-200 p-2 rounded-lg text-[10px] text-blue-800 font-medium">
                          🎓 <strong>Siswa Lulus (Alumni):</strong> Tabungan telah diserahterimakan/ditarik penuh oleh wali murid saat acara pelepasan siswa.
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 5: BUAT TAGIHAN (HANYA MENGGUNAKAN DROPDOWN SISWA AKTIF) */}
        {activeTab === 'tagihan' && (
          <div className="bg-white p-4 rounded-2xl border shadow-sm space-y-3">
            <h2 className="font-bold text-slate-800 border-b pb-2">Buat Tagihan Biaya Sekolah Baru</h2>
            <form onSubmit={handleCreateBill} className="space-y-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Pilih Siswa Target (Hanya Siswa Aktif)</label>
                <select
                  value={selectedStudentId}
                  onChange={(e) => setSelectedStudentId(e.target.value)}
                  required
                  className="w-full p-2.5 border rounded-xl bg-slate-50 font-medium"
                >
                  <option value="">-- Pilih Siswa Aktif --</option>
                  {activeStudentsOnly.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.nama_siswa} ({s.kelompok_kelas || 'Kelas A'}) - WA: {s.no_wa}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Jenis Tagihan</label>
                <select
                  value={jenisTagihan}
                  onChange={(e) => setJenisTagihan(e.target.value)}
                  className="w-full p-2.5 border rounded-xl bg-slate-50"
                >
                  <option value="SPP Bulanan">SPP Bulanan</option>
                  <option value="Biaya Pendaftaran">Biaya Pendaftaran (PPDB)</option>
                  <option value="Biaya Kegiatan Sekolah">Biaya Kegiatan Sekolah / Ekskul</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Nominal (Rp)</label>
                <input
                  type="number"
                  required
                  placeholder="200000"
                  value={nominalTagihan}
                  onChange={(e) => setNominalTagihan(e.target.value)}
                  className="w-full p-2.5 border rounded-xl bg-slate-50 font-mono"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Periode / Keterangan</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Agustus 2026"
                  value={periodeTagihan}
                  onChange={(e) => setPeriodeTagihan(e.target.value)}
                  className="w-full p-2.5 border rounded-xl bg-slate-50"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-amber-600 hover:bg-amber-700 text-white py-2.5 rounded-xl font-bold transition flex items-center justify-center gap-2"
              >
                {loading ? 'Memproses...' : '📲 Terbitkan Tagihan & Kirim ke WA Wali Murid'}
              </button>
            </form>
          </div>
        )}

        {/* TAB 6: PUBLIKASI PENGUMUMAN (HANYA MENGGUNAKAN DROPDOWN SISWA AKTIF) */}
        {activeTab === 'pengumuman' && (
          <div className="bg-white p-4 rounded-2xl border shadow-sm space-y-3">
            <h2 className="font-bold text-slate-800 border-b pb-2">Publikasi Informasi Kegiatan Sekolah</h2>
            <form onSubmit={handleCreateAnnouncement} className="space-y-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Pilih Wali Murid Penerima</label>
                <select
                  value={selectedTargetWa}
                  onChange={(e) => setSelectedTargetWa(e.target.value)}
                  className="w-full p-2.5 border rounded-xl bg-slate-50 font-medium"
                >
                  <option value="SEMUA">-- Kirim Pesan WA Ke Wali Murid --</option>
                  {activeStudentsOnly.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.nama_siswa} - WA: {s.no_wa}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Judul Kegiatan / Pengumuman</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Pelaksanaan Manasik Haji Cilik RA Permata Hati"
                  value={judulInfo}
                  onChange={(e) => setJudulInfo(e.target.value)}
                  className="w-full p-2.5 border rounded-xl bg-slate-50"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Detail Informasi Kegiatan</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Tuliskan jadwal, pakaian, dan perlengkapan..."
                  value={isiInfo}
                  onChange={(e) => setIsiInfo(e.target.value)}
                  className="w-full p-2.5 border rounded-xl bg-slate-50"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-amber-600 hover:bg-amber-700 text-white py-2.5 rounded-xl font-bold transition flex items-center justify-center gap-2"
              >
                {loading ? 'Mengirim...' : '📲 Publikasikan & Kirim Info ke WA Wali Murid'}
              </button>
            </form>
          </div>
        )}
      </main>

      {/* TEMPLATE PRINT FORMULIR PPDB */}
      {selectedStudent && (
        <div className="hidden print:block p-8 bg-white text-black font-sans text-xs space-y-4">
          <div className="text-center border-b-2 border-black pb-3 space-y-1">
            <h1 className="text-lg font-black uppercase tracking-wider">RAUDHATUL ATHFAL (RA) PERMATA HATI</h1>
            <p className="text-[10px]">Izin Operasional Kemenag RI | Jl. Pendidikan No. 01 Permata Hati</p>
            <p className="text-[10px] font-bold">FORMULIR PENDAFTARAN PESERTA DIDIK BARU (PPDB)</p>
          </div>

          <div className="text-right">
            <span className="border border-black px-3 py-1 font-bold text-[10px] uppercase">
              STATUS: {selectedStudent.status || 'TERDAFTAR'}
            </span>
          </div>

          <div className="space-y-2 pt-2">
            <p className="font-bold border-b pb-1">I. IDENTITAS CALON SISWA</p>
            <table className="w-full border-collapse text-xs">
              <tbody>
                <tr>
                  <td className="py-1 w-1/3 text-gray-600">Nama Lengkap Siswa</td>
                  <td className="py-1 font-bold">: {selectedStudent.nama_siswa}</td>
                </tr>
                <tr>
                  <td className="py-1 text-gray-600">NIK (Sesuai KK)</td>
                  <td className="py-1 font-mono">: {selectedStudent.nik || '-'}</td>
                </tr>
                <tr>
                  <td className="py-1 text-gray-600">Tempat, Tanggal Lahir</td>
                  <td className="py-1">: {selectedStudent.tempat_lahir || '-'}, {selectedStudent.tanggal_lahir || '-'}</td>
                </tr>
                <tr>
                  <td className="py-1 text-gray-600">Kelompok Belajar</td>
                  <td className="py-1 font-bold">: {selectedStudent.kelompok_kelas || 'Kelas A'}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="space-y-2 pt-2">
            <p className="font-bold border-b pb-1">II. IDENTITAS ORANG TUA / WALI</p>
            <table className="w-full border-collapse text-xs">
              <tbody>
                <tr>
                  <td className="py-1 w-1/3 text-gray-600">Nama Ayah Kandung</td>
                  <td className="py-1 font-bold">: {selectedStudent.nama_ayah || selectedStudent.nama_ortu}</td>
                </tr>
                <tr>
                  <td className="py-1 text-gray-600">Pekerjaan Ayah</td>
                  <td className="py-1">: {selectedStudent.pekerjaan_ayah || '-'}</td>
                </tr>
                <tr>
                  <td className="py-1 text-gray-600">Nama Ibu Kandung</td>
                  <td className="py-1 font-bold">: {selectedStudent.nama_ibu || '-'}</td>
                </tr>
                <tr>
                  <td className="py-1 text-gray-600">Pekerjaan Ibu</td>
                  <td className="py-1">: {selectedStudent.pekerjaan_ibu || '-'}</td>
                </tr>
                <tr>
                  <td className="py-1 text-gray-600">No. WhatsApp Wali</td>
                  <td className="py-1 font-mono">: {selectedStudent.no_wa}</td>
                </tr>
                <tr>
                  <td className="py-1 text-gray-600">Alamat Tempat Tinggal</td>
                  <td className="py-1">: {selectedStudent.alamat}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="pt-8 flex justify-between text-center text-xs">
            <div>
              <p>Panitia PPDB,</p>
              <br /><br /><br />
              <p className="font-bold underline">(....................................)</p>
            </div>
            <div>
              <p>Petugas Tata Usaha,</p>
              <br /><br /><br />
              <p className="font-bold underline">NIP. {nip || '198502'}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}