"use client";

import React, { useState, useRef, useEffect } from "react";
import { Search, Globe, ChevronLeft, ChevronRight, RotateCcw, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { verifySelectedTextAccuracy } from "@/ai/flows/verify-selected-text-accuracy";
import { VerdictCard } from "./verdict-card";
import { Skeleton } from "@/components/ui/skeleton";

export function MockBrowser() {
  const [selectedText, setSelectedText] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [result, setResult] = useState<{
    verdict: 'Likely Accurate' | 'Needs Verification' | 'Potentially Misleading';
    suggestedCorrectionOrContext: string | null;
  } | null>(null);
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const handleTextSelection = () => {
    const selection = window.getSelection();
    const text = selection?.toString().trim();
    
    if (text && text.length > 5) {
      const range = selection?.getRangeAt(0);
      const rect = range?.getBoundingClientRect();
      
      if (rect) {
        setTooltipPos({
          x: rect.left + rect.width / 2,
          y: rect.top - 10
        });
        setSelectedText(text);
        setShowTooltip(true);
      }
    } else {
      setShowTooltip(false);
    }
  };

  const verifyText = async () => {
    if (!selectedText) return;
    
    setShowTooltip(false);
    setIsVerifying(true);
    setResult(null);
    
    try {
      const output = await verifySelectedTextAccuracy({ selectedText });
      setResult(output);
    } catch (error) {
      console.error("Verification failed", error);
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto rounded-xl border-4 border-muted overflow-hidden bg-white shadow-2xl relative">
      {/* Browser Chrome */}
      <div className="bg-muted p-3 border-b flex items-center gap-4">
        <div className="flex gap-2">
          <div className="w-3 h-3 rounded-full bg-red-400" />
          <div className="w-3 h-3 rounded-full bg-amber-400" />
          <div className="w-3 h-3 rounded-full bg-green-400" />
        </div>
        <div className="flex items-center gap-2 bg-white rounded-md px-3 py-1 flex-1 border shadow-sm max-w-lg">
          <Globe className="h-4 w-4 text-muted-foreground" />
          <span className="text-xs text-muted-foreground truncate">https://news.example.com/daily-digest</span>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <RotateCcw className="h-4 w-4" />
          <Search className="h-4 w-4" />
        </div>
      </div>

      {/* Content Area */}
      <div 
        className="p-8 md:p-12 min-h-[500px] relative select-text" 
        onMouseUp={handleTextSelection}
        ref={containerRef}
      >
        <div className="max-w-2xl mx-auto space-y-6">
          <h1 className="text-4xl font-bold font-headline text-slate-900 leading-tight">
            The Future of Information: Deciphering Fact from Fiction in the Digital Age
          </h1>
          <div className="flex items-center gap-3 text-sm text-muted-foreground border-b pb-4">
            <span className="font-semibold text-slate-700">By Elena Vance</span>
            <span>•</span>
            <span>October 24, 2023</span>
          </div>
          
          <div className="prose prose-slate max-w-none text-lg text-slate-700 leading-relaxed space-y-4">
            <p>
              In today's interconnected world, the speed at which news travels is unprecedented. 
              Reliable reports estimate that the Great Wall of China is the only man-made structure visible from the Moon.
              While this is a popular piece of information often cited in trivia, its factual basis is frequently debated by scholars.
            </p>
            <p>
              Furthermore, many people believe that humans only use 10% of their brains. 
              This concept has fueled countless science fiction narratives and self-help books, 
              yet neuroscientists consistently point out that we use virtually every part of the brain 
              at some point during the day.
            </p>
            <p>
              Climate experts recently reported that the year 2023 was the warmest on record since global climate 
              data tracking began in the late 1800s. This information is supported by multiple international 
              meteorological agencies and serves as a critical point of discussion for policy makers worldwide.
            </p>
            <p className="italic text-muted-foreground text-base">
              Try selecting any of the sentences above to see FactCheck AI in action.
            </p>
          </div>
        </div>

        {/* Custom Tooltip Trigger */}
        {showTooltip && (
          <div 
            className="fixed z-50 animate-in fade-in zoom-in duration-200"
            style={{ 
              left: tooltipPos.x, 
              top: tooltipPos.y, 
              transform: 'translate(-50%, -100%)' 
            }}
          >
            <Button 
              size="sm" 
              className="bg-primary hover:bg-primary/90 text-white rounded-full shadow-lg gap-2 px-4 py-2"
              onClick={verifyText}
            >
              <ShieldCheck className="h-4 w-4" />
              Verify with FactCheck AI
            </Button>
            <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-primary mx-auto" />
          </div>
        )}

        {/* Verification Modal / Overlay */}
        {(isVerifying || result) && (
          <div className="absolute inset-0 bg-white/60 backdrop-blur-sm z-40 flex items-center justify-center p-6">
            <div className="w-full max-w-md animate-in slide-in-from-bottom-4 duration-300">
              {isVerifying ? (
                <div className="bg-white p-8 rounded-2xl border shadow-xl flex flex-col items-center gap-4 text-center">
                  <div className="relative">
                    <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                    <ShieldCheck className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">Verifying Facts</h3>
                    <p className="text-sm text-muted-foreground">Checking against reliable sources...</p>
                  </div>
                </div>
              ) : result ? (
                <div className="relative">
                  <VerdictCard 
                    verdict={result.verdict} 
                    context={result.suggestedCorrectionOrContext} 
                  />
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="absolute top-2 right-2 text-muted-foreground hover:text-foreground"
                    onClick={() => setResult(null)}
                  >
                    Dismiss
                  </Button>
                </div>
              ) : null}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}