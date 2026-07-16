'use client';

import { useRef, useCallback, useState } from 'react';

interface SliderProps {
  value: number;
  min?: number;
  max?: number;
  step?: number;
  onChange: (value: number) => void;
  className?: string;
  size?: 'sm' | 'md';
}

export function Slider({
  value,
  min = 0,
  max = 100,
  step = 0.1,
  onChange,
  className = '',
  size = 'md',
}: SliderProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const percentage = ((value - min) / (max - min)) * 100;

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    updateValue(e.clientX);
    const handleMouseMove = (e: MouseEvent) => updateValue(e.clientX);
    const handleMouseUp = () => {
      setIsDragging(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const updateValue = (clientX: number) => {
    if (!trackRef.current) return;
    const rect = trackRef.current.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    const newValue = min + ratio * (max - min);
    onChange(newValue);
  };

  return (
    <div
      ref={trackRef}
      className={`relative cursor-pointer ${size === 'sm' ? 'h-1' : 'h-1.5'} bg-zinc-700 rounded-full group ${className}`}
      onMouseDown={handleMouseDown}
    >
      <div
        className="absolute top-0 left-0 h-full bg-indigo-500 rounded-full group-hover:bg-indigo-400 transition-colors"
        style={{ width: `${percentage}%` }}
      />
      <div
        className={`absolute top-1/2 -translate-y-1/2 bg-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity ${size === 'sm' ? 'w-2.5 h-2.5' : 'w-3.5 h-3.5'}`}
        style={{ left: `calc(${percentage}% - ${size === 'sm' ? '5px' : '7px'})` }}
      />
    </div>
  );
}
