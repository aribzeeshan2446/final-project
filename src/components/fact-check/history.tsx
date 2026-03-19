"use client";

import React from "react";
import { collection, query, orderBy, limit } from "firebase/firestore";
import { useFirebase, useUser, useCollection, useMemoFirebase } from "@/firebase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck, Clock, AlertCircle, CheckCircle2, HelpCircle } from "lucide-react";
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
      <div className="grid gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-32 rounded-xl bg-slate-100 animate-pulse" />
        ))}
      </div>
    );
  }

  if (!user || !history || history.length === 0) {
    return (
      <div className="text-center py-20 bg-slate-50 rounded-2xl border-2 border-dashed">
        <div className="bg-white p-4 rounded-full w-fit mx-auto mb-4 shadow-sm">
          <ShieldCheck className="h-8 w-8 text-slate-300" />
        </div>
        <p className="text-slate-500 font-medium">No verification history yet.</p>
        <p className="text-sm text-slate-400">Your fact-checks will appear here.</p>
      </div>
    );
  }

  const getVerdictIcon = (verdict: string) => {
    switch (verdict) {
      case 'Likely Accurate': return <CheckCircle2 className="h-4 w-4 text-primary" />;
      case 'Potentially Misleading': return <AlertCircle className="h-4 w-4 text-accent" />;
      default: return <HelpCircle className="h-4 w-4 text-amber-500" />;
    }
  };

  const getVerdictBadgeVariant = (verdict: string) => {
    switch (verdict) {
      case 'Likely Accurate': return 'secondary';
      case 'Potentially Misleading': return 'destructive';
      default: return 'outline';
    }
  };

  return (
    <div className="grid gap-6">
      {history.map((item) => (
        <Card key={item.id} className="overflow-hidden border-2 hover:border-primary/20 transition-colors">
          <CardHeader className="bg-slate-50/50 py-3 flex flex-row items-center justify-between">
            <div className="flex items-center gap-2">
              <Badge variant={getVerdictBadgeVariant(item.verdict)} className="flex items-center gap-1">
                {getVerdictIcon(item.verdict)}
                {item.verdict}
              </Badge>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                {formatDistanceToNow(new Date(item.checkedAt), { addSuffix: true })}
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-4 space-y-4">
            <div className="space-y-1">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Original Claim</p>
              <p className="text-sm text-slate-700 italic line-clamp-2">"{item.originalText}"</p>
            </div>
            {item.suggestedCorrection && (
              <div className="space-y-1 bg-primary/5 p-3 rounded-lg border border-primary/10">
                <p className="text-xs font-bold text-primary uppercase tracking-wider">Correction / Context</p>
                <p className="text-sm text-slate-800">{item.suggestedCorrection}</p>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
