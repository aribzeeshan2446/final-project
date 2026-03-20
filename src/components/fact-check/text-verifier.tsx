
"use client";

import React, { useState, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ShieldCheck, Search, Loader2, RefreshCw, Zap, Award } from "lucide-react";
import { verifySelectedTextAccuracy } from "@/ai/flows/verify-selected-text-accuracy";
import { VerdictCard } from "./verdict-card";
import { useToast } from "@/hooks/use-toast";
import { useFirebase, useUser, initiateAnonymousSignIn, setDocumentNonBlocking } from "@/firebase";
import { doc } from "firebase/firestore";
import { cn } from "@/lib/utils";

const SAMPLES = [
  "The Great Wall of China is the only man-made structure visible from the Moon.",
  "Humans use only 10% of their brains for daily cognitive tasks.",
  "Goldfish have a three-second memory span.",
  "Mount Everest is the closest point on Earth to space."
];

export function TextVerifier() {
  const [inputText, setInputText] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [result, setResult] = useState<{
    verdict: 'Likely Accurate' | 'Needs Verification' | 'Potentially Misleading';
    suggestedCorrectionOrContext: string | null;
    reasoning: string;
    sources: { title: string; url: string }[];
  } | null>(null);
  
  const { toast } = useToast();
  const { firestore, auth } = useFirebase();
  const { user } = useUser();

  useEffect(() => {
    if (!user && auth) {
      initiateAnonymousSignIn(auth);
    }
  }, [user, auth]);

  const handleVerify = async () => {
    if (!inputText.trim()) return;
    if (inputText.length < 10) {
      toast({
        title: "Text too short",
        description: "Please provide a more substantial claim to verify.",
      });
      return;
    }

    setIsVerifying(true);
    setResult(null);

    try {
      const output = await verifySelectedTextAccuracy({ selectedText: inputText });
      setResult(output);

      if (user && firestore) {
        const verificationId = crypto.randomUUID();
        const docRef = doc(firestore, 'users', user.uid, 'verificationResults', verificationId);
        
        const verificationData = {
          id: verificationId,
          originalText: inputText,
          sourceUrl: window.location.href,
          verdict: output.verdict,
          suggestedCorrection: output.suggestedCorrectionOrContext,
          reasoning: output.reasoning,
          sources: output.sources,
          checkedAt: new Date().toISOString(),
        };
        
        setDocumentNonBlocking(docRef, verificationData, { merge: true });
      }

    } catch (error) {
      console.error("Verification failed", error);
      toast({
        variant: "destructive",
        title: "Verification Error",
        description: "Something went wrong. Please check your connection and try again.",
      });
    } finally {
      setIsVerifying(false);
    }
  };

  const getScore = (verdict: string) => {
    switch (verdict) {
      case 'Likely Accurate': return { value: 95, color: 'text-primary', label: 'High Confidence' };
      case 'Potentially Misleading': return { value: 15, color: 'text-accent', label: 'High Risk' };
      default: return { value: 45, color: 'text-amber-500', label: 'Needs Proof' };
    }
  };

  const score = result ? getScore(result.verdict) : null;

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      <Card className="border-2 shadow-xl overflow-hidden bg-white group hover:border-primary/20 transition-all duration-500">
        <CardContent className="p-0">
          <div className="flex flex-col">
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
                  <Award className="h-4 w-4 text-primary" />
                  Paste Text to Fact-Check
                </label>
                <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium bg-slate-50 px-3 py-1 rounded-full">
                  <Zap className="h-3 w-3 text-primary" />
                  <span>Real-time AI Verification</span>
                </div>
              </div>
              <Textarea
                placeholder="Example: The Eiffel Tower was built in 1950 by the Romans..."
                className="min-h-[160px] text-lg border-none focus-visible:ring-0 p-0 resize-none placeholder:text-slate-300 font-medium"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
              />
            </div>
            <div className="bg-slate-50 p-4 border-t flex items-center justify-between">
              <div className="flex items-center gap-4">
                <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest bg-white px-2 py-1 rounded border">
                  {inputText.length} CHARS
                </p>
                <div className="hidden sm:flex items-center gap-3 border-l border-slate-200 pl-4">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Try Sample:</span>
                  {SAMPLES.slice(0, 2).map((sample, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        setInputText(sample);
                        setResult(null);
                      }}
                      className="text-[10px] font-bold text-primary/70 hover:text-primary hover:underline transition-colors whitespace-nowrap"
                    >
                      "{sample.split(' ').slice(0, 3).join(' ')}..."
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-2">
                {inputText && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="rounded-full h-8 w-8 p-0"
                    onClick={() => {
                      setInputText("");
                      setResult(null);
                    }}
                  >
                    <RefreshCw className="h-3.5 w-3.5 text-slate-400" />
                  </Button>
                )}
                <Button 
                  onClick={handleVerify} 
                  disabled={isVerifying || !inputText.trim()}
                  className="bg-primary hover:bg-primary/90 text-white rounded-full px-8 gap-2 shadow-lg shadow-primary/20 h-10 text-xs font-bold transition-all hover:scale-105 active:scale-95"
                >
                  {isVerifying ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" /> Analyzing Claim...
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="h-4 w-4" /> Verify Accuracy
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {result && (
        <div className="grid md:grid-cols-3 gap-6 animate-in slide-in-from-bottom-8 duration-700">
          <div className="md:col-span-2">
            <VerdictCard 
              verdict={result.verdict} 
              context={result.suggestedCorrectionOrContext}
              reasoning={result.reasoning}
              sources={result.sources}
              className="h-full"
            />
          </div>
          
          <Card className="border shadow-lg flex flex-col items-center justify-center p-8 text-center space-y-6 bg-white relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-5">
              <Zap className="h-24 w-24 text-primary" />
            </div>
            
            <h4 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Confidence Index</h4>
            
            <div className="relative group">
              <svg className="w-40 h-40 transform -rotate-90">
                <circle
                  cx="80"
                  cy="80"
                  r="72"
                  stroke="currentColor"
                  strokeWidth="10"
                  fill="transparent"
                  className="text-slate-50"
                />
                <circle
                  cx="80"
                  cy="80"
                  r="72"
                  stroke="currentColor"
                  strokeWidth="10"
                  fill="transparent"
                  strokeDasharray={452.4}
                  strokeDashoffset={452.4 - (452.4 * (score?.value || 0)) / 100}
                  className={cn("transition-all duration-1000 ease-out", score?.color)}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className={cn("text-4xl font-black tracking-tighter", score?.color)}>{score?.value}%</span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{score?.label}</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground leading-relaxed font-medium italic">
                AI verification complete. This index reflects the alignment of the claim with verified historical and scientific databases.
              </p>
            </div>
            
            <div className="pt-2 w-full">
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full rounded-full gap-2 border-slate-200 font-bold text-[10px] uppercase tracking-widest h-10 hover:bg-slate-50" 
                onClick={() => {setInputText(""); setResult(null);}}
              >
                <RefreshCw className="h-3 w-3" /> New Verification
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
