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
        <Sidebar />
        <main className="flex-1 overflow-y-auto bg-gradient-to-b from-zinc-900 to-black">
          {children}
        </main>
      </div>
      <PlayerBar />
    </div>
  );
}
