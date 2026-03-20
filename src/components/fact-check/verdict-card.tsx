"use client";

import { CheckCircle2, AlertCircle, HelpCircle, ArrowRight, ExternalLink, Info, Copy, Check, Volume2, Loader2, Play, Pause, X, Search, Shield, Sparkles } from "lucide-react";
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
          borderColor: "border-primary/20",
          textColor: "text-primary",
          label: "Clarified Factual"
        };
      case 'Potentially Misleading':
        return {
          icon: <AlertCircle className="h-6 w-6 text-accent" />,
          bgColor: "bg-accent/5",
          borderColor: "border-accent/20",
          textColor: "text-accent",
          label: "Atmospheric Distortion"
        };
      default:
        return {
          icon: <HelpCircle className="h-6 w-6 text-white/60" />,
          bgColor: "bg-white/5",
          borderColor: "border-white/10",
          textColor: "text-white/80",
          label: "Awaiting Proof"
        };
    }
  };

  const styles = getStyles();

  const handleCopy = () => {
    navigator.clipboard.writeText(`Verdict: ${verdict}\nAnalysis: ${reasoning}`);
    setCopied(true);
    toast({ title: "Audit Copied", description: "Verification data secured in clipboard." });
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
      toast({ variant: "destructive", title: "Audio Error", description: "Could not narrate the truth." });
    } finally {
      setIsGeneratingAudio(false);
    }
  };

  return (
    <Card className={cn("overflow-hidden misty-glass border-white/10", className)}>
      <CardHeader className={cn("py-4 px-8 flex flex-row items-center justify-between", styles.bgColor)}>
        <div className="flex items-center gap-3">
          {styles.icon}
          <CardTitle className={cn("text-lg font-bold font-headline uppercase tracking-tighter", styles.textColor)}>
            {styles.label}
          </CardTitle>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="h-8 rounded-full hover:bg-white/5 text-[9px] font-black uppercase tracking-widest text-white/40" onClick={handleAudio} disabled={isGeneratingAudio}>
            {isGeneratingAudio ? <Loader2 className="h-3 w-3 animate-spin" /> : isPlaying ? 'Pause' : 'Listen'}
          </Button>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-full hover:bg-white/5" onClick={handleCopy}>
            {copied ? <Check className="h-4 w-4 text-primary" /> : <Copy className="h-4 w-4 text-white/30" />}
          </Button>
          {onClose && <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-full hover:bg-white/5" onClick={onClose}><X className="h-5 w-5 text-white/30" /></Button>}
        </div>
      </CardHeader>
      
      {audioUrl && <audio ref={audioRef} src={audioUrl} onEnded={() => setIsPlaying(false)} className="hidden" />}

      <CardContent className="p-8 space-y-8">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Sparkles className="h-3 w-3 text-primary" />
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30">Forensic Verdict</p>
          </div>
          <p className="text-xl leading-snug font-bold text-white/90">{context || "Atmosphere matches established factual indices."}</p>
        </div>

        {reasoning && (
          <div className="p-6 rounded-2xl bg-white/5 border border-white/5 space-y-4">
            <p className="text-[9px] font-black uppercase tracking-[0.4em] text-primary">Deep Scan Analysis</p>
            <p className="text-sm text-white/60 leading-relaxed italic">{reasoning}</p>
          </div>
        )}

        {sources && sources.length > 0 && (
          <div className="space-y-4">
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30">Primary Nodes</p>
            <div className="grid gap-3">
              {sources.map((s, i) => (
                <a key={i} href={s.url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-3 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/5 transition-colors group">
                  <div className="flex items-center gap-3 min-w-0">
                    <ExternalLink className="h-3 w-3 text-white/20 group-hover:text-primary transition-colors" />
                    <span className="text-[11px] font-bold text-white/70 truncate">{s.title}</span>
                  </div>
                  <Badge variant="outline" className="text-[8px] font-black uppercase tracking-tight h-5 px-2 border-white/10 text-white/40">
                    {s.reliability || 'Scan'}
                  </Badge>
                </a>
              ))}
            </div>
          </div>
        )}

        {recommendedSearchQuery && (
          <Button variant="outline" className="w-full h-12 rounded-2xl border-dashed border-2 border-white/10 hover:border-primary/40 hover:bg-primary/5 group" onClick={() => window.open(`https://www.google.com/search?q=${encodeURIComponent(recommendedSearchQuery)}`, '_blank')}>
            <Search className="h-4 w-4 mr-2 text-primary group-hover:scale-110 transition-transform" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/60">Research Deeper</span>
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
