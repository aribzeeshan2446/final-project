"use client";

import { CheckCircle2, AlertCircle, HelpCircle, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface VerdictCardProps {
  verdict: 'Likely Accurate' | 'Needs Verification' | 'Potentially Misleading';
  context: string | null;
  className?: string;
}

export function VerdictCard({ verdict, context, className }: VerdictCardProps) {
  const getStyles = () => {
    switch (verdict) {
      case 'Likely Accurate':
        return {
          icon: <CheckCircle2 className="h-6 w-6 text-primary" />,
          bgColor: "bg-primary/10",
          borderColor: "border-primary/20",
          textColor: "text-primary",
          label: "Likely Accurate"
        };
      case 'Potentially Misleading':
        return {
          icon: <AlertCircle className="h-6 w-6 text-accent" />,
          bgColor: "bg-accent/10",
          borderColor: "border-accent/20",
          textColor: "text-accent",
          label: "Potentially Misleading"
        };
      default:
        return {
          icon: <HelpCircle className="h-6 w-6 text-amber-500" />,
          bgColor: "bg-amber-500/10",
          borderColor: "border-amber-500/20",
          textColor: "text-amber-600",
          label: "Needs Verification"
        };
    }
  };

  const styles = getStyles();

  return (
    <Card className={cn("overflow-hidden border-2 shadow-lg", styles.borderColor, className)}>
      <CardHeader className={cn("py-4", styles.bgColor)}>
        <div className="flex items-center gap-3">
          {styles.icon}
          <CardTitle className={cn("text-lg font-bold font-headline", styles.textColor)}>
            {styles.label}
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="pt-6 pb-6">
        {context ? (
          <div className="space-y-4">
            <div className="flex items-start gap-2">
              <div className="mt-1">
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
              </div>
              <p className="text-sm leading-relaxed text-foreground">
                {context}
              </p>
            </div>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground italic">
            This information aligns with current reliable sources and general knowledge.
          </p>
        )}
      </CardContent>
    </Card>
  );
}