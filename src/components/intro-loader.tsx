'use client';

import React, { useState, useEffect } from 'react';
import { ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';

const STEPS = [
  "INITIALIZING SECURE PROTOCOLS",
  "SCRUTINIZING DATA INDICES",
  "VERIFYING FACTUAL INTEGRITY",
  "ESTABLISHING TRUTH CONTEXT",
  "AUTHENTICATING VERDICT"
];

export function IntroLoader({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0);
  const [stepIndex, setStepIndex] = useState(0);
  const [isExiting, setIsExiting] = useState(false);
  const [shouldHide, setShouldHide] = useState(false);

  useEffect(() => {
    const duration = 2500; // 2.5 seconds total
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
    const stepTimer = setInterval(() => {
      setStepIndex((prev) => (prev < STEPS.length - 1 ? prev + 1 : prev));
    }, 500);
    return () => clearInterval(stepTimer);
  }, []);

  useEffect(() => {
    if (progress === 100) {
      setTimeout(() => {
        setIsExiting(true);
        onComplete();
        setTimeout(() => setShouldHide(true), 1200); // Match shutter animation duration
      }, 500);
    }
  }, [progress, onComplete]);

  if (shouldHide) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col pointer-events-none overflow-hidden">
      {/* Top Shutter */}
      <div 
        className={cn(
          "absolute inset-x-0 top-0 h-1/2 bg-[#0A0A0A] shutter-reveal",
          isExiting ? "-translate-y-full" : "translate-y-0"
        )} 
      />
      
      {/* Bottom Shutter */}
      <div 
        className={cn(
          "absolute inset-x-0 bottom-0 h-1/2 bg-[#0A0A0A] shutter-reveal",
          isExiting ? "translate-y-full" : "translate-y-0"
        )} 
      />

      {/* Loading Content */}
      <div 
        className={cn(
          "relative flex-1 flex flex-col items-center justify-center p-8 transition-opacity duration-500",
          isExiting ? "opacity-0" : "opacity-100"
        )}
      >
        <div className="max-w-md w-full space-y-12">
          {/* Brand Intro */}
          <div className="flex flex-col items-center gap-6">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full animate-pulse-slow" />
              <ShieldCheck className="h-16 w-16 text-primary relative z-10" />
            </div>
            <div className="overflow-hidden">
              <h2 className="text-3xl font-black font-headline tracking-tighter text-white reveal-text">
                FACTCHECK <span className="text-primary italic">AI</span>
              </h2>
            </div>
          </div>

          {/* Progress Section */}
          <div className="space-y-4">
            <div className="flex justify-between items-end">
              <div className="overflow-hidden">
                <p className="text-[10px] font-black tracking-[0.3em] text-slate-500 uppercase reveal-text">
                  {STEPS[stepIndex]}
                </p>
              </div>
              <p className="text-4xl font-black font-mono text-white tracking-tighter">
                {Math.round(progress)}<span className="text-primary">%</span>
              </p>
            </div>
            
            {/* Minimalist Progress Bar */}
            <div className="h-[2px] w-full bg-white/5 relative overflow-hidden rounded-full">
              <div 
                className="absolute top-0 left-0 h-full bg-primary transition-all duration-150 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Footer Metadata */}
          <div className="flex justify-between items-center text-[8px] font-bold tracking-widest text-slate-700 uppercase">
            <span>Core v1.4.2</span>
            <span>Est. 2024</span>
            <span>Secure Interface</span>
          </div>
        </div>
      </div>
    </div>
  );
}
