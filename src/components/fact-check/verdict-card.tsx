
"use client";

import { CheckCircle2, AlertCircle, HelpCircle, ArrowRight, ExternalLink, Info, Copy, Check, Volume2, Loader2, Play, Pause, X, Search, Shield } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState, useRef, useEffect } from "react";
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
          icon: <CheckCircle2 className="h-5 w-5 text-primary" />,
          bgColor: "bg-primary/5",
          borderColor: "border-primary/20",
          textColor: "text-primary",
          label: "Likely Accurate"
        };
      case 'Potentially Misleading':
        return {
          icon: <AlertCircle className="h-5 w-5 text-accent" />,
          bgColor: "bg-accent/5",
          borderColor: "border-accent/20",
          textColor: "text-accent",
          label: "Potentially Misleading"
        };
      default:
        return {
          icon: <HelpCircle className="h-5 w-5 text-amber-500" />,
          bgColor: "bg-amber-500/5",
          borderColor: "border-amber-500/20",
          textColor: "text-amber-600",
          label: "Needs Verification"
        };
    }
  };

  const styles = getStyles();

  const handleCopyReport = () => {
    const reportText = `FactCheck AI Report\nVerdict: ${verdict}\nSummary: ${context || "No summary provided."}\n${reasoning ? `\nDeep Analysis: ${reasoning}` : ""}\nVerified via FactCheck AI`;
    navigator.clipboard.writeText(reportText);
    setCopied(true);
    toast({ title: "Report Copied", description: "Verification details copied to your clipboard." });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleToggleAudio = async () => {
    if (audioUrl) {
      if (isPlaying) audioRef.current?.pause(); else audioRef.current?.play();
      setIsPlaying(!isPlaying);
      return;
    }
    setIsGeneratingAudio(true);
    try {
      const narrationText = `Verdict: ${verdict}. Summary: ${context || "This claim matches reliable data."} ${reasoning ? `Analysis: ${reasoning}` : ""}`;
      const { media } = await generateTruthAudio({ text: narrationText });
      setAudioUrl(media);
      setIsPlaying(true);
    } catch (error) {
      toast({ variant: "destructive", title: "Audio Error", description: "Could not generate narration." });
    } finally {
      setIsGeneratingAudio(false);
    }
  };

  const getReliabilityStyles = (reliability?: string) => {
    switch (reliability) {
      case 'High': return "bg-emerald-50 text-emerald-600 border-emerald-100";
      case 'Medium': return "bg-blue-50 text-blue-600 border-blue-100";
      case 'Mixed': return "bg-amber-50 text-amber-600 border-amber-100";
      default: return "bg-slate-50 text-slate-500 border-slate-100";
    }
  };

  return (
    <Card className={cn("overflow-hidden border shadow-xl bg-white", styles.borderColor, className)}>
      <CardHeader className={cn("py-3 px-6 flex flex-row items-center justify-between", styles.bgColor)}>
        <div className="flex items-center gap-2.5">
          {styles.icon}
          <CardTitle className={cn("text-base font-bold font-headline tracking-tight", styles.textColor)}>
            {styles.label}
          </CardTitle>
        </div>
        <div className="flex items-center gap-1.5">
          <Button variant="ghost" size="sm" className="h-7 gap-1.5 rounded-full hover:bg-white/50 text-[9px] font-bold uppercase tracking-tight text-slate-500 px-3" onClick={handleToggleAudio} disabled={isGeneratingAudio}>
            {isGeneratingAudio ? <Loader2 className="h-3 w-3 animate-spin" /> : isPlaying ? <><Pause className="h-3 w-3" /> Stop</> : <><Volume2 className="h-3 w-3" /> Listen</>}
          </Button>
          <Button variant="ghost" size="sm" className="h-7 w-7 p-0 rounded-full hover:bg-white/50" onClick={handleCopyReport}>
            {copied ? <Check className="h-3.5 w-3.5 text-primary" /> : <Copy className="h-3.5 w-3.5 text-slate-400" />}
          </Button>
          {onClose && <Button variant="ghost" size="sm" className="h-7 w-7 p-0 rounded-full hover:bg-white/50 ml-1" onClick={onClose}><X className="h-4 w-4 text-slate-400" /></Button>}
        </div>
      </CardHeader>
      
      {audioUrl && <audio ref={audioRef} src={audioUrl} onEnded={() => setIsPlaying(false)} className="hidden" />}

      <CardContent className="pt-5 pb-5 px-6 space-y-5">
        <div className="space-y-2.5">
          <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Verdict Summary</p>
          <div className="flex items-start gap-3">
            <ArrowRight className="h-3.5 w-3.5 mt-0.5 text-slate-300 shrink-0" />
            <p className="text-sm leading-relaxed font-medium text-slate-900">{context || "This claim is consistent with reliable data sources."}</p>
          </div>
        </div>

        {reasoning && (
          <div className="space-y-2.5 p-4 rounded-xl bg-slate-50 border border-slate-100">
            <div className="flex items-center gap-2">
              <Info className="h-3 w-3 text-primary" />
              <p className="text-[9px] font-black uppercase tracking-widest text-primary">AI Analysis</p>
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed italic">{reasoning}</p>
          </div>
        )}

        {sources && sources.length > 0 && (
          <div className="space-y-3">
            <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Verified Sources</p>
            <div className="flex flex-col gap-2">
              {sources.map((source, i) => (
                <div key={i} className="flex items-center justify-between gap-4 p-2 rounded-lg border border-slate-50 hover:bg-slate-50 transition-colors group">
                  <a href={source.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-[10px] font-bold text-slate-700 hover:text-primary transition-colors flex-1 min-w-0">
                    <ExternalLink className="h-3 w-3 shrink-0" />
                    <span className="truncate">{source.title}</span>
                  </a>
                  <Badge variant="outline" className={cn("h-5 px-1.5 text-[8px] font-black uppercase tracking-tight whitespace-nowrap", getReliabilityStyles(source.reliability))}>
                    <Shield className="h-2 w-2 mr-1" />
                    {source.reliability || 'Assessed'}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        )}

        {recommendedSearchQuery && (
          <div className="pt-2">
            <Button 
              variant="outline" 
              className="w-full h-9 rounded-xl border-dashed border-2 hover:border-primary/50 hover:bg-primary/5 group"
              onClick={() => window.open(`https://www.google.com/search?q=${encodeURIComponent(recommendedSearchQuery)}`, '_blank')}
            >
              <Search className="h-3.5 w-3.5 mr-2 text-primary group-hover:scale-110 transition-transform" />
              <span className="text-[10px] font-black uppercase tracking-widest">Research Further</span>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
