'use client';

import { useEffect, useRef } from 'react';
import { audioEngine } from '@/lib/player';

interface VisualizerProps {
  isPlaying: boolean;
  barCount?: number;
  className?: string;
}

export function Visualizer({ isPlaying, barCount = 5, className = '' }: VisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const analyser = audioEngine.analyser;
    if (!analyser) return;

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const draw = () => {
      if (!ctx || !canvas) return;
      analyser.getByteFrequencyData(dataArray);
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const barCount = 32;
      const barWidth = canvas.width / barCount;
      const gap = 2;

      for (let i = 0; i < barCount; i++) {
        const value = dataArray[Math.floor(i * bufferLength / barCount)];
        const height = Math.max(2, (value / 255) * canvas.height);
        const x = i * barWidth + gap / 2;
        const w = barWidth - gap;

        const hue = 240 + (i / barCount) * 60;
        ctx.fillStyle = `hsla(${hue}, 80%, 60%, 0.8)`;
        ctx.fillRect(x, canvas.height - height, w, height);
      }

      animRef.current = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(animRef.current);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      width={barCount * 4}
      height={32}
      className={`h-8 ${className}`}
    />
  );
}