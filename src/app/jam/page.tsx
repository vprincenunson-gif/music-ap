'use client';

import { useState } from 'react';
import { usePlayer } from '@/hooks/usePlayer';
import { Radio, Users, Link2, Copy, Check } from 'lucide-react';

export default function JamPage() {
  const { currentSong, isPlaying } = usePlayer();
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [joinId, setJoinId] = useState('');
  const [copied, setCopied] = useState(false);

  const createSession = () => {
    const id = `jam-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`;
    setSessionId(id);
  };

  const joinSession = () => {
    if (joinId.trim()) {
      setSessionId(joinId.trim());
    }
  };

  const copySessionId = () => {
    if (sessionId) {
      navigator.clipboard.writeText(sessionId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="p-6 pb-24">
      <h1 className="text-2xl font-bold text-white mb-6">Jam Sessions</h1>

      <div className="max-w-lg mx-auto">
        {/* Create session */}
        <div className="bg-zinc-800/40 rounded-xl p-6 mb-6">
          <h2 className="text-lg font-semibold text-white mb-4">Create a Session</h2>
          <p className="text-zinc-400 text-sm mb-4">
            Start a jam session and invite friends to listen together in real-time
          </p>
          <button
            onClick={createSession}
            className="w-full bg-indigo-600 text-white py-3 rounded-xl font-medium hover:bg-indigo-700 transition-colors"
          >
            Create Jam Session
          </button>
        </div>

        {/* Join session */}
        <div className="bg-zinc-800/40 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Join a Session</h2>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Enter session ID"
              value={joinId}
              onChange={(e) => setJoinId(e.target.value)}
              className="flex-1 bg-zinc-800 text-white placeholder-zinc-500 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              onClick={joinSession}
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
            >
              Join
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
