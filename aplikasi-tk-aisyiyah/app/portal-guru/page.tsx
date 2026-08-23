"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '../supabase';

interface Student {
  id: string;
  nama_siswa: string;
  kelompok_kelas: string;
  status: string;
  tahun_ajaran?: string;
  rapor_url?: string;
}

export default function PortalGuruPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [activeTab, setActiveTab] = useState<'jurnal' | 'tabungan' | 'rapor'>('jurnal');
  const [loading, setLoading] = useState(false);

  // State Filter Tahun Ajaran untuk Portal Guru
  const [filterTahunGuru, setFilterTahunGuru] = useState('2026/2027');

  // State Form Jurnal Harian
  const [tanggalJurnal, setTanggalJurnal] = useState(new Date().toISOString().split('T')[0]);
  const [jurnalItems, setJurnalItems] = useState({
    dhuha: true,
    hafalan: true,
    adab: true,
    iqra: true,
    angka: true,
    melukis: true,
    ekskul: true,
    olahraga: true,
    outdoor: true,
  });

  // State Form Tabungan
  const [tipeTabungan, setTipeTabungan] = useState<'SETORAN' | 'PENARIKAN'>('SETORAN');
  const [nominalTabungan, setNominalTabungan] = useState('');
  const [keteranganTabungan, setKeteranganTabungan] = useState('');
  const [tabunganHistory, setTabunganHistory] = useState<any[]>([]);

  // State Form Rapor RDM
  const [raporFile, setRaporFile] = useState<File | null>(null);

  useEffect(() => {
    fetchStudents();
  }, []);

  useEffect(() => {
    if (selectedStudentId) {
      fetchTabunganHistory(selectedStudentId);
    }
  }, [selectedStudentId]);

  const fetchStudents = async () => {
    const { data } = await supabase
      .from('ppdb_pendaftaran')
      .select('*')
      .order('nama_siswa', { ascending: true });
    if (data) setStudents(data);
  };

  const fetchTabunganHistory = async (studentId: string) => {
    const { data } = await supabase
      .from('tabungan_siswa')
      .select('*')
      .eq('student_id', studentId)
      .order('created_at', { ascending: false });
    if (data) setTabunganHistory(data);
  };

  // Filter Khusus Siswa Aktif berdasarkan Status DAN Tahun Ajaran
  const activeStudentsGuru = students.filter((st) => {
    const statusUpper = String(st.status || '').toUpperCase();
    const tahunMatch = (st.tahun_ajaran || '2026/2027') === filterTahunGuru;

    const isAktif =
      !statusUpper.includes('PINDAH') &&
      !statusUpper.includes('MUTASI') &&
      !statusUpper.includes('LULUS') &&
      !statusUpper.includes('ALUMNI');

    return isAktif && tahunMatch;
  });

  // Data Siswa Terpilih
  const selectedStudent = students.find((s) => s.id === selectedStudentId);

  // Hitung Saldo Tabungan Siswa Terpilih
  const currentStudentBalance = tabunganHistory.reduce((acc, curr) => {
    return curr.tipe === 'SETORAN' ? acc + Number(curr.nominal) : acc - Number(curr.nominal);
  }, 0);

  // 1. HANDLER SIMPAN JURNAL
  const handleSaveJurnal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudentId) {
      alert('Silakan pilih siswa aktif terlebih dahulu!');
      return;
    }
    setLoading(true);

    const { error } = await supabase.from('jurnal_harian').insert([
      {
        student_id: selectedStudentId,
        tanggal: tanggalJurnal,
        aktivitas: jurnalItems,
      },
    ]);

    if (error) {
      alert('Gagal menyimpan jurnal: ' + error.message);
    } else {
      alert(`Jurnal harian untuk ${selectedStudent?.nama_siswa} berhasil disimpan!`);
    }
    setLoading(false);
  };

  // 2. HANDLER SIMPAN TABUNGAN
  const handleSaveTabungan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudentId) {
      alert('Silakan pilih siswa aktif terlebih dahulu!');
      return;
    }
    setLoading(true);

    const nominalNum = parseInt(nominalTabungan);
    if (tipeTabungan === 'PENARIKAN' && nominalNum > currentStudentBalance) {
      alert('Gagal! Saldo tabungan siswa tidak mencukupi untuk penarikan ini.');
      setLoading(false);
      return;
    }

    const { error } = await supabase.from('tabungan_siswa').insert([
      {
        student_id: selectedStudentId,
        tipe: tipeTabungan,
        nominal: nominalNum,
        keterangan: keteranganTabungan || (tipeTabungan === 'SETORAN' ? 'Setoran Tabungan' : 'Penarikan Tabungan'),
      },
    ]);

    if (error) {
      alert('Gagal mencatat transaksi tabungan: ' + error.message);
    } else {
      alert(`Transaksi tabungan berhasil dicatat!`);
      setNominalTabungan('');
      setKeteranganTabungan('');
      fetchTabunganHistory(selectedStudentId);
    }
    setLoading(false);
  };

  // 3. HANDLER UPLOAD RAPOR RDM
  const handleUploadRapor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudentId || !raporFile) {
      alert('Silakan pilih siswa dan file PDF Rapor terlebih dahulu!');
      return;
    }
    setLoading(true);

    const fileExt = raporFile.name.split('.').pop();
    const fileName = `rapor_${selectedStudentId}_${Date.now()}.${fileExt}`;
    const filePath = `rapor_digital/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('rapor_bucket')
      .upload(filePath, raporFile);

    if (uploadError) {
      alert('Gagal mengunggah file rapor: ' + uploadError.message);
      setLoading(false);
      return;
    }

    const { data: publicUrlData } = supabase.storage
      .from('rapor_bucket')
      .getPublicUrl(filePath);

    const { error: updateError } = await supabase
      .from('ppdb_pendaftaran')
      .update({ rapor_url: publicUrlData.publicUrl })
      .eq('id', selectedStudentId);

    if (updateError) {
      alert('Gagal memperbarui link rapor siswa: ' + updateError.message);
    } else {
      alert(`Rapor Digital RDM untuk ${selectedStudent?.nama_siswa} berhasil diunggah!`);
      setRaporFile(null);
      fetchStudents();
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-100 p-4 font-sans text-xs">
      {/* HEADER PORTAL GURU */}
      <header className="bg-emerald-800 text-white p-4 rounded-2xl shadow mb-4 max-w-xl mx-auto flex justify-between items-center">
        <div>
          <h1 className="text-sm font-bold">Portal Guru Kelas</h1>
          <p className="text-[10px] text-emerald-200">RA PERMATA HATI</p>
        </div>
        <Link href="/login" className="text-xs bg-emerald-900 hover:bg-emerald-950 text-white px-3 py-1.5 rounded-lg">
          Kembali
        </Link>
      </header>

      <main className="max-w-xl mx-auto space-y-4">
        {/* SECTION FILTER: PILIH SISWA AKTIF + TAHUN AJARAN */}
        <div className="bg-white p-4 rounded-2xl border shadow-sm space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 items-center">
            
            {/* Dropdown 1: Pilih Siswa Aktif */}
            <div className="sm:col-span-2">
              <label className="block font-bold text-slate-700 text-[10px] mb-1">
                👤 Pilih Siswa Aktif:
              </label>
              <select
                value={selectedStudentId}
                onChange={(e) => setSelectedStudentId(e.target.value)}
                className="w-full p-2.5 border rounded-xl bg-emerald-50/50 font-bold text-emerald-900 border-emerald-300 text-xs focus:ring-2 focus:ring-emerald-500"
              >
                <option value="">-- Pilih Siswa ({filterTahunGuru}) --</option>
                {activeStudentsGuru.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.nama_siswa} ({s.kelompok_kelas || 'Kelas A'})
                  </option>
                ))}
              </select>
            </div>

            {/* Dropdown 2: Tahun Ajaran */}
            <div>
              <label className="block font-bold text-slate-700 text-[10px] mb-1">
                📅 Tahun Ajaran:
              </label>
              <select
                value={filterTahunGuru}
                onChange={(e) => {
                  setFilterTahunGuru(e.target.value);
                  setSelectedStudentId(''); // Reset pilihan siswa jika tahun ajaran diganti
                }}
                className="w-full p-2.5 border rounded-xl bg-slate-50 font-bold text-slate-800 border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500"
              >
                <option value="2026/2027">T.A. 2026/2027</option>
                <option value="2027/2028">T.A. 2027/2028</option>
                <option value="2028/2029">T.A. 2028/2029</option>
              </select>
            </div>

          </div>

          {/* TAB NAVIGASI MODUL GURU */}
          <div className="grid grid-cols-3 gap-1 bg-slate-100 p-1 rounded-xl text-[10px]">
            <button
              onClick={() => setActiveTab('jurnal')}
              className={`py-2 font-bold rounded-lg transition ${
                activeTab === 'jurnal' ? 'bg-emerald-700 text-white' : 'text-slate-600 hover:bg-slate-200'
              }`}
            >
              📖 Jurnal
            </button>
            <button
              onClick={() => setActiveTab('tabungan')}
              className={`py-2 font-bold rounded-lg transition ${
                activeTab === 'tabungan' ? 'bg-emerald-700 text-white' : 'text-slate-600 hover:bg-slate-200'
              }`}
            >
              💰 Tabungan
            </button>
            <button
              onClick={() => setActiveTab('rapor')}
              className={`py-2 font-bold rounded-lg transition ${
                activeTab === 'rapor' ? 'bg-emerald-700 text-white' : 'text-slate-600 hover:bg-slate-200'
              }`}
            >
              📄 Rapor RDM
            </button>
          </div>
        </div>

        {/* TAB 1: INPUT JURNAL AKTIVITAS HARIAN */}
        {activeTab === 'jurnal' && (
          <div className="bg-white p-4 rounded-2xl border shadow-sm space-y-3">
            <h2 className="font-bold text-slate-800 border-b pb-2 flex items-center gap-1">
              📋 Input Aktivitas Harian Siswa
            </h2>

            <form onSubmit={handleSaveJurnal} className="space-y-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Tanggal Aktivitas</label>
                <input
                  type="date"
                  required
                  value={tanggalJurnal}
                  onChange={(e) => setTanggalJurnal(e.target.value)}
                  className="w-full p-2.5 border rounded-xl bg-slate-50 font-medium"
                />
              </div>

              <div className="space-y-2 pt-1">
                <label className="flex items-center gap-2 bg-slate-50 p-2 rounded-lg border cursor-pointer hover:bg-emerald-50">
                  <input
                    type="checkbox"
                    checked={jurnalItems.dhuha}
                    onChange={(e) => setJurnalItems({ ...jurnalItems, dhuha: e.target.checked })}
                    className="w-4 h-4 text-emerald-600 rounded"
                  />
                  <span className="font-semibold text-slate-800">Sholat Dhuha Berjamaah</span>
                </label>

                <label className="flex items-center gap-2 bg-slate-50 p-2 rounded-lg border cursor-pointer hover:bg-emerald-50">
                  <input
                    type="checkbox"
                    checked={jurnalItems.hafalan}
                    onChange={(e) => setJurnalItems({ ...jurnalItems, hafalan: e.target.checked })}
                    className="w-4 h-4 text-emerald-600 rounded"
                  />
                  <span className="font-semibold text-slate-800">Muraja'ah Hafalan Doa &amp; Surah Pendek</span>
                </label>

                <label className="flex items-center gap-2 bg-slate-50 p-2 rounded-lg border cursor-pointer hover:bg-emerald-50">
                  <input
                    type="checkbox"
                    checked={jurnalItems.adab}
                    onChange={(e) => setJurnalItems({ ...jurnalItems, adab: e.target.checked })}
                    className="w-4 h-4 text-emerald-600 rounded"
                  />
                  <span className="font-semibold text-slate-800">Kemandirian &amp; Adab Makan/Minum</span>
                </label>

                <label className="flex items-center gap-2 bg-slate-50 p-2 rounded-lg border cursor-pointer hover:bg-emerald-50">
                  <input
                    type="checkbox"
                    checked={jurnalItems.iqra}
                    onChange={(e) => setJurnalItems({ ...jurnalItems, iqra: e.target.checked })}
                    className="w-4 h-4 text-emerald-600 rounded"
                  />
                  <span className="font-semibold text-slate-800">Membaca (Iqra / Hijaiyah)</span>
                </label>

                <label className="flex items-center gap-2 bg-slate-50 p-2 rounded-lg border cursor-pointer hover:bg-emerald-50">
                  <input
                    type="checkbox"
                    checked={jurnalItems.angka}
                    onChange={(e) => setJurnalItems({ ...jurnalItems, angka: e.target.checked })}
                    className="w-4 h-4 text-emerald-600 rounded"
                  />
                  <span className="font-semibold text-slate-800">Menghitung / Mengenal Angka</span>
                </label>

                <label className="flex items-center gap-2 bg-slate-50 p-2 rounded-lg border cursor-pointer hover:bg-emerald-50">
                  <input
                    type="checkbox"
                    checked={jurnalItems.melukis}
                    onChange={(e) => setJurnalItems({ ...jurnalItems, melukis: e.target.checked })}
                    className="w-4 h-4 text-emerald-600 rounded"
                  />
                  <span className="font-semibold text-slate-800">Melukis / Mewarnai Kreatif</span>
                </label>

                <label className="flex items-center gap-2 bg-slate-50 p-2 rounded-lg border cursor-pointer hover:bg-emerald-50">
                  <input
                    type="checkbox"
                    checked={jurnalItems.ekskul}
                    onChange={(e) => setJurnalItems({ ...jurnalItems, ekskul: e.target.checked })}
                    className="w-4 h-4 text-emerald-600 rounded"
                  />
                  <span className="font-semibold text-slate-800">Kegiatan Ekskul / Seni</span>
                </label>

                <label className="flex items-center gap-2 bg-slate-50 p-2 rounded-lg border cursor-pointer hover:bg-emerald-50">
                  <input
                    type="checkbox"
                    checked={jurnalItems.olahraga}
                    onChange={(e) => setJurnalItems({ ...jurnalItems, olahraga: e.target.checked })}
                    className="w-4 h-4 text-emerald-600 rounded"
                  />
                  <span className="font-semibold text-slate-800">Olahraga / Senam Ceria</span>
                </label>

                <label className="flex items-center gap-2 bg-slate-50 p-2 rounded-lg border cursor-pointer hover:bg-emerald-50">
                  <input
                    type="checkbox"
                    checked={jurnalItems.outdoor}
                    onChange={(e) => setJurnalItems({ ...jurnalItems, outdoor: e.target.checked })}
                    className="w-4 h-4 text-emerald-600 rounded"
                  />
                  <span className="font-semibold text-slate-800">Bermain Outdoor / Motorik</span>
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-emerald-700 hover:bg-emerald-800 text-white py-2.5 rounded-xl font-bold transition mt-2"
              >
                {loading ? 'Menyimpan...' : 'Simpan Jurnal Harian'}
              </button>
            </form>
          </div>
        )}

        {/* TAB 2: TABUNGAN SISWA */}
        {activeTab === 'tabungan' && (
          <div className="bg-white p-4 rounded-2xl border shadow-sm space-y-3">
            <h2 className="font-bold text-slate-800 border-b pb-2 flex items-center gap-1">
              💰 Transaksi Tabungan Siswa
            </h2>

            {selectedStudent ? (
              <div className="bg-gradient-to-r from-emerald-800 to-teal-900 text-white p-3.5 rounded-xl flex justify-between items-center">
                <div>
                  <p className="text-[10px] text-emerald-200 font-bold uppercase">Saldo Tabungan ({selectedStudent.nama_siswa})</p>
                  <h3 className="text-lg font-mono font-black mt-0.5">Rp {currentStudentBalance.toLocaleString('id-ID')}</h3>
                </div>
                <span className="text-2xl">💵</span>
              </div>
            ) : (
              <p className="text-amber-800 bg-amber-50 p-2.5 rounded-xl text-center font-medium border border-amber-200">
                Pilih siswa terlebih dahulu untuk melihat saldo dan mencatat transaksi tabungan.
              </p>
            )}

            <form onSubmit={handleSaveTabungan} className="space-y-3 pt-2">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Tipe Transaksi</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setTipeTabungan('SETORAN')}
                    className={`py-2 font-bold rounded-xl border ${
                      tipeTabungan === 'SETORAN' ? 'bg-emerald-700 text-white border-emerald-700' : 'bg-slate-50 text-slate-700'
                    }`}
                  >
                    📥 Setoran (Masuk)
                  </button>
                  <button
                    type="button"
                    onClick={() => setTipeTabungan('PENARIKAN')}
                    className={`py-2 font-bold rounded-xl border ${
                      tipeTabungan === 'PENARIKAN' ? 'bg-rose-700 text-white border-rose-700' : 'bg-slate-50 text-slate-700'
                    }`}
                  >
                    📤 Penarikan (Keluar)
                  </button>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Nominal (Rp)</label>
                <input
                  type="number"
                  required
                  placeholder="Contoh: 10000"
                  value={nominalTabungan}
                  onChange={(e) => setNominalTabungan(e.target.value)}
                  className="w-full p-2.5 border rounded-xl bg-slate-50 font-mono"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Keterangan / Catatan</label>
                <input
                  type="text"
                  placeholder="Contoh: Tabungan Pekanan / Pembelian Buku"
                  value={keteranganTabungan}
                  onChange={(e) => setKeteranganTabungan(e.target.value)}
                  className="w-full p-2.5 border rounded-xl bg-slate-50"
                />
              </div>

              <button
                type="submit"
                disabled={loading || !selectedStudentId}
                className="w-full bg-emerald-700 hover:bg-emerald-800 text-white py-2.5 rounded-xl font-bold transition"
              >
                {loading ? 'Memproses...' : 'Simpan Transaksi Tabungan'}
              </button>
            </form>

            {/* Riwayat Tabungan Siswa */}
            {selectedStudentId && (
              <div className="pt-3 border-t space-y-2">
                <h3 className="font-bold text-slate-700">Riwayat Transaksi Terakhir</h3>
                {tabunganHistory.length === 0 ? (
                  <p className="text-slate-400 text-center py-2">Belum ada riwayat transaksi tabungan.</p>
                ) : (
                  <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                    {tabunganHistory.map((rec) => (
                      <div key={rec.id} className="p-2 bg-slate-50 rounded-lg border flex justify-between items-center">
                        <div>
                          <p className="font-bold text-slate-800">{rec.keterangan}</p>
                          <p className="text-[9px] text-slate-400">{new Date(rec.created_at).toLocaleDateString('id-ID')}</p>
                        </div>
                        <span className={`font-mono font-bold ${rec.tipe === 'SETORAN' ? 'text-emerald-700' : 'text-rose-700'}`}>
                          {rec.tipe === 'SETORAN' ? '+' : '-'} Rp {Number(rec.nominal).toLocaleString('id-ID')}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: UPLOAD RAPOR DIGITAL RDM */}
        {activeTab === 'rapor' && (
          <div className="bg-white p-4 rounded-2xl border shadow-sm space-y-3">
            <h2 className="font-bold text-slate-800 border-b pb-2 flex items-center gap-1">
              📄 Upload Rapor Digital RDM (File PDF)
            </h2>

            {selectedStudent && (
              <div className="p-3 bg-slate-50 border rounded-xl">
                <p className="font-bold text-slate-800">Siswa Target: {selectedStudent.nama_siswa}</p>
                <p className="text-[10px] text-slate-500">
                  Status File Rapor Saat Ini:{' '}
                  <span className={selectedStudent.rapor_url ? 'text-emerald-700 font-bold' : 'text-amber-700 font-bold'}>
                    {selectedStudent.rapor_url ? 'Sudah Diunggah' : 'Belum Ada'}
                  </span>
                </p>
              </div>
            )}

            <form onSubmit={handleUploadRapor} className="space-y-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Pilih File PDF Rapor</label>
                <input
                  type="file"
                  accept="application/pdf"
                  required
                  onChange={(e) => setRaporFile(e.target.files ? e.target.files[0] : null)}
                  className="w-full p-2 border rounded-xl bg-slate-50 text-xs"
                />
              </div>

              <button
                type="submit"
                disabled={loading || !selectedStudentId}
                className="w-full bg-emerald-700 hover:bg-emerald-800 text-white py-2.5 rounded-xl font-bold transition flex items-center justify-center gap-2"
              >
                {loading ? 'Mengunggah...' : '📤 Upload File Rapor Digital'}
              </button>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}