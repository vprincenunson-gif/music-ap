'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  Search,
  Library,
  Music,
  Radio,
  Mic2,
  Download,
} from 'lucide-react';

const navItems = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/search', label: 'Search', icon: Search },
  { href: '/library', label: 'Library', icon: Library },
  { href: '/lyrics', label: 'Lyrics', icon: Mic2 },
  { href: '/jam', label: 'Jam Sessions', icon: Radio },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-56 bg-zinc-950 border-r border-zinc-800 flex flex-col h-full">
      {/* Logo */}
      <div className="p-5">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
            <svg viewBox="0 0 192 192" className="w-5 h-5 fill-white">
              <rect x="8" y="20" width="16" height="100" rx="8" fill="white" opacity="0.9"/>
              <polygon points="16,120 50,60 84,120" fill="white" opacity="0.9"/>
              <rect x="72" y="10" width="16" height="110" rx="8" fill="white" opacity="0.9"/>
              <path d="M80 10 Q96 10 100 30 Q104 40 96 45 Q92 48 90 40 Q88 32 84 30 L80 30" fill="white" opacity="0.6"/>
            </svg>
          </div>
          <span className="text-lg font-bold bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Muse
          </span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                isActive
                  ? 'bg-zinc-800 text-white'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'
              }`}
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
