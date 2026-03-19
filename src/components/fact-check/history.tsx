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
import { ShieldCheck, Clock, AlertCircle, CheckCircle2, HelpCircle, Quote, Activity } from "lucide-react";
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
      limit(12)
    );
  }, [firestore, user]);

  const { data: history, isLoading } = useCollection(historyQuery);

  if (isUserLoading || isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-[360px] rounded-[2.5rem] bg-white border border-slate-100 animate-pulse shadow-sm" />
        ))}
      </div>
    );
  }

  if (!user || !history || history.length === 0) {
    return (
      <div className="text-center py-16 px-6 bg-white rounded-[3rem] border-2 border-dashed border-slate-200 shadow-sm max-w-2xl mx-auto w-full">
        <div className="bg-slate-50 p-6 rounded-full w-fit mx-auto mb-6 shadow-inner text-slate-300">
          <Activity className="h-10 w-10" />
        </div>
        <h3 className="text-2xl font-bold font-headline text-slate-900 mb-2">The vault is empty.</h3>
        <p className="text-slate-500 max-w-sm mx-auto text-sm">Your historical factual data will appear here once you begin verifying claims.</p>
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

  return (
    <div className="relative w-full max-w-6xl mx-auto">
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
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Activity Stream</span>
          </div>
          <div className="flex gap-2">
            <CarouselPrevious className="static translate-y-0 h-10 w-10 border-none bg-white hover:bg-slate-50 shadow-md rounded-full transition-all" />
            <CarouselNext className="static translate-y-0 h-10 w-10 border-none bg-white hover:bg-slate-50 shadow-md rounded-full transition-all" />
          </div>
        </div>

        <CarouselContent className="-ml-4">
          {history.map((item) => {
            const config = getVerdictConfig(item.verdict);
            return (
              <CarouselItem key={item.id} className="pl-4 md:basis-1/2 lg:basis-1/3">
                <Card className="h-[380px] group relative overflow-hidden border-none shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_10px_40px_rgba(0,0,0,0.06)] transition-all duration-500 bg-white rounded-[2.5rem]">
                  {/* Visual Background Decoration */}
                  <div className={cn("absolute -top-8 -right-8 w-24 h-24 rounded-full opacity-[0.03] group-hover:opacity-5 transition-opacity", config.accent)} />
                  
                  <CardContent className="p-8 h-full flex flex-col">
                    {/* Header: Badge & Trust Score */}
                    <div className="flex items-start justify-between mb-6">
                      <div className="space-y-3">
                        <Badge className={cn("flex items-center gap-1.5 px-3 py-1 rounded-full border shadow-none font-bold text-[9px] uppercase tracking-widest", config.styles)}>
                          {config.icon}
                          {item.verdict}
                        </Badge>
                        <div className="flex items-center gap-1 text-[9px] font-black text-slate-300 uppercase tracking-widest">
                          <Clock className="h-2.5 w-2.5" />
                          {formatDistanceToNow(new Date(item.checkedAt), { addSuffix: true })}
                        </div>
                      </div>
                      
                      {/* Mini Score Circle */}
                      <div className="relative w-10 h-10">
                        <svg className="w-full h-full transform -rotate-90">
                          <circle cx="20" cy="20" r="17" stroke="currentColor" strokeWidth="3" fill="transparent" className="text-slate-50" />
                          <circle 
                            cx="20" cy="20" r="17" stroke="currentColor" strokeWidth="3" fill="transparent" 
                            strokeDasharray={106.8} 
                            strokeDashoffset={106.8 - (106.8 * config.score) / 100}
                            className={cn("transition-all duration-1000", config.accent.replace('bg-', 'text-'))} 
                          />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center text-[9px] font-black text-slate-800">
                          {config.score}%
                        </div>
                      </div>
                    </div>

                    {/* Content: The Claim */}
                    <div className="relative flex-1 mb-6 overflow-hidden">
                      <Quote className="absolute -top-2 -left-2 h-8 w-8 text-slate-50 -z-10 group-hover:text-slate-100 transition-colors" />
                      <div className="space-y-3">
                        <p className="text-[9px] font-black text-primary uppercase tracking-widest">The Subject</p>
                        <p className="text-base text-slate-900 font-bold leading-relaxed line-clamp-4 group-hover:text-primary transition-colors">
                          "{item.originalText}"
                        </p>
                      </div>
                    </div>

                    {/* Footer: The Analysis */}
                    <div className="pt-6 border-t border-slate-50">
                      <div className="flex items-center gap-2 mb-2">
                        <div className={cn("h-1 w-1 rounded-full", config.accent)} />
                        <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">AI Analysis</p>
                      </div>
                      <p className="text-xs text-slate-500 leading-relaxed line-clamp-2 font-medium italic">
                        {item.suggestedCorrection || "Verified accuracy matches our factual indices."}
                      </p>
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
