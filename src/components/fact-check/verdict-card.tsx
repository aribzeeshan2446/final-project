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
          textColor: "text-slate-900",
          label: "Likely Accurate"
        };
      case 'Potentially Misleading':
        return {
          icon: <AlertCircle className="h-6 w-6 text-rose-600" />,
          bgColor: "bg-rose-50",
          textColor: "text-slate-900",
          label: "Potentially Misleading"
        };
      default:
        return {
          icon: <HelpCircle className="h-6 w-6 text-amber-600" />,
          bgColor: "bg-amber-50",
          textColor: "text-slate-900",
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
    <Card className={cn("overflow-hidden misty-glass border-slate-200 rounded-[2rem]", className)}>
      <CardHeader className={cn("py-6 px-8 flex flex-row items-center justify-between border-b border-slate-100", styles.bgColor)}>
        <div className="flex items-center gap-4">
          <div className="bg-white p-2 rounded-xl shadow-sm">
            {styles.icon}
          </div>
          <CardTitle className={cn("text-xl font-black tracking-tight uppercase", styles.textColor)}>
            {styles.label}
          </CardTitle>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" className="h-10 rounded-full text-[10px] font-black uppercase tracking-widest text-slate-900 hover:bg-white/50 px-4" onClick={handleAudio} disabled={isGeneratingAudio}>
            {isGeneratingAudio ? <Loader2 className="h-4 w-4 animate-spin" /> : isPlaying ? 'Pause' : 'Listen Report'}
          </Button>
          <Button variant="ghost" size="sm" className="h-10 w-10 p-0 rounded-full hover:bg-white/50" onClick={handleCopy}>
            {copied ? <Check className="h-5 w-5 text-primary" /> : <Copy className="h-5 w-5 text-slate-900" />}
          </Button>
          {onClose && (
            <Button variant="ghost" size="sm" className="h-10 w-10 p-0 rounded-full hover:bg-white/50 ml-2" onClick={onClose}>
              <X className="h-6 w-6 text-slate-900" />
            </Button>
          )}
        </div>
      </CardHeader>
      
      {audioUrl && <audio ref={audioRef} src={audioUrl} onEnded={() => setIsPlaying(false)} className="hidden" />}

      <CardContent className="p-10 space-y-10">
        <div className="space-y-4">
          <p className="text-[11px] font-black uppercase tracking-[0.3em] text-primary">Analysis Summary</p>
          <p className="text-2xl leading-[1.2] font-black text-slate-900">{context || "This claim is supported by authoritative factual records."}</p>
        </div>

        {reasoning && (
          <div className="p-8 rounded-3xl bg-slate-50 border border-slate-100 space-y-3 shadow-inner">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-900">Research Insight</p>
            <p className="text-sm text-slate-900 leading-relaxed font-bold italic">{reasoning}</p>
          </div>
        )}

        {sources && sources.length > 0 && (
          <div className="space-y-6">
            <p className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-900">Verified Evidence</p>
            <div className="grid gap-4">
              {sources.map((s, i) => (
                <a key={i} href={s.url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-4 rounded-2xl border border-slate-100 bg-white hover:bg-slate-50 transition-all hover:scale-[1.01] shadow-sm">
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="bg-primary/10 p-2 rounded-lg">
                      <ExternalLink className="h-4 w-4 text-primary" />
                    </div>
                    <span className="text-xs font-black text-slate-900 truncate uppercase tracking-tight">{s.title}</span>
                  </div>
                  <Badge variant="outline" className="text-[9px] font-black h-6 px-3 border-slate-200 text-slate-900 bg-slate-50">
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
