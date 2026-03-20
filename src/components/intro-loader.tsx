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
    // Generate snow-like data particles
    const newSnow = [...Array(30)].map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      size: `${Math.random() * 2 + 1}px`,
      duration: `${Math.random() * 4 + 2}s`,
      delay: `${Math.random() * -10}s`,
      opacity: Math.random() * 0.3 + 0.1
    }));
    setSnowflakes(newSnow);

    const duration = 1500;
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
      // When loaded, hold it static for a moment then fade out simply
      setTimeout(() => {
        setIsExiting(true);
        onComplete();
        setTimeout(() => setShouldHide(true), 800);
      }, 400);
    }
  }, [progress, onComplete]);

  if (shouldHide) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-white flex flex-col items-center justify-center overflow-hidden">
      {/* Background Particles - become static if exiting */}
      {snowflakes.map((flake) => (
        <div
          key={flake.id}
          className={cn(
            "absolute top-[-20px] bg-slate-200 rounded-full pointer-events-none",
            !isExiting && "snow-drift"
          )}
          style={{
            left: flake.left,
            width: flake.size,
            height: flake.size,
            animationDuration: flake.duration,
            animationDelay: flake.delay,
            opacity: flake.opacity,
            ...(isExiting ? { transform: 'translateY(50vh)' } : {})
          }}
        />
      ))}

      <div 
        className={cn(
          "relative z-10 space-y-10 transition-all duration-700",
          isExiting ? "opacity-0 scale-95 blur-sm" : "opacity-100"
        )}
      >
        <div className="flex flex-col items-center gap-6">
          <div className="bg-primary p-4 rounded-[1.5rem] shadow-xl">
            <ShieldCheck className="h-12 w-12 text-white" />
          </div>
          
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900">
              FactCheck <span className="text-primary">AI</span>
            </h2>
            <p className="text-[10px] font-bold tracking-[0.4em] text-slate-400 uppercase mt-2">
              Analysis Complete
            </p>
          </div>
        </div>

        <div className="w-48 space-y-2">
          <div className="h-[2px] w-full bg-slate-100 relative overflow-hidden rounded-full">
            <div 
              className="absolute top-0 left-0 h-full bg-primary transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="text-center">
            <span className="text-[9px] font-bold text-slate-400">{Math.round(progress)}%</span>
          </div>
        </div>
      </div>
    </div>
  );
}
