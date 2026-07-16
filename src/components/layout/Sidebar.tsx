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
        <h1 className="text-lg font-bold text-white flex items-center gap-2">
          <span className="w-2 h-2 bg-indigo-500 rounded-full" />
          Muse
        </h1>
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
