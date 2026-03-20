"use client";

import React from "react";
import { query, collection, orderBy, limit } from "firebase/firestore";
import { useFirebase, useUser, useCollection, useMemoFirebase } from "@/firebase";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  CarouselNext, 
  CarouselPrevious 
} from "@/components/ui/carousel";
import { ShieldCheck, Clock, AlertCircle, CheckCircle2, HelpCircle, Quote, Activity, ExternalLink, BarChart3, Fingerprint, Zap } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";

export function VerificationHistory() {
  const { firestore } = useFirebase();
  const { user, isUserLoading } = useUser();

  const historyQuery = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return query(
      collection(firestore, "users", user.uid, "verificationResults"),
      orderBy("checkedAt", "desc"),
      limit(20)
    );
  }, [firestore, user]);

  const { data: history, isLoading } = useCollection(historyQuery);

  if (isUserLoading || isLoading) {
    return (
      <div className="space-y-8 w-full">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 rounded-2xl bg-white/50 border border-slate-100 animate-pulse shadow-sm" />
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-[400px] rounded-[2.5rem] bg-white/50 border border-slate-100 animate-pulse shadow-sm" />
          ))}
        </div>
      </div>
    );
  }

  if (!user || !history || history.length === 0) {
    return (
      <div className="text-center py-20 px-8 bg-white/95 rounded-[3rem] border-2 border-dashed border-slate-200 shadow-xl max-w-2xl mx-auto w-full">
        <div className="bg-slate-50 p-6 rounded-full w-fit mx-auto mb-6 shadow-inner text-slate-300">
          <Activity className="h-10 w-10" />
        </div>
        <h3 className="text-2xl font-black font-headline text-slate-900 mb-2 uppercase tracking-tight">Vault Empty</h3>
        <p className="text-slate-900 text-sm font-bold max-w-sm mx-auto">Your historical factual intelligence will appear here once you begin verifying claims.</p>
      </div>
    );
  }

  const getVerdictConfig = (verdict: string) => {
    switch (verdict) {
      case 'Likely Accurate': return { 
        icon: <CheckCircle2 className="h-3.5 w-3.5" />, 
        styles: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
        accent: "bg-emerald-500",
        score: 95
      };
      case 'Potentially Misleading': return { 
        icon: <AlertCircle className="h-3.5 w-3.5" />, 
        styles: "bg-rose-500/10 text-rose-600 border-rose-500/20",
        accent: "bg-rose-500",
        score: 12
      };
      default: return { 
        icon: <HelpCircle className="h-3.5 w-3.5" />, 
        styles: "bg-amber-500/10 text-amber-600 border-amber-500/20",
        accent: "bg-amber-500",
        score: 45
      };
    }
  };

  const accurateCount = history.filter(h => h.verdict === 'Likely Accurate').length;
  const misleadingCount = history.filter(h => h.verdict === 'Potentially Misleading').length;
  const accuracyRate = Math.round((accurateCount / history.length) * 100);

  return (
    <div className="relative w-full max-w-7xl mx-auto space-y-12">
      {/* Analytics Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="misty-glass border-slate-200 rounded-2xl p-6 flex items-center gap-4 group transition-all">
          <div className="p-3 rounded-xl bg-primary/10 text-primary group-hover:scale-110 transition-transform">
            <Fingerprint className="h-6 w-6" />
          </div>
          <div>
            <p className="text-[9px] font-black uppercase tracking-widest text-slate-900">Total Records</p>
            <h4 className="text-2xl font-black text-slate-900">{history.length}</h4>
          </div>
        </Card>
        <Card className="misty-glass border-slate-200 rounded-2xl p-6 flex items-center gap-4 group transition-all">
          <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-600 group-hover:scale-110 transition-transform">
            <CheckCircle2 className="h-6 w-6" />
          </div>
          <div>
            <p className="text-[9px] font-black uppercase tracking-widest text-slate-900">Reliable Ratio</p>
            <h4 className="text-2xl font-black text-slate-900">{accuracyRate}%</h4>
          </div>
        </Card>
        <Card className="misty-glass border-slate-200 rounded-2xl p-6 flex items-center gap-4 group transition-all">
          <div className="p-3 rounded-xl bg-primary/10 text-primary group-hover:scale-110 transition-transform">
            <Zap className="h-6 w-6" />
          </div>
          <div>
            <p className="text-[9px] font-black uppercase tracking-widest text-slate-900">Flags Raised</p>
            <h4 className="text-2xl font-black text-slate-900">{misleadingCount}</h4>
          </div>
        </Card>
      </div>

      <Carousel
        opts={{
          align: "start",
          loop: false,
        }}
        className="w-full"
      >
        <div className="flex items-center justify-between mb-6 px-2">
          <div className="flex items-center gap-3">
            <div className="h-1 w-8 bg-primary rounded-full" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-900">Historical Stream</span>
          </div>
          <div className="flex gap-2">
            <CarouselPrevious className="static translate-y-0 h-10 w-10 border-none bg-white shadow-md rounded-full transition-all" />
            <CarouselNext className="static translate-y-0 h-10 w-10 border-none bg-white shadow-md rounded-full transition-all" />
          </div>
        </div>

        <CarouselContent className="-ml-4">
          {history.map((item) => {
            const config = getVerdictConfig(item.verdict);
            return (
              <CarouselItem key={item.id} className="pl-4 md:basis-1/2 lg:basis-1/3">
                <Card className="h-[460px] group relative overflow-hidden border-none shadow-xl transition-all duration-500 bg-white/95 rounded-[2.5rem]">
                  <div className={cn("absolute -top-8 -right-8 w-24 h-24 rounded-full opacity-[0.05] group-hover:opacity-10 transition-opacity", config.accent)} />
                  
                  <CardContent className="p-8 h-full flex flex-col">
                    <div className="flex items-start justify-between mb-8">
                      <div className="space-y-3">
                        <Badge className={cn("flex items-center gap-1.5 px-3 py-1 rounded-full border shadow-none font-black text-[9px] uppercase tracking-widest", config.styles)}>
                          {config.icon}
                          {item.verdict}
                        </Badge>
                        <div className="flex items-center gap-1 text-[9px] font-black text-slate-900 uppercase tracking-widest">
                          <Clock className="h-2.5 w-2.5" />
                          {formatDistanceToNow(new Date(item.checkedAt), { addSuffix: true })}
                        </div>
                      </div>
                      
                      <div className="relative w-10 h-10">
                        <svg className="w-full h-full transform -rotate-90">
                          <circle cx="20" cy="20" r="17" stroke="currentColor" strokeWidth="3" fill="transparent" className="text-slate-100" />
                          <circle 
                            cx="20" cy="20" r="17" stroke="currentColor" strokeWidth="3" fill="transparent" 
                            strokeDasharray={106.8} 
                            strokeDashoffset={106.8 - (106.8 * config.score) / 100}
                            className={cn("transition-all duration-1000", config.accent.replace('bg-', 'text-'))} 
                          />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center text-[9px] font-black text-slate-900">
                          {config.score}%
                        </div>
                      </div>
                    </div>

                    <div className="relative flex-1 mb-6 overflow-hidden">
                      <Quote className="absolute -top-2 -left-2 h-10 w-10 text-slate-100 -z-10 group-hover:text-slate-200 transition-colors" />
                      <div className="space-y-2">
                        <p className="text-[9px] font-black text-primary uppercase tracking-widest">Subject Material</p>
                        <p className="text-sm text-slate-900 font-bold leading-relaxed line-clamp-3 group-hover:text-primary transition-colors">
                          "{item.originalText}"
                        </p>
                      </div>
                    </div>

                    <div className="space-y-4 pt-6 border-t border-slate-100">
                      <div>
                        <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-900 mb-2">AI Summary</p>
                        <p className="text-[11px] text-slate-900 leading-relaxed line-clamp-2 font-bold italic">
                          {item.suggestedCorrection || "Accuracy verified against established records."}
                        </p>
                      </div>
                      
                      {item.sources && item.sources.length > 0 && (
                        <div>
                          <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-900 mb-2">Primary Evidence</p>
                          <a 
                            href={item.sources[0].url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 text-[10px] font-black text-primary hover:underline group/link"
                          >
                            <ExternalLink className="h-3 w-3" />
                            {item.sources[0].title}
                          </a>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </CarouselItem>
            );
          })}
        </CarouselContent>
      </Carousel>
    </div>
  );
}
