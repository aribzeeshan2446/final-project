
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
    // Generate atmospheric forest spores strictly on client
    const newSpores = [...Array(45)].map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      size: `${Math.random() * 5 + 2}px`,
      duration: `${Math.random() * 8 + 4}s`,
      delay: `${Math.random() * -12}s`,
      opacity: Math.random() * 0.4 + 0.1
    }));
    setSpores(newSpores);

    const duration = 3000;
    const interval = 20;
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
        setTimeout(() => setShouldHide(true), 2000);
      }, 800);
    }
  }, [progress, onComplete]);

  if (shouldHide) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-white flex flex-col items-center justify-center overflow-hidden">
      {/* Background Mist Layers */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-1/4 w-[90%] h-[90%] rounded-full bg-primary/10 blur-[150px] pulse-biolume" />
        <div className="absolute bottom-1/3 right-1/4 w-[70%] h-[70%] rounded-full bg-slate-300/40 blur-[120px] pulse-biolume" style={{ animationDelay: '-3s' }} />
      </div>

      {/* Spore Snowfall Layer */}
      {spores.map((spore) => (
        <div
          key={spore.id}
          className="absolute top-[-20px] bg-slate-400 rounded-full snow-drift pointer-events-none"
          style={{
            left: spore.left,
            width: spore.size,
            height: spore.size,
            animationDuration: spore.duration,
            animationDelay: spore.delay,
            opacity: spore.opacity,
            filter: 'blur(1.5px)'
          }}
        />
      ))}

      {/* Exit Mist Overlay */}
      <div 
        className={cn(
          "absolute inset-0 bg-white/40 backdrop-blur-[50px] transition-opacity duration-1500 pointer-events-none z-50",
          isExiting ? "reveal-mist" : "opacity-0"
        )} 
      />

      <div 
        className={cn(
          "relative z-10 space-y-16 transition-all duration-1000 ease-out",
          isExiting ? "opacity-0 scale-[1.2] blur-3xl translate-y-[-20px]" : "opacity-100"
        )}
      >
        <div className="flex flex-col items-center gap-10">
          <div className="relative">
            <div className="absolute inset-0 bg-primary/20 blur-[60px] rounded-full animate-pulse" />
            <ShieldCheck className="h-24 w-24 text-primary relative z-10 drop-shadow-2xl" />
          </div>
          
          <div className="text-center space-y-6">
            <h2 className="text-5xl font-black font-headline tracking-tighter text-slate-900 drop-shadow-sm">
              FACTCHECK <span className="text-primary italic">AI</span>
            </h2>
            <div className="flex items-center justify-center gap-4">
              <div className="h-[1px] w-16 bg-slate-200" />
              <p className="text-[11px] font-black tracking-[0.6em] text-slate-400 uppercase">
                Forensic Analysis
              </p>
              <div className="h-[1px] w-16 bg-slate-200" />
            </div>
          </div>
        </div>

        <div className="w-80 space-y-4">
          <div className="flex justify-between items-end text-slate-400 px-1">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">Syncing Intelligence</span>
            <span className="text-3xl font-black font-mono tracking-tighter text-slate-900">
              {Math.round(progress)}%
            </span>
          </div>
          <div className="h-[3px] w-full bg-slate-100 relative overflow-hidden rounded-full shadow-inner">
            <div 
              className="absolute top-0 left-0 h-full bg-primary shadow-[0_0_15px_rgba(20,83,45,0.4)] transition-all duration-200 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
