'use client';

import React, { useState } from 'react';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { FirebaseClientProvider } from '@/firebase';
import { IntroLoader } from '@/components/intro-loader';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import wallpaper from '@/Pic/wallpaper1.png';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <html lang="en">
      <head>
        <title>FactCheck AI - Forensic Atmosphere</title>
        <meta name="description" content="Clarifying the digital fog with forensic intelligence." />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body selection:bg-primary/20 bg-white min-h-screen">
        {/* Fixed Backdrop: User-provided ink-black pines from src/Pic */}
        <div className="fixed inset-0 -z-50 pointer-events-none overflow-hidden bg-white">
          <Image 
            src={wallpaper} 
            alt="Forensic Forest Backdrop"
            fill
            priority
            className="object-cover opacity-100 contrast-[1.1] brightness-[1.05]"
          />
          {/* Atmospheric Misty Overlays */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/30 via-transparent to-white/60" />
          <div className="absolute inset-0 backdrop-blur-[0.5px]" />
          <div className="absolute inset-0 forest-vignette" />
        </div>

        <FirebaseClientProvider>
          <IntroLoader onComplete={() => setIsLoaded(true)} />
          <div 
            className={cn(
              "transition-all duration-1000 ease-[cubic-bezier(0.85,0,0.15,1)] min-h-screen flex flex-col",
              isLoaded ? "scale-100 opacity-100 blur-0" : "scale-[0.98] opacity-0 blur-2xl overflow-hidden h-screen"
            )}
          >
            {children}
          </div>
          <Toaster />
        </FirebaseClientProvider>
      </body>
    </html>
  );
}
