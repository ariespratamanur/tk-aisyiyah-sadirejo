"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '../supabase';

export default function PortalWaliMuridPage() {
  const [loading, setLoading] = useState(false);

  // Identity State
  const namaSekolah = "TK 'AISYIYAH BUSTANUL ATHFAL SADIREJO";
  const sloganSekolah = "Berakhlak Mulia, Cerdas & Berkemajuan";

  // Login State
  const [loginNama, setLoginNama] = useState('');
  const [loginWa, setLoginWa] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [studentData, setStudentData] = useState<any>(null);
  const [activities, setActivities] = useState<any[]>([]);
  const [historyBayar, setHistoryBayar] = useState<any[]>([]);
  const [historyTabungan, setHistoryTabungan] = useState<any[]>([]);

  // Navigation State
  const [activeTab, setActiveTab] = useState<'home' | 'jurnal' | 'ppdb' | 'pembayaran' | 'infaq' | 'belajar' | 'tabungan' | 'rapor'>('home');

  // Form PPDB State
  const [namaSiswa, setNamaSiswa] = useState('');
  const [nik, setNik] = useState('');
  const [tempatLahir, setTempatLahir] = useState('');
  const [tanggalLahir, setTanggalLahir] = useState('');
  const [kelompokKelas, setKelompokKelas] = useState('Kelas A');
  const [namaAyah, setNamaAyah] = useState('');
  const [pekerjaanAyah, setPekerjaanAyah] = useState('');
  const [namaIbu, setNamaIbu] = useState('');
  const [pekerjaanIbu, setPekerjaanIbu] = useState('');
  const [noWa, setNoWa] = useState('');
  const [alamat, setAlamat] = useState('');

  // Pembayaran Sekolah State
  const [jenisBayar, setJenisBayar] = useState('SPP Bulanan');
  const [periodeBayar, setPeriodeBayar] = useState('Agustus 2026');
  const [metodeBayar, setMetodeBayar] = useState('QRIS');

  // Form Infaq State
  const [programInfaq, setProgramInfaq] = useState('Infaq Jumat Berkah');
  const [nominalInfaq, setNominalInfaq] = useState<number>(1000);
  const [metodeInfaq, setMetodeInfaq] = useState('QRIS');
  const biayaAdminInfaq = 500;
  const totalInfaqBayar = (nominalInfaq || 0) + biayaAdminInfaq;

  // Fitur Belajar Digital State
  const [kategoriBelajar, setKategoriBelajar] = useState<'doa' | 'surah' | 'hijaiyah' | 'kisah'>('doa');

  const materiDoa = [
    { id: 1, judul: 'Doa Sebelum Makan (HPT Tarjih)', arab: 'بِسْمِ اللَّهِ', arti: 'Dengan menyebut nama Allah' },
    { id: 2, judul: 'Doa Untuk Kedua Orang Tua', arab: 'رَبِّ اغْفِرْ لِيْ وَلِوَالِدَيَّ وَارْحَمْهُمَا كَمَا رَبَّيَانِيْ صَغِيْرًا', arti: 'Ya Tuhanku, ampunilah aku dan kedua orang tuaku, dan kasihilah mereka sebagaimana mereka mengasuhku sewaktu kecil.' },
    { id: 3, judul: 'Lagu Mars Bustanul Athfal / Aisyiyah', arab: '🎵 Wahai tunas \'Aisyiyah melati suci...', arti: 'Lagu Wajib TK \'Aisyiyah Bustanul Athfal' },
  ];

  const materiSurah = [
    { id: 1, nama: 'Surah Al-Fatihah', ayat: 7, ket: 'Pembukaan Al-Qur\'an' },
    { id: 2, nama: 'Surah Al-Ikhlas', ayat: 4, ket: 'Kemurnian Esa Allah' },
    { id: 3, nama: 'Surah Al-Falaq', ayat: 5, ket: 'Perlindungan Waktu Subuh' },
    { id: 4, nama: 'Surah An-Nas', ayat: 6, ket: 'Perlindungan Manusia' },
  ];

  const nominalMap: Record<string, number> = {
    'SPP Bulanan': 200000,
    'Biaya Pendaftaran': 1500000,
    'Biaya Kegiatan Sekolah': 300000,
  };
  const nominalDasar = nominalMap[jenisBayar] || 200000;

  const isSPP = jenisBayar === 'SPP Bulanan';
  const biayaAdmin = isSPP ? 10000 : 2000;
  const labelBiayaAdmin = isSPP ? 'Biaya Akademik Digital:' : 'Biaya Admin Sistem:';
  const totalBayar = nominalDasar + biayaAdmin;

  // Hitung Total Saldo Tabungan Siswa
  const totalSaldoTabungan = historyTabungan.reduce((acc, curr) => {
    return curr.tipe === 'SETORAN' ? acc + Number(curr.nominal) : acc - Number(curr.nominal);
  }, 0);

  // Login Handler Fix
  const handleLogin = async (e?: React.FormEvent, inputNama?: string, inputWa?: string) => {
    if (e) e.preventDefault();
    setLoading(true);

    const targetNama = (inputNama || loginNama).trim();
    const targetWa = (inputWa || loginWa).trim();

    const cleanWa = targetWa.replace(/[^0-9]/g, '');
    const cleanNama = targetNama.toLowerCase();

    const { data: listPendaftaran } = await supabase.from('ppdb_pendaftaran').select('*');

    let matched = null;
    if (listPendaftaran) {
      matched = listPendaftaran.find((item) => {
        const itemWa = String(item.no_wa || '').replace(/[^0-9]/g, '');
        const ortu = String(item.nama_ortu || item.nama_ayah || '').toLowerCase();
        const ibu = String(item.nama_ibu || '').toLowerCase();
        return (itemWa === cleanWa || itemWa.endsWith(cleanWa) || cleanWa.endsWith(itemWa)) && (ortu.includes(cleanNama) || ibu.includes(cleanNama) || cleanNama.includes(ortu));
      });
    }

    if (!matched) {
      const newStudentPlaceholder = {
        id: 'new-' + Date.now(),
        nama_siswa: 'Nama Anak Belum Diisi',
        nama_ortu: targetNama,
        no_wa: targetWa,
        kelompok_kelas: 'Kelas A',
        status: 'BELUM PPDB'
      };
      setStudentData(newStudentPlaceholder);
      setIsLoggedIn(true);
      setHistoryTabungan([]);
      setNamaAyah(targetNama);
      setNoWa(targetWa);
      setActiveTab('ppdb');
    } else {
      setStudentData(matched);
      setIsLoggedIn(true);
      fetchActivities(matched.id);
      fetchPaymentHistory(matched.id);
      fetchTabungan(matched.id);
    }
    setLoading(false);
  };

  useEffect(() => {
    const savedNama = localStorage.getItem('nama_wali');
    const savedWa = localStorage.getItem('no_wa');

    if (savedNama && savedWa) {
      setLoginNama(savedNama);
      setLoginWa(savedWa);
      handleLogin(undefined, savedNama, savedWa);
    }
  }, []);

  const fetchActivities = async (studentId: string) => {
    const { data } = await supabase
      .from('daily_activities')
      .select('*')
      .eq('student_id', studentId)
      .order('date', { ascending: false });

    if (data) setActivities(data);
  };

  const fetchPaymentHistory = async (studentId: string) => {
    const { data } = await supabase
      .from('pembayaran_sekolah')
      .select('*')
      .eq('student_id', studentId)
      .order('created_at', { ascending: false });

    if (data) setHistoryBayar(data);
  };

  const fetchTabungan = async (studentId: string) => {
    if (studentId.startsWith('new-')) {
      setHistoryTabungan([]);
      return;
    }
    const { data } = await supabase
      .from('tabungan_siswa')
      .select('*')
      .eq('student_id', studentId)
      .order('created_at', { ascending: false });

    if (data) {
      setHistoryTabungan(data);
    } else {
      setHistoryTabungan([]);
    }
  };

  // Simpan PPDB Lengkap Fix
  const handleRegisterPPDB = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const newRecord = {
      nama_siswa: namaSiswa,
      nik: nik,
      tempat_lahir: tempatLahir,
      tanggal_lahir: tanggalLahir,
      kelompok_kelas: kelompokKelas,
      nama_ortu: namaAyah,
      nama_ayah: namaAyah,
      pekerjaan_ayah: pekerjaanAyah,
      nama_ibu: namaIbu,
      pekerjaan_ibu: pekerjaanIbu,
      no_wa: noWa.trim(),
      alamat: alamat,
      status: 'TERDAFTAR',
      tahun_ajaran: '2026/2027',
    };

    const { data, error } = await supabase.from('ppdb_pendaftaran').insert([newRecord]).select();

    if (error) {
      alert('Gagal mengirim pendaftaran PPDB: ' + error.message);
    } else if (data && data.length > 0) {
      alert(`Alhamdulillah! Formulir Pendaftaran ${namaSiswa} Berhasil Terkirim ke TU.`);
      setStudentData(data[0]);
      setHistoryTabungan([]);
      setActiveTab('home');
    }
    setLoading(false);
  };

  // Proses Bayar SPP & Kegiatan
  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const generatedKuitansi = 'KW-ABA-' + Date.now().toString().slice(-6);

    const { error } = await supabase.from('pembayaran_sekolah').insert([
      {
        student_id: studentData.id,
        jenis_pembayaran: jenisBayar,
        periode: periodeBayar,
        nominal: nominalDasar,
        biaya_admin: biayaAdmin,
        total_bayar: totalBayar,
        metode_pembayaran: metodeBayar,
        no_kuitansi: generatedKuitansi,
        status: 'LUNAS / DITERIMA',
      },
    ]);

    if (error) {
      alert('Gagal memproses pembayaran: ' + error.message);
    } else {
      alert(`Pembayaran ${jenisBayar} (${periodeBayar}) Berhasil! Kuitansi Resmi (${generatedKuitansi}) Otomatis Terbit.`);
      fetchPaymentHistory(studentData.id);
      setActiveTab('pembayaran');
    }
    setLoading(false);
  };

  // Proses Infaq Digital
  const handleInfaqSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const generatedKuitansi = 'INF-ABA-' + Date.now().toString().slice(-6);

    const { error } = await supabase.from('pembayaran_sekolah').insert([
      {
        student_id: studentData.id,
        jenis_pembayaran: `Infaq (${programInfaq})`,
        periode: new Date().toLocaleDateString('id-ID', { month: 'long', year: 'numeric' }),
        nominal: nominalInfaq,
        biaya_admin: biayaAdminInfaq,
        total_bayar: totalInfaqBayar,
        metode_pembayaran: metodeInfaq,
        no_kuitansi: generatedKuitansi,
        status: 'LUNAS / DITERIMA',
      },
    ]);

    if (error) {
      alert('Gagal menyalurkan infaq: ' + error.message);
    } else {
      alert(`Jazakumullah Khairan! Infaq (${programInfaq}) sebesar Rp ${nominalInfaq.toLocaleString('id-ID')} (+Admin Rp 500) berhasil disalurkan.`);
      fetchPaymentHistory(studentData.id);
      setActiveTab('pembayaran');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-100 font-sans pb-10">
      
      {/* HEADER UTAMA */}
      <header className="bg-emerald-800 text-white p-4 shadow-md sticky top-0 z-50">
        <div className="max-w-md mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2.5">
            {/* Badge Logo ABA */}
            <div className="w-9 h-9 bg-amber-400 text-emerald-950 rounded-full flex items-center justify-center font-black text-[10px] shadow-inner border border-amber-200">
              ABA
            </div>
            <div>
              <h1 className="text-sm font-extrabold tracking-wide">{namaSekolah}</h1>
              <p className="text-[9px] text-emerald-200 font-medium">{sloganSekolah}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Link href="/" className="text-[10px] bg-emerald-950/80 hover:bg-emerald-950 text-white px-2.5 py-1.5 rounded-lg font-bold">
              Kembali
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-md mx-auto p-4 space-y-4">
        {!isLoggedIn ? (
          /* FORM LOGIN WALI MURID */
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4 mt-6">
            <div className="text-center space-y-1">
              <h2 className="font-extrabold text-slate-800 text-base">Portal Orang Tua &amp; Wali</h2>
              <p className="text-slate-500 text-xs">Akses pantau kegiatan &amp; layanan sekolah dalam satu aplikasi.</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-3 pt-2">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Nama Wali Murid (Ayah / Ibu)</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Hendra Pratama"
                  value={loginNama}
                  onChange={(e) => setLoginNama(e.target.value)}
                  className="w-full p-3 border rounded-xl bg-slate-50 text-xs focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">No. WhatsApp Terdaftar / Aktif</label>
                <input
                  type="tel"
                  required
                  placeholder="08123456789"
                  value={loginWa}
                  onChange={(e) => setLoginWa(e.target.value)}
                  className="w-full p-3 border rounded-xl bg-slate-50 text-xs font-mono focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-xl font-bold text-xs transition shadow-md active:scale-95"
              >
                {loading ? 'Memeriksa Data...' : 'Masuk Aplikasi'}
              </button>
            </form>
          </div>
        ) : (
          /* DASHBOARD WALI MURID */
          <div className="space-y-4">

            {/* BANNER INFORMASI SLIDE */}
            <div className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white p-4 rounded-3xl shadow-lg relative overflow-hidden">
              <div className="relative z-10 space-y-1">
                <span className="bg-emerald-800/80 text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full text-emerald-200">
                  Penerimaan Murid Baru
                </span>
                <h3 className="text-sm font-extrabold leading-snug">
                  SEKOLAH ISLAM BERADAB, CERDAS &amp; BERDAYA SAING
                </h3>
                <p className="text-[10px] text-emerald-100">Pendaftaran Tahun Ajaran 2026/2027 Resmi Dibuka!</p>
              </div>
              <div className="absolute -right-4 -bottom-6 text-6xl opacity-20 pointer-events-none">🕌</div>
            </div>

            {/* WIDGET SALDO TABUNGAN ANANDA */}
            <div 
              onClick={() => setActiveTab('tabungan')}
              className="bg-gradient-to-r from-amber-500 to-amber-600 text-white p-4 rounded-3xl shadow-md cursor-pointer hover:opacity-95 transition flex justify-between items-center"
            >
              <div className="space-y-0.5">
                <p className="text-[10px] uppercase font-extrabold tracking-wider text-amber-100">💰 Saldo Tabungan Ananda</p>
                <h3 className="text-xl font-black font-mono">Rp {totalSaldoTabungan.toLocaleString('id-ID')}</h3>
                <p className="text-[9px] text-amber-100 italic">Klik untuk melihat riwayat setoran harian →</p>
              </div>
              <div className="w-10 h-10 bg-white/20 rounded-2xl flex items-center justify-center text-xl shadow-inner">
                🏦
              </div>
            </div>

            {/* GRID MENU UTAMA 8 IKON */}
            <div className="bg-white p-4 rounded-3xl shadow-sm border border-slate-200">
              <p className="text-[11px] font-bold text-slate-700 mb-3">Layanan &amp; Fitur Utama</p>
              <div className="grid grid-cols-4 gap-3 text-center">
                
                <button onClick={() => setActiveTab('jurnal')} className="flex flex-col items-center space-y-1 group">
                  <div className="w-12 h-12 bg-emerald-50 text-emerald-700 rounded-2xl flex items-center justify-center text-xl shadow-xs group-active:scale-90 transition">
                    📖
                  </div>
                  <span className="text-[10px] font-bold text-slate-700">Harian</span>
                </button>

                <button onClick={() => setActiveTab('pembayaran')} className="flex flex-col items-center space-y-1 group">
                  <div className="w-12 h-12 bg-blue-50 text-blue-700 rounded-2xl flex items-center justify-center text-xl shadow-xs group-active:scale-90 transition">
                    💳
                  </div>
                  <span className="text-[10px] font-bold text-slate-700">Tagihan</span>
                </button>

                <button onClick={() => setActiveTab('infaq')} className="flex flex-col items-center space-y-1 group">
                  <div className="w-12 h-12 bg-emerald-50 text-emerald-700 rounded-2xl flex items-center justify-center text-xl shadow-xs group-active:scale-90 transition">
                    🤲
                  </div>
                  <span className="text-[10px] font-bold text-slate-700">Infaq</span>
                </button>

                <button onClick={() => setActiveTab('belajar')} className="flex flex-col items-center space-y-1 group">
                  <div className="w-12 h-12 bg-purple-50 text-purple-700 rounded-2xl flex items-center justify-center text-xl shadow-xs group-active:scale-90 transition">
                    📚
                  </div>
                  <span className="text-[10px] font-bold text-slate-700">Belajar</span>
                </button>

                <button onClick={() => setActiveTab('tabungan')} className="flex flex-col items-center space-y-1 group">
                  <div className="w-12 h-12 bg-amber-50 text-amber-700 rounded-2xl flex items-center justify-center text-xl shadow-xs group-active:scale-90 transition">
                    💰
                  </div>
                  <span className="text-[10px] font-bold text-slate-700">Tabungan</span>
                </button>

                <button onClick={() => setActiveTab('ppdb')} className="flex flex-col items-center space-y-1 group">
                  <div className="w-12 h-12 bg-teal-50 text-teal-700 rounded-2xl flex items-center justify-center text-xl shadow-xs group-active:scale-90 transition">
                    📝
                  </div>
                  <span className="text-[10px] font-bold text-slate-700">PMB/PPDB</span>
                </button>

                <button onClick={() => setActiveTab('rapor')} className="flex flex-col items-center space-y-1 group">
                  <div className="w-12 h-12 bg-rose-50 text-rose-700 rounded-2xl flex items-center justify-center text-xl shadow-xs group-active:scale-90 transition">
                    📑
                  </div>
                  <span className="text-[10px] font-bold text-slate-700">Rapor</span>
                </button>

                <button onClick={() => { localStorage.clear(); setIsLoggedIn(false); }} className="flex flex-col items-center space-y-1 group">
                  <div className="w-12 h-12 bg-slate-100 text-slate-600 rounded-2xl flex items-center justify-center text-xl shadow-xs group-active:scale-90 transition">
                    🚪
                  </div>
                  <span className="text-[10px] font-bold text-slate-700">Keluar</span>
                </button>

              </div>
            </div>

            {/* KARTU PELAJAR DIGITAL */}
            <div className="bg-gradient-to-br from-slate-900 to-emerald-950 text-white p-5 rounded-3xl shadow-md relative space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-[9px] uppercase tracking-widest text-emerald-400 font-extrabold">Kartu Pelajar Digital</p>
                  <h4 className="text-sm font-bold mt-0.5">{studentData.nama_siswa}</h4>
                  <p className="text-[10px] text-slate-300">{studentData.kelompok_kelas || 'Kelas A'} • {namaSekolah}</p>
                </div>
                <div className="w-8 h-8 bg-emerald-600/40 rounded-full flex items-center justify-center text-xs">
                  🎓
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800 flex justify-between items-end">
                <div>
                  <p className="text-[9px] text-slate-400 font-mono">STATUS SISWA</p>
                  <p className="text-xs font-mono font-bold tracking-wider text-emerald-300 uppercase">{studentData.status || 'BELUM PPDB'}</p>
                </div>
                <span className="text-[9px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-md font-bold uppercase">
                  ACTIVE
                </span>
              </div>
            </div>

            {/* MODAL / SUB-TAB CONTENT */}
            {activeTab !== 'home' && (
              <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-4">
                <div className="flex justify-between items-center border-b pb-2">
                  <h3 className="font-extrabold text-slate-800 text-sm uppercase tracking-wide">
                    {activeTab === 'jurnal' && '📖 Laporan Aktivitas Harian'}
                    {activeTab === 'pembayaran' && '💳 Pembayaran Biaya Sekolah'}
                    {activeTab === 'infaq' && '🤲 Infaq & Sedekah Digital'}
                    {activeTab === 'belajar' && '📚 Ruang Belajar Digital Ananda'}
                    {activeTab === 'tabungan' && '💰 Buku Tabungan Siswa'}
                    {activeTab === 'ppdb' && '📝 Formulir PPDB Online'}
                    {activeTab === 'rapor' && '📑 Rapor Digital PAUD Kurikulum Merdeka'}
                  </h3>
                  <button onClick={() => setActiveTab('home')} className="text-xs bg-slate-100 text-slate-600 px-2.5 py-1 rounded-lg font-bold">
                    ✕ Tutup
                  </button>
                </div>

                {/* TAB 1: JURNAL AKTIVITAS HARIAN */}
                {activeTab === 'jurnal' && (
                  <div className="space-y-3 text-xs">
                    {activities.length === 0 ? (
                      <p className="text-center text-slate-400 py-4">Belum ada catatan aktivitas harian dari Guru Kelas.</p>
                    ) : (
                      activities.map((act: any) => (
                        <div key={act.id} className="p-3.5 bg-slate-50 border rounded-2xl space-y-2">
                          <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full">
                            Tanggal: {act.date}
                          </span>
                          <div className="grid grid-cols-2 gap-1.5 pt-1 text-slate-700 font-medium">
                            <p className={act.sholat_dhuha ? "text-emerald-700 font-bold" : "text-slate-400 line-through"}>
                              {act.sholat_dhuha ? "✓" : "✕"} Sholat Dhuha
                            </p>
                            <p className={act.murajaah ? "text-emerald-700 font-bold" : "text-slate-400 line-through"}>
                              {act.murajaah ? "✓" : "✕"} Murajaah
                            </p>
                            <p className={act.kemandirian ? "text-emerald-700 font-bold" : "text-slate-400 line-through"}>
                              {act.kemandirian ? "✓" : "✕"} Kemandirian
                            </p>
                            <p className={act.membaca ? "text-emerald-700 font-bold" : "text-slate-400 line-through"}>
                              {act.membaca ? "✓" : "✕"} Membaca
                            </p>
                            <p className={act.menghitung ? "text-emerald-700 font-bold" : "text-slate-400 line-through"}>
                              {act.menghitung ? "✓" : "✕"} Menghitung
                            </p>
                            <p className={act.melukis_mewarnai ? "text-emerald-700 font-bold" : "text-slate-400 line-through"}>
                              {act.melukis_mewarnai ? "✓" : "✕"} Melukis / Mewarnai
                            </p>
                            <p className={act.ekskul ? "text-emerald-700 font-bold" : "text-slate-400 line-through"}>
                              {act.ekskul ? "✓" : "✕"} Kegiatan Ekskul
                            </p>
                            <p className={act.olahraga ? "text-emerald-700 font-bold" : "text-slate-400 line-through"}>
                              {act.olahraga ? "✓" : "✕"} Olahraga
                            </p>
                            <p className={act.bermain_luar ? "text-emerald-700 font-bold col-span-2" : "text-slate-400 line-through col-span-2"}>
                              {act.bermain_luar ? "✓" : "✕"} Bermain Outdoor
                            </p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}

                {/* TAB 2: PEMBAYARAN */}
                {activeTab === 'pembayaran' && (
                  <div className="space-y-4 text-xs">
                    <form onSubmit={handlePayment} className="space-y-3">
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">Jenis Pembayaran</label>
                        <select
                          value={jenisBayar}
                          onChange={(e) => setJenisBayar(e.target.value)}
                          className="w-full p-2.5 border rounded-xl bg-slate-50"
                        >
                          <option value="SPP Bulanan">SPP Bulanan (Rp 200.000)</option>
                          <option value="Biaya Pendaftaran">Biaya Pendaftaran PPDB (Rp 1.500.000)</option>
                          <option value="Biaya Kegiatan Sekolah">Biaya Kegiatan Sekolah (Rp 300.000)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block font-bold text-slate-700 mb-1">Keterangan / Periode</label>
                        <input
                          type="text"
                          required
                          placeholder="Contoh: Agustus 2026"
                          value={periodeBayar}
                          onChange={(e) => setPeriodeBayar(e.target.value)}
                          className="w-full p-2.5 border rounded-xl bg-slate-50"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-slate-700 mb-1">Metode Pembayaran</label>
                        <select
                          value={metodeBayar}
                          onChange={(e) => setMetodeBayar(e.target.value)}
                          className="w-full p-2.5 border rounded-xl bg-slate-50"
                        >
                          <option value="QRIS">QRIS Instan All Payment</option>
                          <option value="Transfer Bank BSI">Transfer Bank BSI / Virtual Account</option>
                        </select>
                      </div>

                      {/* Rincian Biaya Kondisional */}
                      <div className="p-3 bg-slate-50 rounded-xl border space-y-1 font-mono text-[11px]">
                        <div className="flex justify-between text-slate-600">
                          <span>Nominal Tagihan:</span>
                          <span>Rp {nominalDasar.toLocaleString('id-ID')}</span>
                        </div>
                        <div className="flex justify-between text-slate-600">
                          <span>{labelBiayaAdmin}</span>
                          <span>Rp {biayaAdmin.toLocaleString('id-ID')}</span>
                        </div>
                        <div className="flex justify-between font-bold text-emerald-800 pt-1 border-t">
                          <span>Total Bayar:</span>
                          <span>Rp {totalBayar.toLocaleString('id-ID')}</span>
                        </div>
                      </div>

                      {metodeBayar === 'QRIS' ? (
                        <div className="text-center p-4 border rounded-2xl bg-emerald-50/50 space-y-2">
                          <p className="font-bold text-emerald-800 text-xs">Scan Kode QRIS Resmi TK 'Aisyiyah</p>
                          <div className="bg-white p-2 border rounded-xl inline-block shadow-sm">
                            <img
                              src="/qris.png"
                              alt="QRIS TK Aisyiyah"
                              className="w-44 h-44 object-contain mx-auto rounded-lg"
                              onError={(e) => {
                                (e.target as HTMLElement).style.display = 'none';
                              }}
                            />
                          </div>
                          <p className="text-[10px] text-slate-500">Mendukung Gopay, OVO, ShopeePay, Dana, LinkAja &amp; M-Banking</p>
                        </div>
                      ) : (
                        <div className="p-4 border rounded-2xl bg-blue-50/50 space-y-2 text-slate-700">
                          <div className="flex items-center justify-between border-b pb-2">
                            <p className="font-bold text-blue-900 text-xs">Bank Syariah Indonesia (BSI)</p>
                            <span className="text-[10px] bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full font-bold">Transfer Bank</span>
                          </div>
                          <div className="space-y-1">
                            <p className="text-[11px] text-slate-500">Nomor Rekening Sekolah:</p>
                            <p className="font-mono text-base font-extrabold text-slate-800 tracking-wider">7123 4567 89</p>
                            <p className="text-[11px] font-semibold text-slate-700">Atas Nama: <span className="text-blue-900">TK AISYIYAH BUSTANUL ATHFAL</span></p>
                          </div>
                        </div>
                      )}

                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 rounded-xl font-bold transition shadow-md active:scale-95"
                      >
                        {loading ? 'Memproses...' : 'Konfirmasi & Terbit Kuitansi'}
                      </button>
                    </form>

                    <div className="border-t pt-3 space-y-2">
                      <h4 className="font-bold text-slate-800">📜 Riwayat &amp; Kuitansi Pembayaran</h4>
                      {historyBayar.length === 0 ? (
                        <p className="text-center text-slate-400 py-2">Belum ada riwayat pembayaran.</p>
                      ) : (
                        historyBayar.map((hb) => (
                          <div key={hb.id} className="p-3 bg-emerald-50/60 border border-emerald-200 rounded-xl space-y-1">
                            <div className="flex justify-between font-bold text-emerald-900">
                              <span>{hb.jenis_pembayaran} ({hb.periode})</span>
                              <span className="text-[10px] bg-emerald-200 text-emerald-800 px-2 py-0.5 rounded-full">{hb.status}</span>
                            </div>
                            <p className="text-[10px] font-mono text-slate-600">No. Kuitansi: {hb.no_kuitansi}</p>
                            <p className="font-mono font-bold text-slate-800">Total: Rp {Number(hb.total_bayar).toLocaleString('id-ID')}</p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}

                {/* TAB 3: INFAQ */}
                {activeTab === 'infaq' && (
                  <form onSubmit={handleInfaqSubmit} className="space-y-3 text-xs">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Pilih Program Infaq</label>
                      <select
                        value={programInfaq}
                        onChange={(e) => setProgramInfaq(e.target.value)}
                        className="w-full p-2.5 border rounded-xl bg-slate-50 font-semibold"
                      >
                        <option value="Infaq Jumat Berkah">Infaq Jumat Berkah</option>
                        <option value="Sedekah Subuh">Sedekah Subuh</option>
                        <option value="Infaq Pembangunan / Fasilitas Sekolah">Infaq Pembangunan / Fasilitas Sekolah</option>
                        <option value="Santunan Anak Yatim &amp; Dhuafa">Santunan Anak Yatim &amp; Dhuafa</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Pilih Nominal Infaq</label>
                      <div className="grid grid-cols-4 gap-1.5 mb-2">
                        {[1000, 5000, 10000, 20000].map((nom) => (
                          <button
                            key={nom}
                            type="button"
                            onClick={() => setNominalInfaq(nom)}
                            className={`py-2 rounded-lg font-bold text-[11px] border ${
                              nominalInfaq === nom ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-slate-50 text-slate-700 border-slate-200'
                            }`}
                          >
                            Rp {nom.toLocaleString('id-ID')}
                          </button>
                        ))}
                      </div>
                      <input
                        type="number"
                        required
                        min={1000}
                        placeholder="Atau masukan nominal bebas..."
                        value={nominalInfaq || ''}
                        onChange={(e) => setNominalInfaq(Number(e.target.value))}
                        className="w-full p-2.5 border rounded-xl bg-slate-50 font-mono"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Metode Penyaluran</label>
                      <select
                        value={metodeInfaq}
                        onChange={(e) => setMetodeInfaq(e.target.value)}
                        className="w-full p-2.5 border rounded-xl bg-slate-50"
                      >
                        <option value="QRIS">QRIS All Payment</option>
                        <option value="Transfer Bank BSI">Transfer Bank BSI Yayasan</option>
                      </select>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-xl border space-y-1 font-mono text-[11px]">
                      <div className="flex justify-between text-slate-600">
                        <span>Nominal Infaq:</span>
                        <span>Rp {(nominalInfaq || 0).toLocaleString('id-ID')}</span>
                      </div>
                      <div className="flex justify-between text-slate-600">
                        <span>Biaya Admin Layanan:</span>
                        <span>Rp {biayaAdminInfaq.toLocaleString('id-ID')}</span>
                      </div>
                      <div className="flex justify-between font-bold text-emerald-800 pt-1 border-t">
                        <span>Total Transfer:</span>
                        <span>Rp {totalInfaqBayar.toLocaleString('id-ID')}</span>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 rounded-xl font-bold transition shadow-md active:scale-95"
                    >
                      {loading ? 'Menyalurkan...' : 'Salurkan Infaq Sekarang'}
                    </button>
                  </form>
                )}

                {/* TAB 4: BELAJAR DIGITAL */}
                {activeTab === 'belajar' && (
                  <div className="space-y-3 text-xs">
                    <div className="grid grid-cols-4 gap-1 bg-slate-100 p-1 rounded-2xl text-[10px] font-bold">
                      <button
                        onClick={() => setKategoriBelajar('doa')}
                        className={`py-1.5 rounded-xl transition ${kategoriBelajar === 'doa' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600'}`}
                      >
                        🤲 Doa
                      </button>
                      <button
                        onClick={() => setKategoriBelajar('surah')}
                        className={`py-1.5 rounded-xl transition ${kategoriBelajar === 'surah' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600'}`}
                      >
                        📖 Surah
                      </button>
                      <button
                        onClick={() => setKategoriBelajar('hijaiyah')}
                        className={`py-1.5 rounded-xl transition ${kategoriBelajar === 'hijaiyah' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600'}`}
                      >
                        🎨 Gim
                      </button>
                      <button
                        onClick={() => setKategoriBelajar('kisah')}
                        className={`py-1.5 rounded-xl transition ${kategoriBelajar === 'kisah' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600'}`}
                      >
                        🎬 Kisah
                      </button>
                    </div>

                    {kategoriBelajar === 'doa' && (
                      <div className="space-y-2.5 pt-1">
                        {materiDoa.map((item) => (
                          <div key={item.id} className="p-3.5 bg-emerald-50/50 border border-emerald-200 rounded-2xl space-y-1.5">
                            <h4 className="font-bold text-emerald-900 text-xs">{item.judul}</h4>
                            <p className="text-right text-base font-serif font-bold text-slate-800 leading-loose">{item.arab}</p>
                            <p className="text-[10px] text-slate-600 italic">"{item.arti}"</p>
                          </div>
                        ))}
                      </div>
                    )}

                    {kategoriBelajar === 'surah' && (
                      <div className="space-y-2 pt-1">
                        {materiSurah.map((surah) => (
                          <div key={surah.id} className="p-3 bg-slate-50 border rounded-2xl flex justify-between items-center">
                            <div>
                              <h4 className="font-bold text-slate-800">{surah.nama}</h4>
                              <p className="text-[10px] text-slate-500">{surah.ket} • {surah.ayat} Ayat</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* TAB 5: TABUNGAN SISWA */}
                {activeTab === 'tabungan' && (
                  <div className="space-y-4 text-xs">
                    <div className="bg-gradient-to-r from-amber-500 to-amber-600 text-white p-4 rounded-2xl space-y-1">
                      <p className="text-[10px] text-amber-100 font-bold uppercase">Saldo Tabungan Saat Ini</p>
                      <h3 className="text-2xl font-black font-mono">Rp {totalSaldoTabungan.toLocaleString('id-ID')}</h3>
                      <p className="text-[10px] text-amber-100">Pencatatan resmi terintegrasi dengan Guru Kelas TK</p>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-bold text-slate-800 border-b pb-1">📜 Riwayat Mutasi Tabungan Harian</h4>
                      {historyTabungan.length === 0 ? (
                        <p className="text-center text-slate-400 py-3">Belum ada setoran tabungan yang dicatat.</p>
                      ) : (
                        historyTabungan.map((item) => (
                          <div key={item.id} className="p-3 bg-slate-50 border rounded-2xl flex justify-between items-center">
                            <div>
                              <p className="font-bold text-slate-800 text-[11px]">{item.keterangan}</p>
                              <p className="text-[10px] text-slate-500 font-mono">{item.tanggal}</p>
                            </div>
                            <div className="text-right">
                              <p className={`font-mono font-bold ${item.tipe === 'SETORAN' ? 'text-emerald-700' : 'text-rose-600'}`}>
                                {item.tipe === 'SETORAN' ? '+' : '-'} Rp {Number(item.nominal).toLocaleString('id-ID')}
                              </p>
                              <span className="text-[9px] bg-slate-200 px-1.5 py-0.5 rounded text-slate-600 font-bold uppercase">{item.tipe}</span>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}

                {/* TAB 6: FORM PPDB ONLINE LENGKAP */}
                {activeTab === 'ppdb' && (
                  <form onSubmit={handleRegisterPPDB} className="space-y-3 text-xs">
                    <div className="bg-emerald-50 p-3 border border-emerald-200 rounded-xl mb-2">
                      <p className="font-bold text-emerald-800 text-xs">📋 Formulir Pendaftaran Murid Baru (PPDB)</p>
                      <p className="text-[10px] text-emerald-600">Silakan isi data calon siswa secara lengkap di bawah ini.</p>
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Nama Lengkap Siswa / Anak</label>
                      <input type="text" required placeholder="Masukan Nama Lengkap Anak..." value={namaSiswa} onChange={(e) => setNamaSiswa(e.target.value)} className="w-full p-2.5 border rounded-xl bg-slate-50 font-bold" />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">NIK Siswa (Sesuai Kartu Keluarga)</label>
                      <input type="text" required placeholder="16-digit NIK di KK" value={nik} onChange={(e) => setNik(e.target.value)} className="w-full p-2.5 border rounded-xl bg-slate-50 font-mono" />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">Tempat Lahir</label>
                        <input type="text" required placeholder="Kota Lahir" value={tempatLahir} onChange={(e) => setTempatLahir(e.target.value)} className="w-full p-2.5 border rounded-xl bg-slate-50" />
                      </div>
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">Tanggal Lahir</label>
                        <input type="date" required value={tanggalLahir} onChange={(e) => setTanggalLahir(e.target.value)} className="w-full p-2.5 border rounded-xl bg-slate-50" />
                      </div>
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Kelompok Belajar</label>
                      <select value={kelompokKelas} onChange={(e) => setKelompokKelas(e.target.value)} className="w-full p-2.5 border rounded-xl bg-slate-50">
                        <option value="Kelas A">Kelas A (Usia 4 - 5 Tahun)</option>
                        <option value="Kelas B">Kelas B (Usia 5 - 6 Tahun)</option>
                      </select>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">Nama Ayah Kandung</label>
                        <input type="text" required placeholder="Nama Ayah" value={namaAyah} onChange={(e) => setNamaAyah(e.target.value)} className="w-full p-2.5 border rounded-xl bg-slate-50" />
                      </div>
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">Pekerjaan Ayah</label>
                        <input type="text" required placeholder="Pekerjaan" value={pekerjaanAyah} onChange={(e) => setPekerjaanAyah(e.target.value)} className="w-full p-2.5 border rounded-xl bg-slate-50" />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">Nama Ibu Kandung</label>
                        <input type="text" required placeholder="Nama Ibu" value={namaIbu} onChange={(e) => setNamaIbu(e.target.value)} className="w-full p-2.5 border rounded-xl bg-slate-50" />
                      </div>
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">Pekerjaan Ibu</label>
                        <input type="text" required placeholder="Pekerjaan" value={pekerjaanIbu} onChange={(e) => setPekerjaanIbu(e.target.value)} className="w-full p-2.5 border rounded-xl bg-slate-50" />
                      </div>
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">No. WhatsApp Wali Murid</label>
                      <input type="tel" required placeholder="08123456789" value={noWa} onChange={(e) => setNoWa(e.target.value)} className="w-full p-2.5 border rounded-xl bg-slate-50 font-mono" />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Alamat Lengkap</label>
                      <textarea rows={2} required placeholder="Jl. Mawar No..." value={alamat} onChange={(e) => setAlamat(e.target.value)} className="w-full p-2.5 border rounded-xl bg-slate-50" />
                    </div>

                    <button type="submit" disabled={loading} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-xl font-bold transition shadow-md active:scale-95">
                      {loading ? 'Mengirim Formulir...' : 'Kirim Pendaftaran PPDB ke TU'}
                    </button>
                  </form>
                )}

                {/* TAB 7: RAPOR */}
                {activeTab === 'rapor' && (
                  <div className="bg-white p-2 rounded-2xl space-y-3 text-xs">
                    <p className="text-slate-600">Unduh berkas hasil belajar siswa versi e-Rapor PAUD Kurikulum Merdeka.</p>
                    {studentData?.rapor_url ? (
                      <a href={studentData.rapor_url} target="_blank" rel="noreferrer" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-xl font-bold block text-center">
                        📥 Download / Cetak Rapor PDF
                      </a>
                    ) : (
                      <p className="text-center text-amber-700 font-semibold bg-amber-50 p-3 border border-amber-200 rounded-xl">
                        File Rapor Digital belum diunggah oleh Guru Kelas.
                      </p>
                    )}
                  </div>
                )}

              </div>
            )}

          </div>
        )}
      </main>
    </div>
  );
}