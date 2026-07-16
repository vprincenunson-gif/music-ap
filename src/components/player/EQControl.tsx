'use client';

import { usePlayer } from '@/hooks/usePlayer';
import { Slider } from '@/components/ui/Slider';
import { X } from 'lucide-react';

interface EQControlProps {
  onClose: () => void;
}

export function EQControl({ onClose }: EQControlProps) {
  const { eqSettings, setEq } = usePlayer();

  const bands = [
    { key: 'bass' as const, label: 'Bass', freq: '200 Hz' },
    { key: 'mid' as const, label: 'Mid', freq: '1 kHz' },
    { key: 'treble' as const, label: 'Treble', freq: '3 kHz' },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-white">Equalizer</h3>
        <button onClick={onClose} className="text-zinc-400 hover:text-white transition-colors">
          <X size={16} />
        </button>
      </div>
      <div className="flex items-end justify-center gap-6 h-32">
        {bands.map((band) => (
          <div key={band.key} className="flex flex-col items-center gap-2">
            <span className="text-xs text-zinc-500">{band.freq}</span>
            <div className="relative w-8 h-24 bg-zinc-800 rounded-full">
              <div
                className="absolute bottom-0 left-0 w-full bg-indigo-500 rounded-full transition-all"
                style={{
                  height: `${((eqSettings[band.key] + 10) / 20) * 100}%`,
                }}
              />
              <input
                type="range"
                min="-10"
                max="10"
                value={eqSettings[band.key]}
                onChange={(e) => setEq({ [band.key]: parseInt(e.target.value) })}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer [writing-mode:vertical-lr]"
              />
            </div>
            <span className="text-xs text-zinc-500">{eqSettings[band.key] > 0 ? '+' : ''}{eqSettings[band.key]}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
