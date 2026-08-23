import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-100 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6 text-center">
        
        {/* HERO BANNER SEKOLAH */}
        <div className="bg-emerald-800 text-white p-6 rounded-3xl shadow-lg border-2 border-amber-400 space-y-2">
          <div className="w-12 h-12 bg-amber-400 text-emerald-950 rounded-full flex items-center justify-center font-black text-xs mx-auto shadow-md">
            ABA
          </div>
          <h1 className="text-lg font-black tracking-wide uppercase">
            TK 'AISYIYAH BUSTANUL ATHFAL SADIREJO
          </h1>
          <p className="text-xs text-emerald-100 font-medium">
            Portal Layanan Digital Terpadu Sekolah
          </p>
        </div>

        <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">
          -- SILAKAN PILIH PORTAL AKSES --
        </p>

        {/* PILIHAN PORTAL AKSES */}
        <div className="space-y-3">
          
          {/* 1. PORTAL WALI MURID */}
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 flex items-center justify-between">
            <div className="flex items-center space-x-3 text-left">
              <span className="text-2xl">👨‍👩‍👧‍👦</span>
              <div>
                <h3 className="text-xs font-extrabold text-slate-800">Portal Wali Murid</h3>
                <p className="text-[10px] text-slate-500">Tagihan, Infaq, Belajar &amp; PPDB</p>
              </div>
            </div>
            <Link href="/portal-walimurid" className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-sm transition">
              Masuk
            </Link>
          </div>

          {/* 2. PORTAL GURU KELAS */}
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 flex items-center justify-between">
            <div className="flex items-center space-x-3 text-left">
              <span className="text-2xl">👩‍🏫</span>
              <div>
                <h3 className="text-xs font-extrabold text-slate-800">Portal Guru Kelas</h3>
                <p className="text-[10px] text-slate-500">Input Jurnal &amp; e-Rapor PAUD</p>
              </div>
            </div>
            <Link href="/portal-guru" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-sm transition">
              Masuk
            </Link>
          </div>

          {/* 3. PORTAL TATA USAHA (TU) */}
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 flex items-center justify-between">
            <div className="flex items-center space-x-3 text-left">
              <span className="text-2xl">🏫</span>
              <div>
                <h3 className="text-xs font-extrabold text-slate-800">Portal Tata Usaha (TU)</h3>
                <p className="text-[10px] text-slate-500">Verifikasi PPDB &amp; Kuitansi SPP</p>
              </div>
            </div>
            <Link href="/portal-tu" className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-sm transition">
              Masuk
            </Link>
          </div>

        </div>

      </div>
    </main>
  );
}