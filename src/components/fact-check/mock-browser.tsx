"use client";

import React, { useState, useRef, useEffect } from "react";
import { Search, Globe, RotateCcw, ShieldCheck, Zap, Loader2, Info, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { verifySelectedTextAccuracy } from "@/ai/flows/verify-selected-text-accuracy";
import { analyzePageClaims } from "@/ai/flows/analyze-page-claims";
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
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<{
    claims: Array<{ claimText: string; verdict: string; context: string }>;
    overallHealth: number;
  } | null>(null);
  
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
    // Small timeout to ensure window.getSelection() is populated
    setTimeout(() => {
      const selection = window.getSelection();
      const text = selection?.toString().trim();
      
      if (text && text.length > 5 && selection && selection.rangeCount > 0 && containerRef.current) {
        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();
        const containerRect = containerRef.current.getBoundingClientRect();
        
        if (rect) {
          // Calculate position relative to the container for "absolute" positioning
          setTooltipPos({
            x: rect.left - containerRect.left + rect.width / 2,
            y: rect.top - containerRect.top - 10
          });
          setSelectedText(text);
          setShowTooltip(true);
        }
      } else {
        if (!isVerifying && !result) {
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
    setScanResult(null); 
    
    try {
      const output = await verifySelectedTextAccuracy({ selectedText });
      setResult(output);
      window.getSelection()?.removeAllRanges();
    } catch (error) {
      console.error("Verification failed", error);
      toast({
        variant: "destructive",
        title: "Verification Error",
        description: "We couldn't reach the AI service.",
      });
    } finally {
      setIsVerifying(false);
    }
  };

  const handleScanPage = async () => {
    setIsScanning(true);
    setResult(null);
    setShowTooltip(false);
    
    try {
      const output = await analyzePageClaims({ pageText: ARTICLE_CONTENT });
      setScanResult(output);
      toast({
        title: "Scan Complete",
        description: `Identified ${output.claims.length} claims.`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Scan Failed",
        description: "Could not analyze the page.",
      });
    } finally {
      setIsScanning(false);
    }
  };

  const renderHighlightedContent = () => {
    if (!scanResult) return ARTICLE_CONTENT.split('\n\n').map((p, i) => <p key={i}>{p}</p>);

    let content = ARTICLE_CONTENT;
    const sortedClaims = [...scanResult.claims].sort((a, b) => b.claimText.length - a.claimText.length);
    
    return content.split('\n\n').map((paragraph, pIdx) => {
      let elements: React.ReactNode[] = [paragraph];
      
      sortedClaims.forEach((claim) => {
        const newElements: React.ReactNode[] = [];
        elements.forEach((el) => {
          if (typeof el !== 'string') {
            newElements.push(el);
            return;
          }
          
          const parts = el.split(claim.claimText);
          if (parts.length > 1) {
            parts.forEach((part, i) => {
              newElements.push(part);
              if (i < parts.length - 1) {
                const colorClass = claim.verdict === 'Accurate' 
                  ? "bg-emerald-100 text-emerald-900 border-b-2 border-emerald-600" 
                  : claim.verdict === 'Misleading' 
                  ? "bg-rose-100 text-rose-900 border-b-2 border-rose-600" 
                  : "bg-amber-100 text-amber-900 border-b-2 border-amber-600";
                
                newElements.push(
                  <span 
                    key={`${pIdx}-${claim.claimText}-${i}`} 
                    className={cn("px-0.5 rounded-sm transition-all cursor-help relative group/claim font-bold", colorClass)}
                  >
                    {claim.claimText}
                    <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block w-48 p-2 bg-slate-900 text-white text-[10px] rounded shadow-xl z-50">
                      <span className="font-black uppercase tracking-widest block mb-1">
                        {claim.verdict}
                      </span>
                      {claim.context}
                    </span>
                  </span>
                );
              }
            });
          } else {
            newElements.push(el);
          }
        });
        elements = newElements;
      });
      return <p key={pIdx}>{elements}</p>;
    });
  };

  return (
    <div className="w-full max-w-6xl mx-auto flex flex-col md:flex-row gap-6">
      <div className="flex-1 rounded-2xl border-4 border-slate-200 overflow-hidden bg-white shadow-2xl relative">
        {/* Browser Chrome */}
        <div className="bg-slate-100 p-3 border-b border-slate-200 flex items-center justify-between gap-4">
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-slate-300" />
            <div className="w-3 h-3 rounded-full bg-slate-300" />
            <div className="w-3 h-3 rounded-full bg-slate-300" />
          </div>
          <div className="flex items-center gap-2 bg-white rounded-lg px-3 py-1.5 flex-1 border border-slate-200 shadow-sm max-w-lg">
            <Globe className="h-4 w-4 text-slate-400" />
            <span className="text-xs text-slate-900 truncate font-bold">https://news.example.com/daily-digest</span>
          </div>
          <div className="flex items-center gap-3">
            <Button 
              size="sm" 
              variant="default" 
              disabled={isScanning}
              onClick={handleScanPage}
              className="h-8 rounded-full gap-2 text-[10px] font-black uppercase tracking-widest bg-primary hover:bg-primary/90 shadow-sm"
            >
              {isScanning ? <Loader2 className="h-3 w-3 animate-spin" /> : <Zap className="h-3 w-3" />}
              Scan Page
            </Button>
            <div className="flex items-center gap-2 text-slate-500 border-l border-slate-200 pl-3">
              <RotateCcw className="h-4 w-4 cursor-pointer hover:text-primary transition-colors" />
              <Search className="h-4 w-4 cursor-pointer hover:text-primary transition-colors" />
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div 
          className="p-8 md:p-12 min-h-[550px] relative select-text" 
          onMouseUp={handleTextSelection}
          ref={containerRef}
        >
          <div className="max-w-2xl mx-auto space-y-6">
            <h1 className="text-4xl font-bold font-headline text-slate-900 leading-tight">
              The Future of Information: Deciphering Fact from Fiction in the Digital Age
            </h1>
            <div className="flex items-center justify-between text-sm text-slate-900 font-bold border-b border-slate-200 pb-4">
              <div className="flex items-center gap-3">
                <span className="text-slate-900">By Elena Vance</span>
                <span className="text-slate-300">•</span>
                <span>October 24, 2023</span>
              </div>
              <div className="hidden lg:flex items-center gap-2 px-3 py-1 rounded-full bg-slate-50 border border-slate-200 text-[9px] font-black">
                <Info className="h-3 w-3 text-primary" />
                <span>SELECT TEXT TO VERIFY</span>
              </div>
            </div>
            
            <div className="prose prose-slate max-w-none text-lg text-slate-900 font-bold leading-relaxed space-y-4">
              {renderHighlightedContent()}
              
              <p className="italic text-slate-800 text-base pt-4 border-t border-slate-100 font-bold">
                {scanResult 
                  ? "Page analyzed. Hover over highlighted text to see details." 
                  : "Highlight specific text or click 'Scan Page' to verify everything at once."}
              </p>
            </div>
          </div>

          {/* Selection Tooltip - Absolute within Container */}
          {showTooltip && (
            <div 
              className="absolute z-50 animate-in fade-in zoom-in duration-200 pointer-events-auto"
              style={{ 
                left: tooltipPos.x, 
                top: tooltipPos.y, 
                transform: 'translate(-50%, -100%)' 
              }}
              onMouseUp={(e) => e.stopPropagation()}
            >
              <Button 
                size="sm" 
                className="bg-primary hover:bg-primary/90 text-white rounded-full shadow-lg gap-2 px-4 py-2 text-[10px] font-black uppercase tracking-widest"
                onMouseDown={(e) => e.preventDefault()}
                onClick={verifyText}
              >
                <ShieldCheck className="h-4 w-4" />
                Verify Selection
              </Button>
              <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-primary mx-auto" />
            </div>
          )}

          {/* Loading Overlay */}
          {isVerifying && (
            <div className="absolute inset-0 bg-white/80 backdrop-blur-md z-40 flex items-center justify-center p-6">
              <div className="bg-white p-8 rounded-2xl border-2 border-slate-200 shadow-2xl flex flex-col items-center gap-4 text-center">
                <div className="relative">
                  <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                  <ShieldCheck className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-black text-lg uppercase tracking-tight text-slate-900">Verifying Claim</h3>
                  <p className="text-sm text-slate-900 font-bold">Scouring reliable global indices...</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Sidebar */}
      <div className="w-full md:w-[320px] shrink-0 space-y-6">
        {result && (
          <VerdictCard 
            verdict={result.verdict} 
            context={result.suggestedCorrectionOrContext}
            reasoning={result.reasoning}
            sources={result.sources}
            onClose={() => {
              setResult(null);
              setSelectedText("");
            }}
          />
        )}

        {scanResult && (
          <div className="bg-white rounded-2xl border-2 border-slate-200 p-6 shadow-xl space-y-6 animate-in slide-in-from-right-4">
            <div className="flex items-center justify-between">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-900">Page Health</h4>
              <Zap className="h-4 w-4 text-primary" />
            </div>
            
            <div className="flex flex-col items-center gap-4 py-4">
              <div className="relative w-24 h-24">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="48" cy="48" r="42" stroke="currentColor" strokeWidth="6" fill="transparent" className="text-slate-100" />
                  <circle 
                    cx="48" cy="48" r="42" stroke="currentColor" strokeWidth="6" fill="transparent" 
                    strokeDasharray={263.8} 
                    strokeDashoffset={263.8 - (263.8 * scanResult.overallHealth) / 100}
                    className={cn("transition-all duration-1000", scanResult.overallHealth > 70 ? "text-primary" : "text-amber-600")} 
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center text-xl font-black text-slate-900">
                  {scanResult.overallHealth}%
                </div>
              </div>
              <p className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Aggregate Trust Score</p>
            </div>

            <div className="space-y-3">
              <p className="text-[9px] font-black uppercase tracking-widest text-slate-900 border-b border-slate-100 pb-2">Analysis Breakdown</p>
              {scanResult.claims.map((claim, i) => (
                <div key={i} className="flex items-start gap-2 group cursor-help border-b border-slate-50 pb-2 last:border-0">
                  {claim.verdict === 'Accurate' ? (
                    <CheckCircle2 className="h-3.5 w-3.5 text-primary mt-0.5 shrink-0" />
                  ) : (
                    <AlertCircle className="h-3.5 w-3.5 text-amber-600 mt-0.5 shrink-0" />
                  )}
                  <div className="space-y-0.5">
                    <p className="text-[10px] font-black text-slate-900 line-clamp-1 group-hover:text-primary transition-colors uppercase tracking-tight">
                      {claim.claimText}
                    </p>
                    <p className="text-[9px] text-slate-900 font-bold italic line-clamp-2">
                      {claim.context}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <Button 
              variant="outline" 
              size="sm" 
              className="w-full rounded-xl h-9 text-[9px] font-black uppercase tracking-widest border-slate-200 text-slate-900 font-bold"
              onClick={() => setScanResult(null)}
            >
              Clear Analysis
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
