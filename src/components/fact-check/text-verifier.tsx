"use client";

import React, { useState, useEffect, useRef } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck, Loader2, RefreshCcw, Image as ImageIcon, X, Zap, ArrowDownToDot, Fingerprint, ExternalLink } from "lucide-react";
import { verifySelectedTextAccuracy } from "@/ai/flows/verify-selected-text-accuracy";
import { verifyImageAccuracy } from "@/ai/flows/verify-image-accuracy";
import { initiateDeepAnalysis, type DeepAnalysisOutput } from "@/ai/flows/deep-analysis-flow";
import { VerdictCard } from "./verdict-card";
import { useToast } from "@/hooks/use-toast";
import { useFirebase, useUser, initiateAnonymousSignIn, setDocumentNonBlocking } from "@/firebase";
import { doc } from "firebase/firestore";
import { cn } from "@/lib/utils";

const SAMPLES = [
  "The Great Wall of China is the only structure visible from the Moon.",
  "Humans use only 10% of their brains.",
  "Goldfish have a three-second memory span."
];

export function TextVerifier() {
  const [inputText, setInputText] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isDeepVerifying, setIsDeepVerifying] = useState(false);
  const [result, setResult] = useState<{
    verdict: 'Likely Accurate' | 'Needs Verification' | 'Potentially Misleading';
    suggestedCorrectionOrContext: string | null;
    reasoning: string;
    sources: { title: string; url: string; reliability?: 'High' | 'Medium' | 'Mixed' }[];
    extractedText?: string;
  } | null>(null);
  const [deepResult, setDeepResult] = useState<DeepAnalysisOutput | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const { firestore, auth } = useFirebase();
  const { user } = useUser();

  useEffect(() => {
    if (!user && auth) {
      initiateAnonymousSignIn(auth);
    }
  }, [user, auth]);

  const handleVerify = async () => {
    if (!inputText.trim() && !selectedImage) return;
    setIsVerifying(true);
    setResult(null);
    setDeepResult(null);

    try {
      let output;
      let originalTextForHistory = inputText;

      if (selectedImage) {
        const imageOutput = await verifyImageAccuracy({ imageDataUri: selectedImage });
        output = imageOutput;
        originalTextForHistory = imageOutput.extractedText;
      } else {
        output = await verifySelectedTextAccuracy({ selectedText: inputText });
      }

      setResult(output);

      if (user && firestore) {
        const verificationId = crypto.randomUUID();
        const docRef = doc(firestore, 'users', user.uid, 'verificationResults', verificationId);
        setDocumentNonBlocking(docRef, {
          id: verificationId,
          originalText: originalTextForHistory,
          verdict: output.verdict,
          suggestedCorrection: output.suggestedCorrectionOrContext,
          reasoning: output.reasoning,
          sources: output.sources,
          checkedAt: new Date().toISOString(),
        }, { merge: true });
      }
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: "Could not verify claim." });
    } finally {
      setIsVerifying(false);
    }
  };

  const handleDeepVerify = async () => {
    if (!result || (!inputText && !result.extractedText)) return;
    setIsDeepVerifying(true);

    try {
      const output = await initiateDeepAnalysis({
        originalText: result.extractedText || inputText,
        initialVerdict: result.verdict
      });
      setDeepResult(output);
    } catch (error) {
      toast({ variant: "destructive", title: "Tier 2 Error", description: "Could not complete deep analysis." });
    } finally {
      setIsDeepVerifying(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-12">
      <Card className="misty-glass border-slate-300 shadow-2xl overflow-hidden rounded-[2.5rem]">
        <CardContent className="p-0">
          <div className="flex flex-col">
            <div className="p-10 space-y-6 bg-slate-200/40">
              <div className="flex items-center justify-between border-b border-slate-300 pb-5">
                <div className="flex items-center gap-3">
                  <Fingerprint className="h-4 w-4 text-primary" />
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-900">Verification Input</span>
                </div>
                <span className="px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-[9px] font-black text-primary uppercase tracking-widest">
                  Active Intelligence
                </span>
              </div>

              {selectedImage ? (
                <div className="relative w-fit mx-auto group">
                  <img src={selectedImage} alt="Source" className="max-h-[350px] rounded-2xl border border-slate-200 shadow-xl" />
                  <button onClick={() => setSelectedImage(null)} className="absolute -top-3 -right-3 bg-white text-slate-900 rounded-full p-2.5 shadow-2xl hover:scale-110 border border-slate-200"><X className="h-4 w-4" /></button>
                </div>
              ) : (
                <Textarea
                  placeholder="Paste a claim or statement here to fact-check..."
                  className="min-h-[220px] text-3xl border-2 border-slate-300 rounded-2xl focus-visible:ring-2 focus-visible:ring-primary/20 px-12 py-10 bg-white/70 resize-none placeholder:text-slate-500 text-slate-900 font-black tracking-tight leading-tight transition-all duration-300"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                />
              )}
            </div>
            
            <div className="bg-slate-50/90 border-t border-slate-200 p-8 flex items-center justify-between">
              <div className="flex items-center gap-6">
                <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onload = (ev) => setSelectedImage(ev.target?.result as string);
                    reader.readAsDataURL(file);
                  }
                }} />
                {!selectedImage && (
                  <Button variant="outline" className="rounded-full gap-2 text-[10px] font-black text-slate-900 bg-white border-slate-200 hover:bg-slate-50 shadow-sm uppercase tracking-widest" onClick={() => fileInputRef.current?.click()}>
                    <ImageIcon className="h-4 w-4" /> Upload Artifact
                  </Button>
                )}
                <div className="hidden lg:flex items-center gap-4">
                  {SAMPLES.map((s, i) => (
                    <button key={i} onClick={() => setInputText(s)} className="text-[10px] font-black text-slate-900 hover:text-primary transition-colors uppercase tracking-widest opacity-40 hover:opacity-100">Sample {i+1}</button>
                  ))}
                </div>
              </div>
              
              <Button 
                onClick={handleVerify} 
                disabled={isVerifying || (!inputText.trim() && !selectedImage)}
                className="bg-primary hover:bg-primary/95 text-white rounded-full px-12 h-14 font-black shadow-lg uppercase tracking-widest text-xs transition-all active:scale-95"
              >
                {isVerifying ? <><Loader2 className="h-4 w-4 animate-spin mr-3" /> Analyzing</> : <><ShieldCheck className="h-4 w-4 mr-3" /> Begin Verification</>}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {result && (
        <div className="space-y-8 animate-in slide-in-from-bottom-8 duration-700">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <VerdictCard 
                verdict={result.verdict} 
                context={result.suggestedCorrectionOrContext}
                reasoning={result.reasoning}
                sources={result.sources}
                className="h-full misty-glass border-slate-300"
              />
            </div>
            
            <Card className="misty-glass flex flex-col items-center justify-center p-12 text-center space-y-10 rounded-[2.5rem] border-slate-300 shadow-2xl">
              <div className="space-y-2">
                <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-[0.2em]">Confidence Index</h4>
                <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Tier 1 Analysis</p>
              </div>
              
              <div className="relative">
                <svg className="w-48 h-48 transform -rotate-90 relative">
                  <circle cx="96" cy="96" r="86" stroke="currentColor" strokeWidth="6" fill="transparent" className="text-slate-100" />
                  <circle
                    cx="96" cy="96" r="86" stroke="currentColor" strokeWidth="8" fill="transparent"
                    strokeDasharray={540}
                    strokeDashoffset={540 - (540 * (result.verdict === 'Likely Accurate' ? 95 : result.verdict === 'Potentially Misleading' ? 15 : 45)) / 100}
                    className={cn("transition-all duration-1000", result.verdict === 'Likely Accurate' ? "text-primary" : "text-rose-600")}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-5xl font-black text-slate-900">
                    {result.verdict === 'Likely Accurate' ? '95' : result.verdict === 'Potentially Misleading' ? '15' : '45'}%
                  </span>
                  <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest mt-2">Reliability</span>
                </div>
              </div>

              {!deepResult && !isDeepVerifying && (
                <Button 
                  onClick={handleDeepVerify}
                  variant="outline"
                  className="w-full rounded-full font-black h-14 border-primary/20 bg-primary/5 text-primary hover:bg-primary/10 uppercase tracking-widest text-[10px] gap-2"
                >
                  <Zap className="h-4 w-4" /> 2nd Tier Deep Scan
                </Button>
              )}

              {isDeepVerifying && (
                <div className="w-full py-4 flex flex-col items-center gap-3">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Investigating Nuances...</span>
                </div>
              )}
              
              <Button variant="ghost" className="text-[9px] font-black text-slate-400 uppercase tracking-widest hover:text-slate-900" onClick={() => {setInputText(""); setSelectedImage(null); setResult(null); setDeepResult(null);}}>
                <RefreshCcw className="h-3 w-3 mr-2" /> Reset Session
              </Button>
            </Card>
          </div>

          {deepResult && (
            <div className="animate-in fade-in slide-in-from-top-4 duration-1000">
              <Card className="rounded-[2.5rem] border-2 border-primary/30 bg-primary/5 p-12 space-y-8 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-5">
                  <ShieldCheck className="h-48 w-48 text-primary" />
                </div>
                
                <div className="flex items-center gap-4 border-b border-primary/10 pb-6">
                  <div className="bg-primary p-2.5 rounded-2xl">
                    <Zap className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h5 className="text-xl font-black text-slate-900 uppercase tracking-tight">2nd Tier Deep Analysis</h5>
                    <p className="text-[10px] font-black text-primary uppercase tracking-widest">Exhaustive Cross-Reference Complete</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-12">
                  <div className="space-y-4">
                    <p className="text-[11px] font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                      <ArrowDownToDot className="h-4 w-4 text-primary" /> Semantic Nuance
                    </p>
                    <p className="text-sm text-slate-900 font-bold leading-relaxed italic bg-white/50 p-6 rounded-3xl border border-white/50 shadow-sm">
                      {deepResult.nuanceAnalysis}
                    </p>
                  </div>

                  <div className="space-y-6">
                    <p className="text-[11px] font-black text-slate-900 uppercase tracking-widest">Authoritative Cross-References</p>
                    <div className="space-y-3">
                      {deepResult.crossReferences.map((ref, idx) => (
                        <a 
                          key={idx} 
                          href={ref.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex flex-col p-4 rounded-2xl bg-white border border-primary/10 hover:border-primary/30 transition-all group shadow-sm"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-[11px] font-black text-slate-900 uppercase tracking-tight group-hover:text-primary transition-colors">{ref.title}</span>
                            <ExternalLink className="h-3 w-3 text-slate-300 group-hover:text-primary transition-colors" />
                          </div>
                          <p className="text-[10px] text-slate-500 font-bold leading-snug">{ref.context}</p>
                        </a>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-8 flex items-center justify-between border-t border-primary/10">
                  <div className="flex items-center gap-3">
                    <Badge className="bg-primary/10 text-primary border-primary/20 text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full">
                      Final Chain Confidence: {deepResult.confidenceScore}%
                    </Badge>
                  </div>
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Intelligence Archive ID: {crypto.randomUUID().slice(0, 8)}</p>
                </div>
              </Card>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
