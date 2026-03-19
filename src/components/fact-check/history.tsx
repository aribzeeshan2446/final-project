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
import { ShieldCheck, Clock, AlertCircle, CheckCircle2, HelpCircle, Quote, ArrowRight } from "lucide-react";
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
      <div className="flex gap-6 overflow-hidden py-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="min-w-[320px] h-[380px] rounded-[2rem] bg-slate-100 animate-pulse shadow-inner" />
        ))}
      </div>
    );
  }

  if (!user || !history || history.length === 0) {
    return (
      <div className="text-center py-20 px-6 bg-slate-50/50 rounded-[3rem] border-2 border-dashed border-slate-200">
        <div className="bg-white p-6 rounded-full w-fit mx-auto mb-6 shadow-xl text-slate-200">
          <ShieldCheck className="h-12 w-12" />
        </div>
        <h3 className="text-2xl font-bold font-headline text-slate-800 mb-2">Your Archive is Empty</h3>
        <p className="text-slate-500 max-w-sm mx-auto">Start verifying claims to build your personal timeline of digital truth.</p>
      </div>
    );
  }

  const getVerdictConfig = (verdict: string) => {
    switch (verdict) {
      case 'Likely Accurate': return { 
        icon: <CheckCircle2 className="h-5 w-5" />, 
        styles: "bg-emerald-50 text-emerald-700 border-emerald-100/50",
        accent: "bg-emerald-500"
      };
      case 'Potentially Misleading': return { 
        icon: <AlertCircle className="h-5 w-5" />, 
        styles: "bg-rose-50 text-rose-700 border-rose-100/50",
        accent: "bg-rose-500"
      };
      default: return { 
        icon: <HelpCircle className="h-5 w-5" />, 
        styles: "bg-amber-50 text-amber-700 border-amber-100/50",
        accent: "bg-amber-500"
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
        <CarouselContent className="-ml-6 py-8 px-2">
          {history.map((item) => {
            const config = getVerdictConfig(item.verdict);
            return (
              <CarouselItem key={item.id} className="pl-6 md:basis-1/2 lg:basis-1/3 xl:basis-1/4">
                <Card className="h-[420px] group relative overflow-hidden border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_50px_rgb(0,0,0,0.08)] transition-all duration-500 bg-white rounded-[2.5rem]">
                  {/* Accent strip */}
                  <div className={cn("absolute top-0 left-0 w-full h-1.5", config.accent)} />
                  
                  <CardContent className="p-8 h-full flex flex-col">
                    {/* Header: Badge & Time */}
                    <div className="flex items-center justify-between mb-8">
                      <Badge className={cn("flex items-center gap-2 px-3 py-1.5 rounded-full border shadow-none font-bold text-[10px] uppercase tracking-wider", config.styles)}>
                        {config.icon}
                        {item.verdict}
                      </Badge>
                      <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-tighter bg-slate-50 px-2 py-1 rounded-md">
                        <Clock className="h-3 w-3" />
                        {formatDistanceToNow(new Date(item.checkedAt), { addSuffix: true })}
                      </div>
                    </div>

                    {/* Content: The Quote */}
                    <div className="relative flex-1 mb-6">
                      <Quote className="absolute -top-4 -left-2 h-8 w-8 text-slate-100 -z-10" />
                      <div className="space-y-3">
                        <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">The Claim</p>
                        <p className="text-base text-slate-800 font-semibold leading-relaxed line-clamp-4 italic">
                          "{item.originalText}"
                        </p>
                      </div>
                    </div>

                    {/* Footer: The Correction */}
                    {item.suggestedCorrection ? (
                      <div className="pt-6 border-t border-slate-50 group-hover:border-slate-100 transition-colors">
                        <div className="flex items-center gap-2 mb-2">
                          <ArrowRight className={cn("h-3 w-3", config.accent.replace('bg-', 'text-'))} />
                          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Analysis</p>
                        </div>
                        <p className="text-xs text-slate-500 leading-relaxed line-clamp-3 font-medium">
                          {item.suggestedCorrection}
                        </p>
                      </div>
                    ) : (
                      <div className="pt-6 border-t border-slate-50">
                        <p className="text-xs text-slate-400 italic">No correction needed. Information verified as accurate.</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </CarouselItem>
            );
          })}
        </CarouselContent>
        <div className="absolute -top-16 right-4 flex gap-3">
          <CarouselPrevious className="static translate-y-0 h-10 w-10 border-2 bg-white hover:bg-slate-50 shadow-md rounded-2xl" />
          <CarouselNext className="static translate-y-0 h-10 w-10 border-2 bg-white hover:bg-slate-50 shadow-md rounded-2xl" />
        </div>
      </Carousel>
    </div>
  );
}
