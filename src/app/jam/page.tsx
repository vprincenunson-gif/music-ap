'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { usePlayer } from '@/hooks/usePlayer';
import { usePlayerStore } from '@/stores/playerStore';
import { Radio, Users, Link2, Copy, Check, Play, Pause, SkipForward, LogOut, Volume2 } from 'lucide-react';

interface JamMessage {
  type: 'sync' | 'chat' | 'join' | 'leave' | 'ping';
  sessionId: string;
  sender: string;
  data: any;
  timestamp: number;
}

export default function JamPage() {
  const { currentSong, isPlaying, progress, playSong, togglePlay, playNext } = usePlayer();
  const store = usePlayerStore();
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [joinInput, setJoinInput] = useState('');
  const [copied, setCopied] = useState(false);
  const [participants, setParticipants] = useState<string[]>([]);
  const [peerName, setPeerName] = useState('');
  const [showNameInput, setShowNameInput] = useState(true);
  const [connected, setConnected] = useState(false);
  const [log, setLog] = useState<string[]>([]);
  const channelRef = useRef<BroadcastChannel | null>(null);
  const lastSyncRef = useRef(0);

  const addLog = useCallback((msg: string) => {
    setLog(prev => [...prev.slice(-49), `[${new Date().toLocaleTimeString()}] ${msg}`]);
  }, []);

  // Generate a random color for each participant
  const colors = ['#6366f1', '#ec4899', '#14b8a6', '#f59e0b', '#8b5cf6', '#06b6d4', '#10b981', '#f43f5e'];

  // Create session
  const createSession = useCallback(() => {
    const id = `jam-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`;
    const name = peerName || `User-${Math.random().toString(36).substring(2, 5)}`;
    setSessionId(id);
    setShowNameInput(false);

    // Close any existing channel
    if (channelRef.current) channelRef.current.close();

    const channel = new BroadcastChannel(`muse-jam-${id}`);
    channelRef.current = channel;
    setParticipants([name]);
    setConnected(true);
    addLog(`Session created! Share ID: ${id}`);

    channel.onmessage = (event: MessageEvent<JamMessage>) => {
      const msg = event.data;
      if (msg.type === 'join') {
        setParticipants(prev => prev.includes(msg.sender) ? prev : [...prev, msg.sender]);
        addLog(`${msg.sender} joined the session`);
        // Send current state to new joiner
        if (currentSong) {
          channel.postMessage({
            type: 'sync',
            sessionId: id,
            sender: name,
            data: {
              song: currentSong,
              isPlaying: store.isPlaying,
              progress: store.progress,
            },
            timestamp: Date.now(),
          });
        }
      } else if (msg.type === 'leave') {
        setParticipants(prev => prev.filter(p => p !== msg.sender));
        addLog(`${msg.sender} left the session`);
      } else if (msg.type === 'sync' && msg.sender !== name) {
        if (msg.data.song) {
          playSong(msg.data.song);
          if (!msg.data.isPlaying) {
            store.setIsPlaying(false);
          }
        }
        addLog(`Synced from ${msg.sender}`);
      } else if (msg.type === 'chat') {
        addLog(`${msg.sender}: ${msg.data.text}`);
      }
    };
  }, [peerName, currentSong, store, playSong, addLog]);

  // Join session
  const joinSession = useCallback(() => {
    if (!joinInput.trim()) return;
    const id = joinInput.trim();
    const name = peerName || `User-${Math.random().toString(36).substring(2, 5)}`;
    setSessionId(id);
    setShowNameInput(false);

    if (channelRef.current) channelRef.current.close();

    const channel = new BroadcastChannel(`muse-jam-${id}`);
    channelRef.current = channel;
    setConnected(true);
    addLog(`Joined session: ${id}`);

    // Announce join
    channel.postMessage({
      type: 'join',
      sessionId: id,
      sender: name,
      data: {},
      timestamp: Date.now(),
    });

    channel.onmessage = (event: MessageEvent<JamMessage>) => {
      const msg = event.data;
      if (msg.type === 'join' && msg.sender !== name) {
        setParticipants(prev => prev.includes(msg.sender) ? prev : [...prev, msg.sender]);
        addLog(`${msg.sender} joined`);
      } else if (msg.type === 'leave') {
        setParticipants(prev => prev.filter(p => p !== msg.sender));
        addLog(`${msg.sender} left`);
      } else if (msg.type === 'sync' && msg.sender !== name) {
        if (msg.data.song) {
          playSong(msg.data.song);
          if (!msg.data.isPlaying) {
            store.setIsPlaying(false);
          }
        }
      } else if (msg.type === 'chat') {
        addLog(`${msg.sender}: ${msg.data.text}`);
      }
    };
  }, [joinInput, peerName, playSong, store, addLog]);

  // Leave session
  const leaveSession = useCallback(() => {
    if (channelRef.current && sessionId) {
      const name = peerName || 'Anonymous';
      channelRef.current.postMessage({
        type: 'leave',
        sessionId,
        sender: name,
        data: {},
        timestamp: Date.now(),
      });
      channelRef.current.close();
    }
    channelRef.current = null;
    setSessionId(null);
    setParticipants([]);
    setConnected(false);
    addLog('Left session');
  }, [sessionId, peerName, addLog]);

  // Broadcast playback sync when song changes or play state changes
  useEffect(() => {
    if (!channelRef.current || !sessionId || !connected) return;
    const name = peerName || 'Anonymous';
    const now = Date.now();
    if (now - lastSyncRef.current < 1000) return;
    lastSyncRef.current = now;

    channelRef.current.postMessage({
      type: 'sync',
      sessionId,
      sender: name,
      data: {
        song: currentSong,
        isPlaying: store.isPlaying,
        progress: store.progress,
      },
      timestamp: now,
    });
  }, [currentSong?.id, isPlaying, sessionId, connected, peerName, store.isPlaying]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (channelRef.current) {
        channelRef.current.close();
      }
    };
  }, []);

  const copySessionId = () => {
    if (sessionId) {
      navigator.clipboard.writeText(sessionId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="p-6 pb-24 page-enter">
      <h1 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
        <Radio size={24} className="text-indigo-400" />
        Jam Sessions
      </h1>

      {showNameInput && !sessionId && (
        <div className="max-w-lg mx-auto mb-6">
          <label className="text-sm text-zinc-400 mb-2 block">Your display name</label>
          <input
            type="text"
            placeholder="Enter your name"
            value={peerName}
            onChange={(e) => setPeerName(e.target.value)}
            className="w-full bg-zinc-800 text-white placeholder-zinc-500 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      )}

      {!sessionId ? (
        <div className="max-w-lg mx-auto space-y-6">
          {/* Create session */}
          <div className="bg-zinc-800/40 rounded-xl p-6 hover:bg-zinc-800/60 transition-colors">
            <h2 className="text-lg font-semibold text-white mb-2">Create a Session</h2>
            <p className="text-zinc-400 text-sm mb-4">
              Start a jam session and invite friends to listen together in sync. Open two browser tabs to test!
            </p>
            <button
              onClick={createSession}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-xl font-medium hover:from-indigo-500 hover:to-purple-500 transition-all hover:scale-[1.02]"
            >
              <Radio size={18} className="inline mr-2" />
              Create Jam Session
            </button>
          </div>

          {/* Join session */}
          <div className="bg-zinc-800/40 rounded-xl p-6 hover:bg-zinc-800/60 transition-colors">
            <h2 className="text-lg font-semibold text-white mb-2">Join a Session</h2>
            <p className="text-zinc-400 text-sm mb-4">Enter a session ID shared by a friend</p>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Paste session ID here"
                value={joinInput}
                onChange={(e) => setJoinInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && joinSession()}
                className="flex-1 bg-zinc-800 text-white placeholder-zinc-500 rounded-lg py-3 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                onClick={joinSession}
                disabled={!joinInput.trim()}
                className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Join
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Active session UI */
        <div className="max-w-3xl mx-auto">
          <div className="bg-zinc-800/40 rounded-xl p-6 mb-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <h2 className="text-lg font-semibold text-white">Active Session</h2>
              </div>
              <button
                onClick={leaveSession}
                className="text-zinc-400 hover:text-red-400 transition-colors flex items-center gap-1 text-sm"
              >
                <LogOut size={16} />
                Leave
              </button>
            </div>

            {/* Session ID */}
            <div className="flex items-center gap-2 bg-zinc-900 rounded-lg p-3 mb-4">
              <Link2 size={16} className="text-indigo-400 shrink-0" />
              <code className="text-sm text-zinc-300 flex-1 truncate">{sessionId}</code>
              <button
                onClick={copySessionId}
                className="text-zinc-400 hover:text-white transition-colors"
                title="Copy session ID"
              >
                {copied ? <Check size={16} className="text-green-400" /> : <Copy size={16} />}
              </button>
            </div>

            {/* Participants */}
            <div className="mb-4">
              <h3 className="text-sm text-zinc-400 mb-2 flex items-center gap-1">
                <Users size={14} />
                Participants ({participants.length})
              </h3>
              <div className="flex flex-wrap gap-2">
                {participants.map((p, i) => (
                  <span
                    key={p}
                    className="px-3 py-1 rounded-full text-xs font-medium text-white"
                    style={{ backgroundColor: colors[i % colors.length] + '40', borderColor: colors[i % colors.length], borderWidth: 1 }}
                  >
                    {p}
                  </span>
                ))}
              </div>
            </div>

            {/* Now playing */}
            <div className="bg-zinc-900/60 rounded-lg p-4">
              <h3 className="text-xs text-zinc-500 uppercase tracking-wider mb-2">Now Playing</h3>
              {currentSong ? (
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full overflow-hidden ${isPlaying ? 'animate-spin-slow' : ''} shrink-0 ring-2 ring-indigo-500/30`}>
                    <img
                      src={currentSong.coverUrl}
                      alt={currentSong.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">{currentSong.title}</p>
                    <p className="text-xs text-zinc-400 truncate">{currentSong.artist}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={togglePlay}
                      className="w-8 h-8 flex items-center justify-center bg-white text-black rounded-full hover:scale-105 transition-transform"
                    >
                      {isPlaying ? <Pause size={14} /> : <Play size={14} className="ml-0.5" />}
                    </button>
                    <button
                      onClick={playNext}
                      className="w-8 h-8 flex items-center justify-center bg-zinc-700 text-white rounded-full hover:bg-zinc-600 transition-colors"
                    >
                      <SkipForward size={14} />
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-zinc-500 text-sm">Play a song to start jamming!</p>
              )}
            </div>
          </div>

          {/* Activity log */}
          <div className="bg-zinc-800/40 rounded-xl p-4">
            <h3 className="text-sm text-zinc-400 mb-2">Activity Log</h3>
            <div className="bg-zinc-900 rounded-lg p-3 h-32 overflow-y-auto space-y-1">
              {log.length === 0 ? (
                <p className="text-zinc-600 text-xs">No activity yet</p>
              ) : (
                log.map((entry, i) => (
                  <p key={i} className="text-xs text-zinc-400">{entry}</p>
                ))
              )}
            </div>
          </div>

          {/* Instructions */}
          <div className="mt-4 bg-indigo-500/10 border border-indigo-500/20 rounded-lg p-4">
            <p className="text-xs text-indigo-300">
              💡 <strong>How to use:</strong> Open two browser tabs with this app. Create a session in one tab,
              copy the session ID, and join it in the other tab. Playback will sync between both tabs!
            </p>
          </div>
        </div>
      )}
    </div>
  );
}