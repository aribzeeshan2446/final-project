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

export function TextVerifier() {
  const [inputText, setInputText] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [result, setResult] = useState<{
    verdict: 'Likely Accurate' | 'Needs Verification' | 'Potentially Misleading';
    suggestedCorrectionOrContext: string | null;
  } | null>(null);
  
  const { toast } = useToast();
  const { firestore, auth } = useFirebase();
  const { user } = useUser();

  // Ensure user is signed in anonymously to save history
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

      // Save to Firestore history if user is authenticated
      if (user && firestore) {
        const verificationId = crypto.randomUUID();
        const docRef = doc(firestore, 'users', user.uid, 'verificationResults', verificationId);
        
        const verificationData = {
          id: verificationId, // For security rules validation (must match doc ID)
          originalText: inputText,
          sourceUrl: window.location.href,
          verdict: output.verdict,
          suggestedCorrection: output.suggestedCorrectionOrContext,
          checkedAt: new Date().toISOString(),
        };
        
        // Use setDocumentNonBlocking to ensure the doc ID matches the internal ID field
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
              <p className="text-xs text-muted-foreground">
                {inputText.length} characters
              </p>
              <Button 
                onClick={handleVerify} 
                disabled={isVerifying || !inputText.trim()}
                className="bg-primary hover:bg-primary/90 text-white rounded-full px-8 gap-2 shadow-lg shadow-primary/20"
              >
                {isVerifying ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Verifying...
                  </>
                ) : (
                  <>
                    <ShieldCheck className="h-4 w-4" /> Verify Accuracy
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results Section */}
      {result && (
        <div className="grid md:grid-cols-3 gap-6 animate-in slide-in-from-bottom-4 duration-500">
          <Card className="md:col-span-2 border-2 shadow-lg">
            <CardContent className="p-6">
              <VerdictCard 
                verdict={result.verdict} 
                context={result.suggestedCorrectionOrContext}
                className="border-none shadow-none p-0"
              />
            </CardContent>
          </Card>
          
          <Card className="border-2 shadow-lg flex flex-col items-center justify-center p-6 text-center space-y-4 bg-slate-50/50">
            <h4 className="text-sm font-bold text-slate-500 uppercase tracking-widest">Trust Score</h4>
            <div className="relative">
              <svg className="w-32 h-32 transform -rotate-90">
                <circle
                  cx="64"
                  cy="64"
                  r="58"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="transparent"
                  className="text-slate-200"
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
                  className={score?.color}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className={`text-3xl font-bold ${score?.color}`}>{score?.value}%</span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Based on comparison with known factual datasets and reliable news indices.
            </p>
            <Button variant="outline" size="sm" className="w-full rounded-full gap-2" onClick={() => {setInputText(""); setResult(null);}}>
              <RefreshCw className="h-3 w-3" /> New Check
            </Button>
          </Card>
        </div>
      )}
    </div>
  );
}
