'use client';

import React, { useState, useEffect } from 'react';
import { ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';

export function IntroLoader({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0);
  const [isExiting, setIsExiting] = useState(false);
  const [shouldHide, setShouldHide] = useState(false);
  const [snowflakes, setSnowflakes] = useState<Array<{ id: number; left: string; size: string; duration: string; delay: string; opacity: number }>>([]);

  useEffect(() => {
    // Generate crisp forest snow particles
    const newSnow = [...Array(60)].map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      size: `${Math.random() * 4 + 1}px`,
      duration: `${Math.random() * 6 + 3}s`,
      delay: `${Math.random() * -10}s`,
      opacity: Math.random() * 0.7 + 0.3
    }));
    setSnowflakes(newSnow);

    const duration = 3500;
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
        setTimeout(() => setShouldHide(true), 2500);
      }, 1000);
    }
  }, [progress, onComplete]);

  if (shouldHide) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-white flex flex-col items-center justify-center overflow-hidden">
      {/* Misty Atmospheric Layers (Pink/Lavender Twilight) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 right-0 w-[100%] h-[100%] rounded-full bg-pink-100/40 blur-[180px] pulse-biolume" />
        <div className="absolute bottom-1/4 left-0 w-[80%] h-[80%] rounded-full bg-slate-200/50 blur-[150px] pulse-biolume" style={{ animationDelay: '-4s' }} />
      </div>

      {/* Crisp Snowfall Layer */}
      {snowflakes.map((flake) => (
        <div
          key={flake.id}
          className="absolute top-[-20px] bg-white rounded-full snow-drift pointer-events-none shadow-[0_0_8px_rgba(255,255,255,0.8)]"
          style={{
            left: flake.left,
            width: flake.size,
            height: flake.size,
            animationDuration: flake.duration,
            animationDelay: flake.delay,
            opacity: flake.opacity,
          }}
        />
      ))}

      {/* Exit Mist Overlay */}
      <div 
        className={cn(
          "absolute inset-0 bg-white/60 backdrop-blur-[60px] transition-opacity duration-2000 pointer-events-none z-50",
          isExiting ? "reveal-mist" : "opacity-0"
        )} 
      />

      <div 
        className={cn(
          "relative z-10 space-y-20 transition-all duration-1500 ease-[cubic-bezier(0.85,0,0.15,1)]",
          isExiting ? "opacity-0 scale-[1.3] blur-[100px] translate-y-[-40px]" : "opacity-100"
        )}
      >
        <div className="flex flex-col items-center gap-12">
          <div className="relative">
            <div className="absolute inset-0 bg-slate-900/5 blur-[80px] rounded-full animate-pulse" />
            <div className="bg-primary p-4 rounded-3xl shadow-2xl relative z-10">
              <ShieldCheck className="h-20 w-20 text-white" />
            </div>
          </div>
          
          <div className="text-center space-y-6">
            <h2 className="text-6xl font-black font-headline tracking-tighter text-slate-900">
              FACTCHECK <span className="text-primary italic">AI</span>
            </h2>
            <div className="flex items-center justify-center gap-4">
              <div className="h-[2px] w-20 bg-slate-100" />
              <p className="text-[10px] font-black tracking-[0.8em] text-slate-300 uppercase">
                Atmospheric Audit
              </p>
              <div className="h-[2px] w-20 bg-slate-100" />
            </div>
          </div>
        </div>

        <div className="w-96 space-y-6">
          <div className="flex justify-between items-end text-slate-400 px-2">
            <span className="text-[9px] font-black uppercase tracking-[0.4em] text-slate-300">Clarifying Mist</span>
            <span className="text-4xl font-black font-mono tracking-tighter text-slate-900">
              {Math.round(progress)}%
            </span>
          </div>
          <div className="h-[4px] w-full bg-slate-100 relative overflow-hidden rounded-full shadow-inner">
            <div 
              className="absolute top-0 left-0 h-full bg-primary transition-all duration-300 ease-out shadow-[0_0_20px_rgba(0,0,0,0.2)]"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
