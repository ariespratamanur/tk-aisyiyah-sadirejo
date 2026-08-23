'use client';

import { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

// Komponen Form Login Utama
function LoginForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const role = searchParams.get('role') || 'guru'; // Default ke guru jika tidak ada role

  // Form States
  const [nip, setNip] = useState('');
  const [password, setPassword] = useState('');
  const [namaWali, setNamaWali] = useState('');
  const [noWa, setNoWa] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    if (role === 'walimurid') {
      localStorage.setItem('user_role', 'walimurid');
      localStorage.setItem('nama_wali', namaWali);
      localStorage.setItem('no_wa', noWa);
      router.push('/portal-walimurid');
    } else if (role === 'guru') {
      localStorage.setItem('user_role', 'guru');
      localStorage.setItem('nip', nip);
      router.push('/portal-guru');
    } else if (role === 'tu') {
      localStorage.setItem('user_role', 'tu');
      localStorage.setItem('nip', nip);
      router.push('/portal-tu');
    }
  };

  return (
    <div className="w-full max-w-md bg-white p-6 rounded-2xl shadow-md border border-slate-200">
      {/* Header Title */}
      <div className="text-center mb-6">
        <h1 className="text-xl font-bold text-slate-800">
          {role === 'walimurid' ? 'Login Portal Wali Murid' : 'Login Portal Guru & TU'}
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          {role === 'walimurid' 
            ? 'Masukkan Nama Wali Murid dan Nomor WhatsApp' 
            : 'Masukkan NIP dan 6-Digit Password Bawaan'}
        </p>
      </div>

      {/* Form Akses */}
      <form onSubmit={handleLogin} className="space-y-4">
        {role === 'walimurid' ? (
          /* Form Khusus Wali Murid */
          <>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Nama Wali Murid / Orang Tua
              </label>
              <input
                type="text"
                required
                placeholder="Contoh: Ayah / Ibu Rizky"
                value={namaWali}
                onChange={(e) => setNamaWali(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Nomor WhatsApp / HP
              </label>
              <input
                type="tel"
                required
                placeholder="Contoh: 081234567890"
                value={noWa}
                onChange={(e) => setNoWa(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </>
        ) : (
          /* Form Pegawai (Guru / TU) */
          <>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                NIP Pegawai
              </label>
              <input
                type="text"
                required
                placeholder="Contoh: 198501..."
                value={nip}
                onChange={(e) => setNip(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Password (6 Angka)
              </label>
              <input
                type="password"
                required
                placeholder="******"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </>
        )}

        <button
          type="submit"
          className={`w-full py-2.5 rounded-xl text-white font-bold text-sm shadow-md transition-all active:scale-95 mt-2 ${
            role === 'walimurid' 
              ? 'bg-emerald-600 hover:bg-emerald-700' 
              : role === 'tu' 
              ? 'bg-amber-600 hover:bg-amber-700' 
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          Masuk Portal
        </button>
      </form>
    </div>
  );
}

// Export default dibungkus dengan Suspense Boundary
export default function LoginPage() {
  return (
    <main className="min-h-screen bg-slate-100 flex flex-col items-center justify-center p-4">
      <Suspense fallback={<div className="text-sm text-slate-500">Memuat halaman login...</div>}>
        <LoginForm />
      </Suspense>
    </main>
  );
}