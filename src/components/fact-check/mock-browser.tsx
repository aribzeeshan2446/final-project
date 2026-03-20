"use client";

import React, { useState, useRef } from "react";
import { Search, Globe, RotateCcw, ShieldCheck, Loader2, Info, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { verifySelectedTextAccuracy } from "@/ai/flows/verify-selected-text-accuracy";
import { VerdictCard } from "./verdict-card";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const ARTICLE_CONTENT = `In today's interconnected world, the speed at which news travels is unprecedented. 
Reliable reports estimate that the Great Wall of China is the only man-made structure visible from the Moon.
While this is a popular piece of information often cited in trivia, its factual basis is frequently debated by scholars.

Furthermore, many people believe that humans only use 10% of their brains. 
This concept has fueled countless science fiction narratives and self-help books, 
yet neuroscientists consistently point out that we use virtually every part of the brain 
at some point during the day.

Climate experts recently reported that the year 2023 was the warmest on record since global climate 
data tracking began in the late 1800s. This information is supported by multiple international 
meteorological agencies and serves as a critical point of discussion for policy makers worldwide.`;

export function MockBrowser() {
  const [selectedText, setSelectedText] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [result, setResult] = useState<{
    verdict: 'Likely Accurate' | 'Needs Verification' | 'Potentially Misleading';
    suggestedCorrectionOrContext: string | null;
    reasoning: string;
    sources: { title: string; url: string; reliability?: 'High' | 'Medium' | 'Mixed' }[];
  } | null>(null);

  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const handleTextSelection = () => {
    setTimeout(() => {
      const selection = window.getSelection();
      const text = selection?.toString().trim();
      
      if (text && text.length > 5 && selection && selection.rangeCount > 0 && containerRef.current) {
        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();
        const containerRect = containerRef.current.getBoundingClientRect();
        
        setTooltipPos({
          x: rect.left - containerRect.left + rect.width / 2,
          y: rect.top - containerRect.top - 10
        });
        setSelectedText(text);
        setShowTooltip(true);
      } else {
        if (!isVerifying) {
          setShowTooltip(false);
        }
      }
    }, 10);
  };

  const verifyText = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!selectedText) return;
    
    setShowTooltip(false);
    setIsVerifying(true);
    setResult(null);
    
    try {
      const output = await verifySelectedTextAccuracy({ selectedText });
      setResult(output);
      window.getSelection()?.removeAllRanges();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Verification Error",
        description: "We couldn't reach the AI service.",
      });
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="rounded-[3rem] border-8 border-slate-100 overflow-hidden bg-white shadow-2xl relative">
        {/* Browser Chrome */}
        <div className="bg-slate-50/80 backdrop-blur-md p-5 border-b border-slate-100 flex items-center justify-between gap-6">
          <div className="flex gap-2.5">
            <div className="w-3.5 h-3.5 rounded-full bg-slate-200" />
            <div className="w-3.5 h-3.5 rounded-full bg-slate-200" />
            <div className="w-3.5 h-3.5 rounded-full bg-slate-200" />
          </div>
          <div className="flex items-center gap-3 bg-white rounded-2xl px-5 py-2.5 flex-1 border border-slate-100 shadow-inner max-w-xl mx-auto">
            <Globe className="h-4 w-4 text-slate-900 opacity-60" />
            <span className="text-[11px] text-slate-900 truncate font-black uppercase tracking-tight">https://news.example.com/daily-digest</span>
          </div>
          <div className="flex items-center gap-5 text-slate-900 border-l border-slate-200 pl-5">
            <RotateCcw className="h-5 w-5 cursor-pointer hover:text-primary transition-colors" />
            <Search className="h-5 w-5 cursor-pointer hover:text-primary transition-colors" />
          </div>
        </div>

        {/* Content Area */}
        <div 
          className="p-16 md:p-24 min-h-[700px] relative select-text" 
          onMouseUp={handleTextSelection}
          ref={containerRef}
        >
          <div className="max-w-3xl mx-auto space-y-12">
            <h1 className="text-6xl font-black font-headline text-slate-900 leading-[1.05] tracking-tight">
              Deciphering Fact <br/><span className="text-primary italic">from</span> Fiction
            </h1>
            <div className="flex items-center justify-between text-[11px] text-slate-900 font-black uppercase tracking-widest border-b-2 border-slate-50 pb-8">
              <div className="flex items-center gap-5">
                <span>Elena Vance</span>
                <span className="text-slate-100">|</span>
                <span>Oct 24, 2023</span>
              </div>
              <div className="flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-primary/5 text-primary border border-primary/10">
                <Info className="h-3.5 w-3.5" />
                <span>Select Text to Audit</span>
              </div>
            </div>
            
            <div className="prose prose-slate max-w-none text-xl text-slate-900 font-bold leading-relaxed space-y-8">
              {ARTICLE_CONTENT.split('\n\n').map((p, i) => <p key={i}>{p}</p>)}
            </div>
          </div>

          {/* Selection Tooltip */}
          {showTooltip && !result && !isVerifying && (
            <div 
              className="absolute z-50 animate-in fade-in zoom-in duration-300 pointer-events-auto"
              style={{ 
                left: tooltipPos.x, 
                top: tooltipPos.y, 
                transform: 'translate(-50%, -100%)' 
              }}
              onMouseUp={(e) => e.stopPropagation()}
            >
              <Button 
                size="sm" 
                className="bg-primary hover:bg-primary/95 text-white rounded-full shadow-2xl gap-3 px-8 py-4 text-[12px] font-black uppercase tracking-widest border-4 border-white"
                onMouseDown={(e) => e.preventDefault()}
                onClick={verifyText}
              >
                <ShieldCheck className="h-4 w-4" />
                Audit Selection
              </Button>
              <div className="w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[10px] border-t-primary mx-auto" />
            </div>
          )}

          {/* Loading Tooltip */}
          {isVerifying && (
            <div 
              className="absolute z-50 animate-in fade-in zoom-in duration-300 pointer-events-none"
              style={{ 
                left: tooltipPos.x, 
                top: tooltipPos.y, 
                transform: 'translate(-50%, -100%)' 
              }}
            >
              <div className="bg-slate-900 text-white rounded-full shadow-2xl flex items-center gap-3 px-8 py-4 border-4 border-white">
                <Loader2 className="h-4 w-4 animate-spin text-primary" />
                <span className="text-[12px] font-black uppercase tracking-widest">Analyzing...</span>
              </div>
              <div className="w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[10px] border-t-slate-900 mx-auto" />
            </div>
          )}

          {/* Integrated Seamless Result Card (Floating, No Full Blur) */}
          {result && (
            <div 
              className="absolute z-50 animate-in fade-in slide-in-from-top-4 duration-500 pointer-events-auto"
              style={{ 
                left: '50%',
                top: tooltipPos.y,
                transform: 'translateX(-50%)'
              }}
            >
              <div className="relative w-[400px]">
                <VerdictCard 
                  verdict={result.verdict} 
                  context={result.suggestedCorrectionOrContext}
                  reasoning={result.reasoning}
                  sources={result.sources}
                  onClose={() => setResult(null)}
                  className="shadow-2xl border-4 border-white"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}