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
        <title>FactCheck AI - Deep Forest Clarity</title>
        <meta name="description" content="Verified facts in a world of information." />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body selection:bg-primary/20 bg-white min-h-screen">
        {/* Deep Forest Backdrop - Visibility synced with isLoaded */}
        <div className={cn(
          "fixed inset-0 -z-50 pointer-events-none overflow-hidden",
          isLoaded ? "opacity-100" : "opacity-0"
        )}>
          <Image 
            src={wallpaper} 
            alt="Forest Backdrop"
            fill
            priority
            className="object-cover"
          />
          {/* Subtle mist overlay to ensure text contrast */}
          <div className="absolute inset-0 bg-white/20 backdrop-blur-[1px]" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-white/40" />
        </div>

        <FirebaseClientProvider>
          <IntroLoader onComplete={() => setIsLoaded(true)} />
          <div 
            className={cn(
              "min-h-screen flex flex-col",
              isLoaded ? "opacity-100" : "opacity-0"
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
