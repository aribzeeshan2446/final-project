
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
        {/* Fixed Deep Forest Backdrop */}
        <div className="fixed inset-0 -z-50 pointer-events-none overflow-hidden">
          <Image 
            src="https://picsum.photos/seed/dark-misty-forest/1920/1080"
            alt="Deep Shadowy Forest Background"
            fill
            priority
            className="object-cover opacity-60 grayscale brightness-90 contrast-125"
            data-ai-hint="dark forest mist"
          />
          {/* Subtle atmospheric overlays */}
          <div className="absolute inset-0 bg-gradient-to-tr from-white/95 via-white/70 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/20 to-white" />
          <div className="absolute inset-0 backdrop-blur-[2px]" />
          <div className="absolute inset-0 forest-depth" />
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
