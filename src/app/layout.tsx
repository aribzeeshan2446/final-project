'use client';

import React, { useState } from 'react';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { FirebaseClientProvider } from '@/firebase';
import { IntroLoader } from '@/components/intro-loader';
import { cn } from '@/lib/utils';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <html lang="en">
      <head>
        <title>FactCheck AI - Truth at Your Fingertips</title>
        <meta name="description" content="Instantly verify web content with the FactCheck AI browser extension." />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased selection:bg-primary/20">
        <FirebaseClientProvider>
          <IntroLoader onComplete={() => setIsLoaded(true)} />
          <div 
            className={cn(
              "transition-all duration-1000 ease-[cubic-bezier(0.85,0,0.15,1)]",
              isLoaded ? "scale-100 opacity-100 blur-0" : "scale-[0.97] opacity-0 blur-sm overflow-hidden h-screen"
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
