"use client";

import React from "react";
import { collection, query, orderBy, limit } from "firebase/firestore";
import { useFirebase, useUser, useCollection, useMemoFirebase } from "@/firebase";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  CarouselNext, 
  CarouselPrevious 
} from "@/components/ui/carousel";
import { ShieldCheck, Clock, AlertCircle, CheckCircle2, HelpCircle, MessageSquare } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export function VerificationHistory() {
  const { firestore } = useFirebase();
  const { user, isUserLoading } = useUser();

  const historyQuery = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return query(
      collection(firestore, "users", user.uid, "verificationResults"),
      orderBy("checkedAt", "desc"),
      limit(10)
    );
  }, [firestore, user]);

  const { data: history, isLoading } = useCollection(historyQuery);

  if (isUserLoading || isLoading) {
    return (
      <div className="flex gap-4 overflow-hidden">
        {[1, 2, 3].map((i) => (
          <div key={i} className="min-w-[300px] h-48 rounded-2xl bg-slate-100 animate-pulse" />
        ))}
      </div>
    );
  }

  if (!user || !history || history.length === 0) {
    return (
      <div className="text-center py-16 bg-white rounded-3xl border-2 border-dashed border-slate-200">
        <div className="bg-slate-50 p-4 rounded-full w-fit mx-auto mb-4 shadow-sm">
          <ShieldCheck className="h-8 w-8 text-slate-300" />
        </div>
        <p className="text-slate-500 font-semibold text-lg">Your history is clear</p>
        <p className="text-sm text-slate-400">Past verifications will appear here in a beautiful slider.</p>
      </div>
    );
  }

  const getVerdictIcon = (verdict: string) => {
    switch (verdict) {
      case 'Likely Accurate': return <CheckCircle2 className="h-4 w-4" />;
      case 'Potentially Misleading': return <AlertCircle className="h-4 w-4" />;
      default: return <HelpCircle className="h-4 w-4" />;
    }
  };

  const getVerdictStyles = (verdict: string) => {
    switch (verdict) {
      case 'Likely Accurate': 
        return "bg-emerald-50 text-emerald-700 border-emerald-100";
      case 'Potentially Misleading': 
        return "bg-rose-50 text-rose-700 border-rose-100";
      default: 
        return "bg-amber-50 text-amber-700 border-amber-100";
    }
  };

  return (
    <div className="relative px-12">
      <Carousel
        opts={{
          align: "start",
          loop: false,
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-4">
          {history.map((item) => (
            <CarouselItem key={item.id} className="pl-4 md:basis-1/2 lg:basis-1/3">
              <Card className="h-full overflow-hidden border-none shadow-md hover:shadow-xl transition-all duration-300 bg-white group">
                <CardHeader className="p-4 bg-slate-50/80 group-hover:bg-slate-100/80 transition-colors border-b">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <Badge className={`flex items-center gap-1.5 shadow-none font-bold px-2.5 py-1 ${getVerdictStyles(item.verdict)}`}>
                        {getVerdictIcon(item.verdict)}
                        {item.verdict}
                      </Badge>
                      <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                        <Clock className="h-3 w-3" />
                        {formatDistanceToNow(new Date(item.checkedAt), { addSuffix: true })}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-5 space-y-4">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 text-slate-400">
                      <MessageSquare className="h-3 w-3" />
                      <p className="text-[10px] font-black uppercase tracking-widest">Selected Text</p>
                    </div>
                    <p className="text-sm text-slate-700 font-medium leading-relaxed line-clamp-3 italic">
                      "{item.originalText}"
                    </p>
                  </div>
                  
                  {item.suggestedCorrection && (
                    <div className="pt-4 border-t border-slate-50">
                      <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-1.5">Correction</p>
                      <p className="text-xs text-slate-600 line-clamp-3">
                        {item.suggestedCorrection}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="hidden md:flex -left-6 border-2 h-12 w-12 bg-white hover:bg-slate-50 shadow-lg" />
        <CarouselNext className="hidden md:flex -right-6 border-2 h-12 w-12 bg-white hover:bg-slate-50 shadow-lg" />
      </Carousel>
    </div>
  );
}
