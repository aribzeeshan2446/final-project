import { ShieldCheck, ArrowLeft, History as HistoryIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { VerificationHistory } from "@/components/fact-check/history";
import Link from "next/link";

export default function HistoryPage() {
  return (
    <div className="h-screen flex flex-col bg-[#F8FAF8] selection:bg-primary/20 overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] rounded-full bg-primary/5 blur-[120px]" />
        <div className="absolute top-[20%] -right-[5%] w-[30%] h-[30%] rounded-full bg-accent/5 blur-[100px]" />
      </div>

      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-50 shrink-0">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="bg-primary p-1 rounded-lg shadow-sm group-hover:scale-110 transition-all duration-300">
                <ShieldCheck className="h-5 w-5 text-white" />
              </div>
              <h1 className="text-lg font-bold font-headline tracking-tight">
                FactCheck <span className="text-primary">AI</span>
              </h1>
            </Link>
          </div>
          <nav className="flex items-center gap-8">
            <Link href="/" className="text-xs font-bold text-slate-500 hover:text-primary transition-colors flex items-center gap-2">
              <ArrowLeft className="h-3.5 w-3.5" /> Back to Verifier
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto py-8 px-4 flex flex-col items-center">
        <div className="container mx-auto max-w-7xl flex flex-col flex-1">
          <div className="space-y-4 text-center max-w-3xl mx-auto mb-10 shrink-0">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest">
              <HistoryIcon className="h-3 w-3" />
              <span>Intelligence Archive</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold font-headline tracking-tight text-slate-900 leading-tight">
              Verification <span className="text-primary italic">History</span>
            </h2>
            <p className="text-slate-500 text-sm md:text-base leading-relaxed">
              Every claim you've scrutinized, stored in a secure timeline.
            </p>
          </div>

          <div className="flex-1 min-h-0 relative flex flex-col justify-center">
            <VerificationHistory />
          </div>

          <div className="flex justify-center py-8 shrink-0">
            <Link href="/">
              <Button size="lg" className="rounded-full gap-3 px-8 py-6 text-base font-bold shadow-xl shadow-primary/20 hover:scale-105 transition-all">
                New Verification <ArrowLeft className="h-4 w-4 rotate-180" />
              </Button>
            </Link>
          </div>
        </div>
      </main>

      <footer className="border-t py-6 px-4 bg-white shrink-0">
        <div className="container mx-auto flex items-center justify-between text-[10px] text-slate-400">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-primary" />
            <span className="font-bold font-headline text-slate-900">FactCheck AI</span>
          </div>
          <p className="font-medium">
            © {new Date().getFullYear()} FactCheck AI. Secured with Firebase.
          </p>
        </div>
      </footer>
    </div>
  );
}
