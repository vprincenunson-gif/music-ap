'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    // If already logged in (user file exists), go home
    fetch('/api/user')
      .then(r => r.json())
      .then(data => { if (data.user) router.push('/'); })
      .catch(() => {});
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = name.trim();
    const ageNum = parseInt(age);

    if (!trimmedName) {
      setError('Please enter your name');
      return;
    }
    if (!age || isNaN(ageNum) || ageNum < 1 || ageNum > 150) {
      setError('Please enter a valid age');
      return;
    }

    // Try API first (file-based), fallback to localStorage
    const res = await fetch('/api/user', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: trimmedName, age: ageNum }),
    });

    if (res.ok) {
      router.push('/');
    } else {
      // Fallback: save in localStorage
      localStorage.setItem('muse-user', JSON.stringify({ name: trimmedName, age: ageNum }));
      router.push('/');
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-br from-zinc-900 via-black to-zinc-900">
      <div className="w-full max-w-md mx-4">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-indigo-500/20">
            <svg viewBox="0 0 192 192" className="w-10 h-10 fill-white">
              <rect x="8" y="20" width="16" height="100" rx="8" fill="white" opacity="0.9"/>
              <polygon points="16,120 50,60 84,120" fill="white" opacity="0.9"/>
              <rect x="72" y="10" width="16" height="110" rx="8" fill="white" opacity="0.9"/>
              <path d="M80 10 Q96 10 100 30 Q104 40 96 45 Q92 48 90 40 Q88 32 84 30 L80 30" fill="white" opacity="0.6"/>
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-white">Welcome to Muse</h1>
          <p className="text-zinc-400 mt-2">Enter your details to start listening</p>
        </div>

        {/* Login form */}
        <form onSubmit={handleLogin} className="bg-zinc-800/60 rounded-2xl p-8 border border-zinc-700/50">
          <div className="mb-5">
            <label className="block text-sm text-zinc-400 mb-2">Your Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => { setName(e.target.value); setError(''); }}
              placeholder="Enter your name"
              className="w-full bg-zinc-900 text-white placeholder-zinc-600 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 border border-zinc-700"
              autoFocus
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm text-zinc-400 mb-2">Your Age</label>
            <input
              type="number"
              value={age}
              onChange={(e) => { setAge(e.target.value); setError(''); }}
              placeholder="Enter your age"
              min="1"
              max="150"
              className="w-full bg-zinc-900 text-white placeholder-zinc-600 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 border border-zinc-700"
            />
          </div>

          {error && (
            <p className="text-red-400 text-sm mb-4 text-center">{error}</p>
          )}

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-xl font-medium hover:from-indigo-500 hover:to-purple-500 transition-all hover:scale-[1.02] text-lg"
          >
            Get Started
          </button>
        </form>
      </div>
    </div>
  );
}