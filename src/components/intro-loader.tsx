'use client';

import React, { useState, useEffect } from 'react';
import { ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';

export function IntroLoader({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0);
  const [isExiting, setIsExiting] = useState(false);
  const [shouldHide, setShouldHide] = useState(false);
  const [spores, setSpores] = useState<Array<{ id: number; left: string; size: string; duration: string; delay: string; opacity: number }>>([]);

  useEffect(() => {
    // Generate snow-like spores strictly on client to avoid hydration errors
    const newSpores = [...Array(30)].map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      size: `${Math.random() * 4 + 2}px`,
      duration: `${Math.random() * 5 + 5}s`,
      delay: `${Math.random() * -10}s`,
      opacity: Math.random() * 0.5 + 0.1
    }));
    setSpores(newSpores);

    const duration = 2500;
    const interval = 25;
    const steps = duration / interval;
    const increment = 100 / steps;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          return 100;
        }
        return Math.min(prev + increment, 100);
      });
    }, interval);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (progress === 100) {
      setTimeout(() => {
        setIsExiting(true);
        onComplete();
        setTimeout(() => setShouldHide(true), 1500);
      }, 500);
    }
  }, [progress, onComplete]);

  if (shouldHide) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-[#050406] flex flex-col items-center justify-center overflow-hidden">
      {/* Background Mist Layers */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[80%] h-[80%] rounded-full bg-primary/5 blur-[120px] pulse-biolume" />
        <div className="absolute bottom-1/4 right-1/4 w-[60%] h-[60%] rounded-full bg-accent/5 blur-[100px] pulse-biolume" style={{ animationDelay: '-2s' }} />
      </div>

      {/* Snowfall Layer */}
      {spores.map((spore) => (
        <div
          key={spore.id}
          className="absolute top-[-10px] bg-white rounded-full snow-drift pointer-events-none"
          style={{
            left: spore.left,
            width: spore.size,
            height: spore.size,
            animationDuration: spore.duration,
            animationDelay: spore.delay,
            opacity: spore.opacity,
            filter: 'blur(1px)'
          }}
        />
      ))}

      {/* Exit Mist Overlay */}
      <div 
        className={cn(
          "absolute inset-0 bg-white/20 backdrop-blur-3xl transition-opacity duration-1000 pointer-events-none z-50",
          isExiting ? "reveal-mist" : "opacity-0"
        )} 
      />

      <div 
        className={cn(
          "relative z-10 space-y-12 transition-all duration-700",
          isExiting ? "opacity-0 scale-110 blur-xl" : "opacity-100"
        )}
      >
        <div className="flex flex-col items-center gap-8">
          <div className="relative">
            <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full animate-pulse" />
            <ShieldCheck className="h-20 w-20 text-primary relative z-10" />
          </div>
          
          <div className="text-center space-y-4">
            <h2 className="text-4xl font-black font-headline tracking-tighter text-white">
              FACTCHECK <span className="text-primary italic">AI</span>
            </h2>
            <div className="flex items-center gap-3">
              <div className="h-[1px] w-12 bg-white/10" />
              <p className="text-[10px] font-black tracking-[0.4em] text-slate-500 uppercase">
                Audit in Progress
              </p>
              <div className="h-[1px] w-12 bg-white/10" />
            </div>
          </div>
        </div>

        <div className="w-64 space-y-3">
          <div className="flex justify-between items-end text-white/40">
            <span className="text-[9px] font-bold uppercase tracking-widest">Confidence</span>
            <span className="text-2xl font-black font-mono tracking-tighter text-white">
              {Math.round(progress)}%
            </span>
          </div>
          <div className="h-[2px] w-full bg-white/5 relative overflow-hidden rounded-full">
            <div 
              className="absolute top-0 left-0 h-full bg-primary shadow-[0_0_8px_rgba(var(--primary),0.8)] transition-all duration-150 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
