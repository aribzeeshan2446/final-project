import { ShieldCheck, ArrowLeft, History as HistoryIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { VerificationHistory } from "@/components/fact-check/history";
import Link from "next/link";

export default function HistoryPage() {
  return (
    <div className="h-screen flex flex-col bg-white selection:bg-primary/20 overflow-hidden">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white/95 backdrop-blur-md sticky top-0 z-50 shrink-0">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="bg-primary p-1.5 rounded-lg shadow-sm group-hover:scale-110 transition-all duration-300">
                <ShieldCheck className="h-5 w-5 text-white" />
              </div>
              <h1 className="text-lg font-bold font-headline tracking-tight text-slate-900">
                FactCheck <span className="text-primary">AI</span>
              </h1>
            </Link>
          </div>
          <nav className="flex items-center gap-8">
            <Link href="/" className="text-xs font-black text-slate-900 hover:text-primary transition-colors flex items-center gap-2 uppercase tracking-widest">
              <ArrowLeft className="h-3.5 w-3.5" /> Back to Verifier
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto py-12 px-4 flex flex-col items-center">
        <div className="container mx-auto max-w-7xl flex flex-col flex-1">
          <div className="space-y-6 text-center max-w-3xl mx-auto mb-16 shrink-0">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-widest">
              <HistoryIcon className="h-3 w-3" />
              <span>Intelligence Archive</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold font-headline tracking-tight text-slate-900 leading-tight">
              Verification <span className="text-primary italic">History</span>
            </h2>
            <p className="text-slate-900 text-lg font-bold leading-relaxed">
              Every claim you've scrutinized, stored in a secure timeline.
            </p>
          </div>

          <div className="flex-1 min-h-0 relative flex flex-col justify-center">
            <VerificationHistory />
          </div>

          <div className="flex justify-center py-12 shrink-0">
            <Link href="/">
              <Button size="lg" className="rounded-full gap-3 px-10 py-7 text-xl font-bold shadow-2xl hover:scale-105 transition-all">
                New Verification <ArrowLeft className="h-5 w-5 rotate-180" />
              </Button>
            </Link>
          </div>
        </div>
      </main>

      <footer className="border-t border-slate-100 py-8 px-4 bg-white shrink-0">
        <div className="container mx-auto flex items-center justify-between text-[10px] text-slate-500 font-bold uppercase tracking-widest">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-primary" />
            <span className="text-slate-900">FactCheck AI</span>
          </div>
          <p>
            © {new Date().getFullYear()} FactCheck AI. Secured with Firebase.
          </p>
        </div>
      </footer>
    </div>
  );
}