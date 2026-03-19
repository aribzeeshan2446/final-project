"use client";

import React from "react";
import { collection, query, orderBy, limit } from "firebase/firestore";
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
import { ShieldCheck, Clock, AlertCircle, CheckCircle2, HelpCircle, Quote, ArrowRight, Activity } from "lucide-react";
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
          <div key={i} className="h-[400px] rounded-[3rem] bg-white border border-slate-100 animate-pulse shadow-sm" />
        ))}
      </div>
    );
  }

  if (!user || !history || history.length === 0) {
    return (
      <div className="text-center py-32 px-6 bg-white rounded-[4rem] border-2 border-dashed border-slate-200 shadow-sm max-w-4xl mx-auto">
        <div className="bg-slate-50 p-8 rounded-full w-fit mx-auto mb-8 shadow-inner text-slate-300">
          <Activity className="h-16 w-16" />
        </div>
        <h3 className="text-3xl font-bold font-headline text-slate-900 mb-4">The vault is empty.</h3>
        <p className="text-slate-500 max-w-sm mx-auto text-lg">Your historical factual data will appear here once you begin verifying claims.</p>
      </div>
    );
  }

  const getVerdictConfig = (verdict: string) => {
    switch (verdict) {
      case 'Likely Accurate': return { 
        icon: <CheckCircle2 className="h-4 w-4" />, 
        styles: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
        accent: "bg-emerald-500",
        score: 95
      };
      case 'Potentially Misleading': return { 
        icon: <AlertCircle className="h-4 w-4" />, 
        styles: "bg-rose-500/10 text-rose-600 border-rose-500/20",
        accent: "bg-rose-500",
        score: 12
      };
      default: return { 
        icon: <HelpCircle className="h-4 w-4" />, 
        styles: "bg-amber-500/10 text-amber-600 border-amber-500/20",
        accent: "bg-amber-500",
        score: 45
      };
    }
  };

  return (
    <div className="relative w-full">
      <Carousel
        opts={{
          align: "start",
          loop: false,
        }}
        className="w-full"
      >
        <div className="flex items-center justify-between mb-8 px-2">
          <div className="flex items-center gap-3">
            <div className="h-1 w-12 bg-primary rounded-full" />
            <span className="text-sm font-black uppercase tracking-[0.2em] text-slate-400">Activity Stream</span>
          </div>
          <div className="flex gap-4">
            <CarouselPrevious className="static translate-y-0 h-12 w-12 border-none bg-white hover:bg-slate-50 shadow-xl rounded-full transition-all hover:scale-110" />
            <CarouselNext className="static translate-y-0 h-12 w-12 border-none bg-white hover:bg-slate-50 shadow-xl rounded-full transition-all hover:scale-110" />
          </div>
        </div>

        <CarouselContent className="-ml-6 py-4">
          {history.map((item) => {
            const config = getVerdictConfig(item.verdict);
            return (
              <CarouselItem key={item.id} className="pl-6 md:basis-1/2 lg:basis-1/3 xl:basis-1/3">
                <Card className="h-[480px] group relative overflow-hidden border-none shadow-[0_4px_30px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_70px_rgba(0,0,0,0.08)] transition-all duration-700 bg-white rounded-[3rem]">
                  {/* Visual Background Decoration */}
                  <div className={cn("absolute -top-10 -right-10 w-32 h-32 rounded-full opacity-[0.03] group-hover:opacity-10 transition-opacity", config.accent)} />
                  
                  <CardContent className="p-10 h-full flex flex-col">
                    {/* Header: Badge & Trust Score */}
                    <div className="flex items-start justify-between mb-10">
                      <div className="space-y-4">
                        <Badge className={cn("flex items-center gap-2 px-4 py-2 rounded-full border shadow-none font-bold text-[10px] uppercase tracking-widest", config.styles)}>
                          {config.icon}
                          {item.verdict}
                        </Badge>
                        <div className="flex items-center gap-1.5 text-[10px] font-black text-slate-300 uppercase tracking-widest">
                          <Clock className="h-3 w-3" />
                          {formatDistanceToNow(new Date(item.checkedAt), { addSuffix: true })}
                        </div>
                      </div>
                      
                      {/* Mini Score Circle */}
                      <div className="relative w-12 h-12">
                        <svg className="w-full h-full transform -rotate-90">
                          <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-slate-50" />
                          <circle 
                            cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="4" fill="transparent" 
                            strokeDasharray={125.6} 
                            strokeDashoffset={125.6 - (125.6 * config.score) / 100}
                            className={cn("transition-all duration-1000 delay-300", config.accent.replace('bg-', 'text-'))} 
                          />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center text-[10px] font-black text-slate-800">
                          {config.score}%
                        </div>
                      </div>
                    </div>

                    {/* Content: The Claim */}
                    <div className="relative flex-1 mb-8 overflow-hidden">
                      <Quote className="absolute -top-4 -left-4 h-12 w-12 text-slate-50 -z-10 group-hover:text-slate-100 transition-colors" />
                      <div className="space-y-4">
                        <p className="text-[10px] font-black text-primary uppercase tracking-widest">The Subject</p>
                        <p className="text-xl text-slate-900 font-bold leading-[1.4] line-clamp-5 group-hover:text-primary transition-colors">
                          "{item.originalText}"
                        </p>
                      </div>
                    </div>

                    {/* Footer: The Analysis */}
                    <div className="pt-8 border-t border-slate-50 group-hover:border-primary/10 transition-all">
                      <div className="flex items-center gap-3 mb-3">
                        <div className={cn("h-1.5 w-1.5 rounded-full", config.accent)} />
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">AI Context</p>
                      </div>
                      <p className="text-sm text-slate-500 leading-relaxed line-clamp-3 font-medium italic">
                        {item.suggestedCorrection || "The provided text aligns perfectly with our verified factual indices."}
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
