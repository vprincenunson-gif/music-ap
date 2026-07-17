'use client';

import { ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { PlayerBar } from '@/components/player/PlayerBar';

interface AppShellProps {
  children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="h-screen flex flex-col bg-black">
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar: hidden on mobile, visible on desktop */}
        <div className="hidden md:flex">
          <Sidebar />
        </div>
        <main className="flex-1 overflow-y-auto bg-gradient-to-b from-zinc-900 to-black pb-16 md:pb-0">
          {children}
        </main>
      </div>
      <PlayerBar />

      {/* Mobile bottom navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-zinc-950 border-t border-zinc-800 px-2 pb-safe">
        <MobileNav />
      </nav>
    </div>
  );
}

function MobileNav() {
  const pathname = typeof window !== 'undefined' ? window.location.pathname : '/';
  const links = [
    { href: '/', label: 'Home', icon: '🏠' },
    { href: '/search', label: 'Search', icon: '🔍' },
    { href: '/library', label: 'Library', icon: '📚' },
    { href: '/jam', label: 'Jam', icon: '📻' },
  ];

  return (
    <div className="flex justify-around items-center h-14">
      {links.map((link) => (
        <a
          key={link.href}
          href={link.href}
          className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-lg text-xs transition-colors ${
            pathname === link.href ? 'text-indigo-400' : 'text-zinc-500 hover:text-zinc-300'
          }`}
        >
          <span className="text-lg">{link.icon}</span>
          <span>{link.label}</span>
        </a>
      ))}
    </div>
  );
}