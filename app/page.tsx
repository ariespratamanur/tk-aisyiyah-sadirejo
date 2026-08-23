import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-center p-4">
      <div className="bg-white p-8 rounded-2xl shadow-md max-w-md w-full text-center space-y-6">
        <h1 className="text-xl font-bold text-slate-800">Sistem Informasi EduMu Aisyiyah</h1>
        <p className="text-xs text-slate-500">Silakan pilih portal akses login sesuai peran Anda:</p>
        
        <div className="space-y-3">
          <Link href="/portal-tu" className="block w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 rounded-xl text-sm shadow">
            🔑 Masuk Portal Tata Usaha (TU)
          </Link>
          <Link href="/portal-guru" className="block w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-3 rounded-xl text-sm shadow">
            📚 Masuk Portal Guru Kelas
          </Link>
          <Link href="/portal-wali" className="block w-full bg-teal-700 hover:bg-teal-800 text-white font-bold py-3 rounded-xl text-sm shadow">
            👨‍👩‍👧 Masuk Portal Wali Murid
          </Link>
        </div>
      </div>
    </div>
  );
}