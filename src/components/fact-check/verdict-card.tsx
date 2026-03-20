"use client";

import { CheckCircle2, AlertCircle, HelpCircle, ExternalLink, Copy, Check, Volume2, Loader2, X, Search, Shield } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import { generateTruthAudio } from "@/ai/flows/text-to-speech-flow";
import { Badge } from "@/components/ui/badge";

interface Source {
  title: string;
  url: string;
  reliability?: 'High' | 'Medium' | 'Mixed';
}

interface VerdictCardProps {
  verdict: 'Likely Accurate' | 'Needs Verification' | 'Potentially Misleading';
  context: string | null;
  reasoning?: string;
  sources?: Source[];
  recommendedSearchQuery?: string;
  className?: string;
  onClose?: () => void;
}

export function VerdictCard({ verdict, context, reasoning, sources, recommendedSearchQuery, className, onClose }: VerdictCardProps) {
  const [copied, setCopied] = useState(false);
  const [isGeneratingAudio, setIsGeneratingAudio] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { toast } = useToast();

  const getStyles = () => {
    switch (verdict) {
      case 'Likely Accurate':
        return {
          icon: <CheckCircle2 className="h-6 w-6 text-primary" />,
          bgColor: "bg-primary/5",
          textColor: "text-primary",
          label: "Likely Accurate"
        };
      case 'Potentially Misleading':
        return {
          icon: <AlertCircle className="h-6 w-6 text-rose-500" />,
          bgColor: "bg-rose-50",
          textColor: "text-rose-600",
          label: "Potentially Misleading"
        };
      default:
        return {
          icon: <HelpCircle className="h-6 w-6 text-slate-400" />,
          bgColor: "bg-slate-50",
          textColor: "text-slate-600",
          label: "Needs Verification"
        };
    }
  };

  const styles = getStyles();

  const handleCopy = () => {
    navigator.clipboard.writeText(`Verdict: ${verdict}\nAnalysis: ${reasoning}`);
    setCopied(true);
    toast({ title: "Copied", description: "Verification saved to clipboard." });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAudio = async () => {
    if (audioUrl) {
      if (isPlaying) audioRef.current?.pause(); else audioRef.current?.play();
      setIsPlaying(!isPlaying);
      return;
    }
    setIsGeneratingAudio(true);
    try {
      const { media } = await generateTruthAudio({ text: reasoning || context || "" });
      setAudioUrl(media);
      setIsPlaying(true);
    } catch {
      toast({ variant: "destructive", title: "Error", description: "Could not generate audio." });
    } finally {
      setIsGeneratingAudio(false);
    }
  };

  return (
    <Card className={cn("overflow-hidden misty-glass border-slate-200/60", className)}>
      <CardHeader className={cn("py-4 px-8 flex flex-row items-center justify-between", styles.bgColor)}>
        <div className="flex items-center gap-3">
          {styles.icon}
          <CardTitle className={cn("text-lg font-bold tracking-tight", styles.textColor)}>
            {styles.label}
          </CardTitle>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="h-8 rounded-full text-[10px] font-bold uppercase tracking-wider text-slate-500" onClick={handleAudio} disabled={isGeneratingAudio}>
            {isGeneratingAudio ? <Loader2 className="h-3 w-3 animate-spin" /> : isPlaying ? 'Pause' : 'Listen'}
          </Button>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-full" onClick={handleCopy}>
            {copied ? <Check className="h-4 w-4 text-primary" /> : <Copy className="h-4 w-4 text-slate-400" />}
          </Button>
          {onClose && <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-full" onClick={onClose}><X className="h-5 w-5 text-slate-400" /></Button>}
        </div>
      </CardHeader>
      
      {audioUrl && <audio ref={audioRef} src={audioUrl} onEnded={() => setIsPlaying(false)} className="hidden" />}

      <CardContent className="p-8 space-y-8">
        <div className="space-y-3">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Analysis Summary</p>
          <p className="text-xl leading-snug font-bold text-slate-900">{context || "This claim aligns with verified factual records."}</p>
        </div>

        {reasoning && (
          <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
            <p className="text-[9px] font-black uppercase tracking-widest text-primary">Detailed Analysis</p>
            <p className="text-sm text-slate-600 leading-relaxed font-medium italic">{reasoning}</p>
          </div>
        )}

        {sources && sources.length > 0 && (
          <div className="space-y-4">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Sources & Evidence</p>
            <div className="grid gap-3">
              {sources.map((s, i) => (
                <a key={i} href={s.url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-3 rounded-xl border border-slate-100 bg-white hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-3 min-w-0">
                    <ExternalLink className="h-3 w-3 text-primary" />
                    <span className="text-[11px] font-bold text-slate-700 truncate">{s.title}</span>
                  </div>
                  <Badge variant="outline" className="text-[8px] font-bold h-5 px-2">
                    {s.reliability || 'Source'}
                  </Badge>
                </a>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
