
"use client";

import { CheckCircle2, AlertCircle, HelpCircle, ArrowRight, ExternalLink, Info, Copy, Check, Volume2, Loader2, Play, Pause } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState, useRef, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { generateTruthAudio } from "@/ai/flows/text-to-speech-flow";

interface Source {
  title: string;
  url: string;
}

interface VerdictCardProps {
  verdict: 'Likely Accurate' | 'Needs Verification' | 'Potentially Misleading';
  context: string | null;
  reasoning?: string;
  sources?: Source[];
  className?: string;
}

export function VerdictCard({ verdict, context, reasoning, sources, className }: VerdictCardProps) {
  const [copied, setCopied] = useState(false);
  const [copiedCorrection, setCopiedCorrection] = useState(false);
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
          label: "Likely Accurate"
        };
      case 'Potentially Misleading':
        return {
          icon: <AlertCircle className="h-6 w-6 text-accent" />,
          bgColor: "bg-accent/5",
          borderColor: "border-accent/20",
          textColor: "text-accent",
          label: "Potentially Misleading"
        };
      default:
        return {
          icon: <HelpCircle className="h-6 w-6 text-amber-500" />,
          bgColor: "bg-amber-500/5",
          borderColor: "border-amber-500/20",
          textColor: "text-amber-600",
          label: "Needs Verification"
        };
    }
  };

  const styles = getStyles();

  const handleCopyReport = () => {
    const reportText = `FactCheck AI Report
Verdict: ${verdict}
Summary: ${context || "No summary provided."}
${reasoning ? `\nDeep Analysis: ${reasoning}` : ""}
${sources && sources.length > 0 ? `\nSources:\n${sources.map(s => `- ${s.title}: ${s.url}`).join('\n')}` : ""}
\nVerified via FactCheck AI`;

    navigator.clipboard.writeText(reportText);
    setCopied(true);
    toast({
      title: "Report Copied",
      description: "Verification details copied to your clipboard.",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyCorrection = () => {
    if (!context) return;
    navigator.clipboard.writeText(context);
    setCopiedCorrection(true);
    toast({
      title: "Correction Copied",
      description: "Suggested correction copied to clipboard.",
    });
    setTimeout(() => setCopiedCorrection(false), 2000);
  };

  const handleToggleAudio = async () => {
    if (audioUrl) {
      if (isPlaying) {
        audioRef.current?.pause();
      } else {
        audioRef.current?.play();
      }
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
      console.error("Audio generation failed", error);
      toast({
        variant: "destructive",
        title: "Voice of Truth Error",
        description: "Could not generate audio narration at this time.",
      });
    } finally {
      setIsGeneratingAudio(false);
    }
  };

  useEffect(() => {
    if (audioUrl && isPlaying && audioRef.current) {
      audioRef.current.play();
    }
  }, [audioUrl, isPlaying]);

  return (
    <Card className={cn("overflow-hidden border shadow-xl bg-white", styles.borderColor, className)}>
      <CardHeader className={cn("py-4 flex flex-row items-center justify-between", styles.bgColor)}>
        <div className="flex items-center gap-3">
          {styles.icon}
          <CardTitle className={cn("text-lg font-bold font-headline", styles.textColor)}>
            {styles.label}
          </CardTitle>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 gap-2 rounded-full hover:bg-white/50 text-[10px] font-black uppercase tracking-widest text-slate-500"
            onClick={handleToggleAudio}
            disabled={isGeneratingAudio}
          >
            {isGeneratingAudio ? (
              <Loader2 className="h-3 w-3 animate-spin" />
            ) : isPlaying ? (
              <>
                <Pause className="h-3 w-3" /> Stop
              </>
            ) : (
              <>
                <Volume2 className="h-3 w-3" /> Listen
              </>
            )}
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 w-8 p-0 rounded-full hover:bg-white/50" 
            onClick={handleCopyReport}
            title="Copy Full Report"
          >
            {copied ? <Check className="h-4 w-4 text-primary" /> : <Copy className="h-4 w-4 text-slate-400" />}
          </Button>
        </div>
      </CardHeader>
      
      {audioUrl && (
        <audio 
          ref={audioRef} 
          src={audioUrl} 
          onEnded={() => setIsPlaying(false)} 
          className="hidden" 
        />
      )}

      <CardContent className="pt-6 pb-6 space-y-6">
        {/* Suggested Correction */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Verdict Summary</p>
            {context && (
              <Button 
                variant="link" 
                size="sm" 
                className="h-auto p-0 text-[9px] font-bold text-primary uppercase tracking-tight"
                onClick={handleCopyCorrection}
              >
                {copiedCorrection ? "Copied!" : "Copy Narrative"}
              </Button>
            )}
          </div>
          <div className="flex items-start gap-3">
            <ArrowRight className="h-4 w-4 mt-0.5 text-slate-300" />
            <p className="text-sm leading-relaxed font-medium text-slate-900">
              {context || "This claim is consistent with reliable data sources."}
            </p>
          </div>
        </div>

        {/* Deep Analysis Reasoning */}
        {reasoning && (
          <div className="space-y-3 p-4 rounded-xl bg-slate-50 border border-slate-100">
            <div className="flex items-center gap-2">
              <Info className="h-3.5 w-3.5 text-primary" />
              <p className="text-[10px] font-black uppercase tracking-widest text-primary">AI Deep Analysis</p>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed italic">
              {reasoning}
            </p>
          </div>
        )}

        {/* Source Citations */}
        {sources && sources.length > 0 && (
          <div className="space-y-3">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Verified Sources</p>
            <div className="flex flex-wrap gap-2">
              {sources.map((source, i) => (
                <a 
                  key={i}
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-slate-200 text-[10px] font-bold text-slate-700 hover:border-primary hover:text-primary transition-all group"
                >
                  <ExternalLink className="h-3 w-3 group-hover:scale-110 transition-transform" />
                  {source.title}
                </a>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
