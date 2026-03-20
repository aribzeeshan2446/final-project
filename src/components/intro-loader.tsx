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
    // Generate ink-black forensic spores for high-key white theme
    const newSnow = [...Array(45)].map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      size: `${Math.random() * 2.5 + 1}px`,
      duration: `${Math.random() * 5 + 3}s`,
      delay: `${Math.random() * -10}s`,
      opacity: Math.random() * 0.4 + 0.15
    }));
    setSnowflakes(newSnow);

    const duration = 2000;
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
      }, 400);
    }
  }, [progress, onComplete]);

  if (shouldHide) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-white flex flex-col items-center justify-center overflow-hidden">
      {/* High-Key Mist atmosphere */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 right-0 w-[80%] h-[80%] rounded-full bg-slate-100/40 blur-[150px] pulse-biolume" />
        <div className="absolute bottom-1/3 left-0 w-[60%] h-[60%] rounded-full bg-slate-200/30 blur-[120px] pulse-biolume" style={{ animationDelay: '-3s' }} />
      </div>

      {/* Forensic Spores (Ink Black Snow) */}
      {snowflakes.map((flake) => (
        <div
          key={flake.id}
          className="absolute top-[-20px] bg-primary rounded-full snow-drift pointer-events-none"
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
          "absolute inset-0 bg-white/50 backdrop-blur-[30px] transition-opacity duration-1500 pointer-events-none z-50",
          isExiting ? "reveal-mist" : "opacity-0"
        )} 
      />

      <div 
        className={cn(
          "relative z-10 space-y-12 transition-all duration-1000 ease-[cubic-bezier(0.85,0,0.15,1)]",
          isExiting ? "opacity-0 scale-[1.05] blur-[30px] translate-y-[-10px]" : "opacity-100"
        )}
      >
        <div className="flex flex-col items-center gap-8">
          <div className="relative">
            <div className="absolute inset-0 bg-primary/5 blur-[50px] rounded-full animate-pulse" />
            <div className="bg-primary p-4 rounded-3xl shadow-xl relative z-10">
              <ShieldCheck className="h-14 w-14 text-white" />
            </div>
          </div>
          
          <div className="text-center space-y-3">
            <h2 className="text-4xl font-black font-headline tracking-tighter text-slate-900 uppercase">
              FactCheck <span className="text-primary italic">AI</span>
            </h2>
            <div className="flex items-center justify-center gap-3">
              <div className="h-[1px] w-10 bg-slate-100" />
              <p className="text-[8px] font-black tracking-[0.5em] text-slate-300 uppercase">
                Atmospheric Scan
              </p>
              <div className="h-[1px] w-10 bg-slate-100" />
            </div>
          </div>
        </div>

        <div className="w-64 space-y-4">
          <div className="flex justify-between items-end text-slate-400 px-1">
            <span className="text-[7px] font-black uppercase tracking-[0.3em] text-slate-300">Clarifying...</span>
            <span className="text-2xl font-black font-mono tracking-tighter text-slate-900">
              {Math.round(progress)}%
            </span>
          </div>
          <div className="h-[2px] w-full bg-slate-50 relative overflow-hidden rounded-full">
            <div 
              className="absolute top-0 left-0 h-full bg-primary transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}