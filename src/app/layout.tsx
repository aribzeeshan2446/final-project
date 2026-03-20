'use client';

import React, { useState } from 'react';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { FirebaseClientProvider } from '@/firebase';
import { IntroLoader } from '@/components/intro-loader';
import { cn } from '@/lib/utils';
import Image from 'next/image';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <html lang="en">
      <head>
        <title>FactCheck AI - Deep Forest Forensic Audit</title>
        <meta name="description" content="Instantly verify web content with the FactCheck AI forensic lens." />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@400;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased selection:bg-primary/20 bg-white min-h-screen">
        {/* Fixed Deep Forensic Forest Backdrop */}
        <div className="fixed inset-0 -z-50 pointer-events-none overflow-hidden">
          <Image 
            src="https://picsum.photos/seed/black-pines/1920/1080"
            alt="Dark Pine Forest"
            fill
            priority
            className="object-cover opacity-80 brightness-75 contrast-150 saturate-[0.2]"
            data-ai-hint="dark pine forest mist"
          />
          {/* Specific Twilight Mist Overlays based on image */}
          <div className="absolute inset-0 bg-gradient-to-tr from-[#F8FAFC] via-transparent to-[#FCE7F3]/30" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#E2E8F0]/20 via-white/40 to-white" />
          <div className="absolute inset-0 backdrop-blur-[3px]" />
          <div className="absolute inset-0 forest-vignette" />
        </div>

        <FirebaseClientProvider>
          <IntroLoader onComplete={() => setIsLoaded(true)} />
          <div 
            className={cn(
              "transition-all duration-1500 ease-[cubic-bezier(0.85,0,0.15,1)] min-h-screen flex flex-col",
              isLoaded ? "scale-100 opacity-100 blur-0" : "scale-[0.95] opacity-0 blur-3xl overflow-hidden h-screen"
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