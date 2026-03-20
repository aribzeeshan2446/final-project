"use client";

import React, { useState, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ShieldCheck, Search, Loader2, RefreshCw } from "lucide-react";
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
      case 'Likely Accurate': return { value: 95, color: 'text-primary' };
      case 'Potentially Misleading': return { value: 15, color: 'text-accent' };
      default: return { value: 45, color: 'text-amber-500' };
    }
  };

  const score = result ? getScore(result.verdict) : null;

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      <Card className="border-2 shadow-xl overflow-hidden bg-white">
        <CardContent className="p-0">
          <div className="flex flex-col">
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">
                  Paste Text to Fact-Check
                </label>
                <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
                  <Search className="h-3 w-3" />
                  <span>AI-Powered Scan</span>
                </div>
              </div>
              <Textarea
                placeholder="Example: The Eiffel Tower was built in 1950 by the Romans..."
                className="min-h-[160px] text-lg border-none focus-visible:ring-0 p-0 resize-none placeholder:text-slate-300"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
              />
            </div>
            <div className="bg-slate-50 p-4 border-t flex items-center justify-between">
              <div className="flex items-center gap-4">
                <p className="text-[10px] text-muted-foreground font-medium shrink-0">
                  {inputText.length} chars
                </p>
                <div className="hidden sm:flex items-center gap-3 border-l border-slate-200 pl-4">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-tight">Try:</span>
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
                  className="bg-primary hover:bg-primary/90 text-white rounded-full px-6 gap-2 shadow-lg shadow-primary/20 h-9 text-xs font-bold"
                >
                  {isVerifying ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin" /> Verifying...
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="h-3.5 w-3.5" /> Verify Accuracy
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {result && (
        <div className="grid md:grid-cols-3 gap-6 animate-in slide-in-from-bottom-4 duration-500">
          <Card className="md:col-span-2 border shadow-lg overflow-hidden">
            <CardContent className="p-0">
              <VerdictCard 
                verdict={result.verdict} 
                context={result.suggestedCorrectionOrContext}
                reasoning={result.reasoning}
                sources={result.sources}
                className="border-none shadow-none rounded-none"
              />
            </CardContent>
          </Card>
          
          <Card className="border shadow-lg flex flex-col items-center justify-center p-6 text-center space-y-4 bg-white">
            <h4 className="text-sm font-bold text-slate-500 uppercase tracking-widest">Trust Index</h4>
            <div className="relative">
              <svg className="w-32 h-32 transform -rotate-90">
                <circle
                  cx="64"
                  cy="64"
                  r="58"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="transparent"
                  className="text-slate-100"
                />
                <circle
                  cx="64"
                  cy="64"
                  r="58"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="transparent"
                  strokeDasharray={364.4}
                  strokeDashoffset={364.4 - (364.4 * (score?.value || 0)) / 100}
                  className={cn("transition-all duration-1000", score?.color)}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className={cn("text-3xl font-black", score?.color)}>{score?.value}%</span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed px-4">
              Factual confidence level based on current AI indexing.
            </p>
            <div className="pt-4 w-full">
              <Button variant="outline" size="sm" className="w-full rounded-full gap-2 border-slate-200" onClick={() => {setInputText(""); setResult(null);}}>
                <RefreshCw className="h-3 w-3" /> New Verification
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
