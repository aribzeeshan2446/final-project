
"use client";

import { CheckCircle2, AlertCircle, HelpCircle, ArrowRight, ExternalLink, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

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

  return (
    <Card className={cn("overflow-hidden border shadow-xl bg-white", styles.borderColor, className)}>
      <CardHeader className={cn("py-4", styles.bgColor)}>
        <div className="flex items-center gap-3">
          {styles.icon}
          <CardTitle className={cn("text-lg font-bold font-headline", styles.textColor)}>
            {styles.label}
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="pt-6 pb-6 space-y-6">
        {/* Suggested Correction */}
        <div className="space-y-2">
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Verdict Summary</p>
          <div className="flex items-start gap-3">
            <ArrowRight className="h-4 w-4 mt-0.5 text-slate-300" />
            <p className="text-sm leading-relaxed font-medium">
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
