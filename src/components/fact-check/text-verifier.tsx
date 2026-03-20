"use client";

import React, { useState, useEffect, useRef } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ShieldCheck, Search, Loader2, RefreshCw, Zap, Award, Image as ImageIcon, X, Sparkles } from "lucide-react";
import { verifySelectedTextAccuracy } from "@/ai/flows/verify-selected-text-accuracy";
import { verifyImageAccuracy } from "@/ai/flows/verify-image-accuracy";
import { VerdictCard } from "./verdict-card";
import { useToast } from "@/hooks/use-toast";
import { useFirebase, useUser, initiateAnonymousSignIn, setDocumentNonBlocking } from "@/firebase";
import { doc } from "firebase/firestore";
import { cn } from "@/lib/utils";

const SAMPLES = [
  "The Great Wall of China is the only man-made structure visible from the Moon.",
  "Humans use only 10% of their brains for daily cognitive tasks.",
  "Goldfish have a three-second memory span."
];

export function TextVerifier() {
  const [inputText, setInputText] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [result, setResult] = useState<{
    verdict: 'Likely Accurate' | 'Needs Verification' | 'Potentially Misleading';
    suggestedCorrectionOrContext: string | null;
    reasoning: string;
    sources: { title: string; url: string }[];
    extractedText?: string;
  } | null>(null);
  
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
      toast({ variant: "destructive", title: "Forensic Error", description: "The atmosphere is unstable." });
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-12">
      <Card className="misty-glass border-slate-200/60 shadow-xl overflow-hidden group">
        <CardContent className="p-0">
          <div className="flex flex-col">
            <div className="p-8 space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Sparkles className="h-5 w-5 text-primary animate-pulse" />
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Forensic Input</span>
                </div>
                <div className="px-3 py-1 rounded-full bg-slate-50 border border-slate-100 text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                  Atmospheric Scan
                </div>
              </div>

              {selectedImage ? (
                <div className="relative w-fit mx-auto group">
                  <img src={selectedImage} alt="Source" className="max-h-[350px] rounded-2xl border border-slate-100 shadow-lg" />
                  <button onClick={() => setSelectedImage(null)} className="absolute -top-3 -right-3 bg-white text-slate-900 rounded-full p-2 shadow-xl hover:scale-110 transition-all border"><X className="h-4 w-4" /></button>
                </div>
              ) : (
                <Textarea
                  placeholder="Insert claim to clarify through the mist..."
                  className="min-h-[180px] text-2xl border-none focus-visible:ring-0 p-0 bg-transparent resize-none placeholder:text-slate-200 text-slate-900 font-headline font-bold leading-tight"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                />
              )}
            </div>
            
            <div className="bg-slate-50/50 border-t border-slate-100 p-6 flex items-center justify-between">
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
                  <Button variant="ghost" className="rounded-full gap-3 text-xs font-bold text-slate-500 hover:text-primary hover:bg-white border border-slate-200 px-6 h-12" onClick={() => fileInputRef.current?.click()}>
                    <ImageIcon className="h-4 w-4" /> Optical Scan
                  </Button>
                )}
                <div className="hidden lg:flex items-center gap-4">
                  {SAMPLES.map((s, i) => (
                    <button key={i} onClick={() => setInputText(s)} className="text-[10px] font-black text-slate-300 hover:text-primary transition-colors uppercase tracking-widest whitespace-nowrap">"{s.slice(0, 15)}..."</button>
                  ))}
                </div>
              </div>
              
              <Button 
                onClick={handleVerify} 
                disabled={isVerifying || (!inputText.trim() && !selectedImage)}
                className="bg-primary hover:bg-primary/90 text-white rounded-full px-10 h-12 font-black uppercase tracking-widest text-[10px] shadow-md transition-all hover:scale-105 active:scale-95"
              >
                {isVerifying ? <><Loader2 className="h-4 w-4 animate-spin mr-2" /> Clarifying...</> : <><ShieldCheck className="h-4 w-4 mr-2" /> Audit Claim</>}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {result && (
        <div className="grid md:grid-cols-3 gap-8 animate-in slide-in-from-bottom-12 duration-1000">
          <div className="md:col-span-2">
            <VerdictCard 
              verdict={result.verdict} 
              context={result.suggestedCorrectionOrContext}
              reasoning={result.reasoning}
              sources={result.sources}
              className="h-full misty-glass border-slate-200/60"
            />
          </div>
          
          <Card className="misty-glass border-slate-200/60 flex flex-col items-center justify-center p-10 text-center space-y-8 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
              <Zap className="h-24 w-24 text-primary" />
            </div>
            
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">Atmospheric Clarity</h4>
            
            <div className="relative">
              <div className="absolute inset-0 blur-3xl bg-primary/10 rounded-full animate-pulse" />
              <svg className="w-48 h-48 transform -rotate-90 relative">
                <circle cx="96" cy="96" r="84" stroke="currentColor" strokeWidth="6" fill="transparent" className="text-slate-100" />
                <circle
                  cx="96" cy="96" r="84" stroke="currentColor" strokeWidth="8" fill="transparent"
                  strokeDasharray={527.7}
                  strokeDashoffset={527.7 - (527.7 * (result.verdict === 'Likely Accurate' ? 95 : result.verdict === 'Potentially Misleading' ? 15 : 45)) / 100}
                  className={cn("transition-all duration-1000 ease-out", result.verdict === 'Likely Accurate' ? "text-primary" : "text-rose-500")}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-5xl font-black text-slate-900 tracking-tighter">
                  {result.verdict === 'Likely Accurate' ? '95' : result.verdict === 'Potentially Misleading' ? '15' : '45'}%
                </span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Reliability</span>
              </div>
            </div>
            
            <Button variant="outline" className="w-full rounded-full border-slate-200 text-slate-500 font-bold text-[10px] uppercase tracking-widest h-12 hover:bg-slate-50" onClick={() => {setInputText(""); setSelectedImage(null); setResult(null);}}>
              <RefreshCw className="h-4 w-4 mr-2" /> New Audit
            </Button>
          </Card>
        </div>
      )}
    </div>
  );
}
