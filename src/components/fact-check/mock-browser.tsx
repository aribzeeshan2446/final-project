"use client";

import React, { useState, useRef } from "react";
import { Search, Globe, RotateCcw, ShieldCheck, Zap, Loader2, Info, CheckCircle2, AlertCircle, X } from "lucide-react";
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
    setTimeout(() => {
      const selection = window.getSelection();
      const text = selection?.toString().trim();
      
      if (text && text.length > 5 && selection && selection.rangeCount > 0 && containerRef.current) {
        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();
        const containerRect = containerRef.current.getBoundingClientRect();
        
        // Pin tooltip to selection
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
                  ? "bg-emerald-100 text-slate-900 border-b-2 border-emerald-600" 
                  : claim.verdict === 'Misleading' 
                  ? "bg-rose-100 text-slate-900 border-b-2 border-rose-600" 
                  : "bg-amber-100 text-slate-900 border-b-2 border-amber-600";
                
                newElements.push(
                  <span 
                    key={`${pIdx}-${claim.claimText}-${i}`} 
                    className={cn("px-0.5 rounded-sm transition-all cursor-help relative group/claim font-bold", colorClass)}
                  >
                    {claim.claimText}
                    <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block w-48 p-3 bg-slate-900 text-white text-[10px] rounded-xl shadow-2xl z-50">
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
    <div className="w-full max-w-4xl mx-auto">
      <div className="rounded-[2.5rem] border-4 border-slate-200 overflow-hidden bg-white shadow-2xl relative">
        {/* Browser Chrome */}
        <div className="bg-slate-50 p-4 border-b border-slate-200 flex items-center justify-between gap-4">
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-slate-200" />
            <div className="w-3 h-3 rounded-full bg-slate-200" />
            <div className="w-3 h-3 rounded-full bg-slate-200" />
          </div>
          <div className="flex items-center gap-2 bg-white rounded-xl px-4 py-2 flex-1 border border-slate-200 shadow-sm max-w-lg">
            <Globe className="h-4 w-4 text-slate-900" />
            <span className="text-xs text-slate-900 truncate font-black uppercase tracking-tight">https://news.example.com/daily-digest</span>
          </div>
          <div className="flex items-center gap-4">
            <Button 
              size="sm" 
              variant="default" 
              disabled={isScanning}
              onClick={handleScanPage}
              className="h-10 rounded-full gap-2 text-[10px] font-black uppercase tracking-widest bg-primary hover:bg-primary/90 shadow-md px-5"
            >
              {isScanning ? <Loader2 className="h-4 w-4 animate-spin" /> : <Zap className="h-4 w-4" />}
              Scan Page
            </Button>
            <div className="flex items-center gap-3 text-slate-900 border-l border-slate-200 pl-4">
              <RotateCcw className="h-5 w-5 cursor-pointer hover:text-primary transition-colors" />
              <Search className="h-5 w-5 cursor-pointer hover:text-primary transition-colors" />
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div 
          className="p-12 md:p-20 min-h-[650px] relative select-text" 
          onMouseUp={handleTextSelection}
          ref={containerRef}
        >
          <div className="max-w-3xl mx-auto space-y-10">
            <h1 className="text-5xl font-black font-headline text-slate-900 leading-[1.1] tracking-tight">
              The Future of Information: Deciphering Fact from Fiction
            </h1>
            <div className="flex items-center justify-between text-xs text-slate-900 font-black uppercase tracking-widest border-b border-slate-100 pb-6">
              <div className="flex items-center gap-4">
                <span>By Elena Vance</span>
                <span className="text-slate-200">•</span>
                <span>October 24, 2023</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-primary/5 text-primary">
                <Info className="h-3 w-3" />
                <span>Select text to audit</span>
              </div>
            </div>
            
            <div className="prose prose-slate max-w-none text-xl text-slate-900 font-bold leading-relaxed space-y-6">
              {renderHighlightedContent()}
            </div>
          </div>

          {/* Selection Tooltip */}
          {showTooltip && !result && (
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
                className="bg-primary hover:bg-primary/90 text-white rounded-full shadow-2xl gap-2 px-6 py-3 text-[11px] font-black uppercase tracking-widest border-2 border-white"
                onMouseDown={(e) => e.preventDefault()}
                onClick={verifyText}
              >
                <ShieldCheck className="h-4 w-4" />
                Verify Selection
              </Button>
              <div className="w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[8px] border-t-primary mx-auto" />
            </div>
          )}

          {/* Integrated Seamless Result Card */}
          {result && (
            <div className="absolute inset-0 z-50 bg-white/40 backdrop-blur-sm p-12 flex items-center justify-center animate-in fade-in zoom-in duration-300">
              <div className="relative w-full max-w-2xl">
                <VerdictCard 
                  verdict={result.verdict} 
                  context={result.suggestedCorrectionOrContext}
                  reasoning={result.reasoning}
                  sources={result.sources}
                  onClose={() => setResult(null)}
                  className="shadow-[0_20px_60px_rgba(0,0,0,0.1)] border-2 border-slate-200"
                />
              </div>
            </div>
          )}

          {/* Loading Overlay */}
          {isVerifying && (
            <div className="absolute inset-0 bg-white/90 backdrop-blur-md z-40 flex items-center justify-center p-6">
              <div className="bg-white p-12 rounded-[2rem] border-2 border-slate-100 shadow-2xl flex flex-col items-center gap-6 text-center">
                <div className="relative">
                  <div className="w-20 h-20 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                  <ShieldCheck className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-8 w-8 text-primary" />
                </div>
                <div>
                  <h3 className="font-black text-2xl uppercase tracking-tight text-slate-900">Verifying</h3>
                  <p className="text-sm text-slate-900 font-bold mt-2 uppercase tracking-widest">Scanning global records...</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Bottom Page Analysis (Visible only after scan) */}
      {scanResult && !result && (
        <div className="mt-8 animate-in slide-in-from-bottom-4 duration-500">
          <div className="misty-glass border-slate-200 rounded-[2rem] p-8 flex flex-col md:flex-row items-center gap-10">
            <div className="flex flex-col items-center gap-3 shrink-0">
               <div className="relative w-28 h-28">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="56" cy="56" r="48" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-slate-100" />
                  <circle 
                    cx="56" cy="56" r="48" stroke="currentColor" strokeWidth="8" fill="transparent" 
                    strokeDasharray={301.6} 
                    strokeDashoffset={301.6 - (301.6 * scanResult.overallHealth) / 100}
                    className={cn("transition-all duration-1000", scanResult.overallHealth > 70 ? "text-primary" : "text-amber-600")} 
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center text-2xl font-black text-slate-900">
                  {scanResult.overallHealth}%
                </div>
              </div>
              <p className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Trust Score</p>
            </div>
            
            <div className="flex-1 space-y-6">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-black uppercase tracking-widest text-slate-900">Page Audit Breakdown</h4>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-[10px] font-black uppercase text-rose-600"
                  onClick={() => setScanResult(null)}
                >
                  Dismiss Analysis
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {scanResult.claims.slice(0, 3).map((claim, i) => (
                  <div key={i} className="p-4 rounded-xl bg-white/50 border border-slate-100 space-y-2">
                    <div className="flex items-center gap-2">
                      {claim.verdict === 'Accurate' ? (
                        <CheckCircle2 className="h-3 w-3 text-primary" />
                      ) : (
                        <AlertCircle className="h-3 w-3 text-amber-600" />
                      )}
                      <span className="text-[9px] font-black uppercase text-slate-900">{claim.verdict}</span>
                    </div>
                    <p className="text-[11px] font-bold text-slate-900 line-clamp-2 italic">"{claim.claimText}"</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
