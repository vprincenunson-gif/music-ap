'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Music, Sparkles } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem('muse-user');
    if (saved) router.push('/');
  }, [router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    localStorage.setItem('muse-user', JSON.stringify({ name: name.trim() }));
    router.push('/');
  };

  return (
    <div className="h-screen flex items-center justify-center bg-black overflow-hidden relative">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/40 via-purple-900/40 to-pink-900/40 animate-gradient" />

      {/* Floating music notes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {['♫', '♪', '♩', '♬', '🎵', '🎶'].map((note, i) => (
          <span
            key={i}
            className="absolute text-white/10 text-4xl animate-float"
            style={{
              left: `${15 + i * 14}%`,
              top: `${20 + (i % 4) * 20}%`,
              animationDelay: `${i * 1.5}s`,
              animationDuration: `${4 + (i % 3) * 2}s`,
            }}
          >
            {note}
          </span>
        ))}
      </div>

      {/* Glowing orb */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl animate-pulse" />

      {/* Login card */}
      <div className={`relative z-10 w-full max-w-md mx-4 transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <div className="text-center mb-8">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center mx-auto mb-4 shadow-2xl shadow-indigo-500/30 animate-bounce-in group hover:scale-110 transition-transform duration-300">
            <Music size={36} className="text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2 animate-slide-up">
            Welcome to <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">Muse</span>
          </h1>
          <p className="text-zinc-400 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            Your personal music streaming experience
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-zinc-900/80 backdrop-blur-xl rounded-2xl p-8 border border-zinc-800/50 shadow-2xl animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <div className="mb-6">
            <label className="block text-sm text-zinc-400 mb-2 font-medium">
              What should we call you?
            </label>
            <div className="relative group">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name..."
                className="w-full bg-zinc-800/80 text-white placeholder-zinc-600 rounded-xl py-4 px-5 text-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:bg-zinc-800 border border-zinc-700/50 transition-all duration-300 group-hover:border-indigo-500/30"
                autoFocus
                onKeyDown={(e) => e.key === 'Enter' && handleSubmit(e)}
              />
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-indigo-500/0 via-indigo-500/5 to-purple-500/0 opacity-0 group-focus-within:opacity-100 transition-opacity pointer-events-none" />
            </div>
          </div>

          <button
            type="submit"
            disabled={!name.trim()}
            className="w-full bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white py-4 rounded-xl font-semibold text-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-indigo-500/25 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100 relative overflow-hidden group"
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              Get Started
              <Sparkles size={18} className="opacity-70 group-hover:animate-spin" />
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
          </button>
        </form>

        <p className="text-center mt-6 text-zinc-600 text-xs animate-fade-in" style={{ animationDelay: '0.4s' }}>
          Just your name — no passwords, no signups
        </p>
      </div>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); opacity: 0.1; }
          50% { transform: translateY(-30px) rotate(15deg); opacity: 0.2; }
        }
        .animate-float { animation: float 6s ease-in-out infinite; }

        @keyframes bounce-in {
          0% { transform: scale(0.3); opacity: 0; }
          50% { transform: scale(1.05); }
          70% { transform: scale(0.95); }
          100% { transform: scale(1); opacity: 1; }
        }
        .animate-bounce-in { animation: bounce-in 0.6s ease-out; }

        @keyframes slide-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slide-up { animation: slide-up 0.5s ease-out forwards; }

        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in { animation: fade-in 0.5s ease-out forwards; }

        @keyframes gradient-shift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-gradient { background-size: 200% 200%; animation: gradient-shift 8s ease infinite; }
      `}</style>
    </div>
  );
}