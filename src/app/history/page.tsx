import { ShieldCheck, ArrowLeft, History as HistoryIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { VerificationHistory } from "@/components/fact-check/history";
import Link from "next/link";

export default function HistoryPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAF8] selection:bg-primary/20">
      {/* Decorative Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] rounded-full bg-primary/5 blur-[120px]" />
        <div className="absolute top-[20%] -right-[5%] w-[30%] h-[30%] rounded-full bg-accent/5 blur-[100px]" />
      </div>

      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="bg-primary p-1.5 rounded-lg shadow-sm group-hover:scale-110 transition-all duration-300">
                <ShieldCheck className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-xl font-bold font-headline tracking-tight">
                FactCheck <span className="text-primary">AI</span>
              </h1>
            </Link>
          </div>
          <nav className="flex items-center gap-8">
            <Link href="/" className="text-sm font-bold text-slate-500 hover:text-primary transition-colors flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" /> Back to Verifier
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1 py-16 px-4">
        <div className="container mx-auto max-w-7xl space-y-16">
          <div className="space-y-6 text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-black uppercase tracking-widest animate-in fade-in slide-in-from-top-4 duration-500">
              <HistoryIcon className="h-3.5 w-3.5" />
              <span>Intelligence Archive</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-bold font-headline tracking-tight text-slate-900 leading-tight">
              Your Journey of <span className="text-primary italic">Truth</span>
            </h2>
            <p className="text-slate-500 text-lg md:text-xl leading-relaxed">
              Every claim you've scrutinized, stored in a secure timeline. Review, learn, and navigate the digital landscape with confidence.
            </p>
          </div>

          <div className="relative animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <VerificationHistory />
          </div>

          <div className="flex justify-center pt-8">
            <Link href="/">
              <Button size="lg" className="rounded-full gap-3 px-10 py-7 text-lg font-bold shadow-2xl shadow-primary/20 hover:scale-105 transition-all">
                New Verification <ArrowLeft className="h-5 w-5 rotate-180" />
              </Button>
            </Link>
          </div>
        </div>
      </main>

      <footer className="border-t py-12 px-4 bg-white mt-20">
        <div className="container mx-auto text-center space-y-4">
          <div className="flex items-center justify-center gap-2 mb-2">
            <ShieldCheck className="h-5 w-5 text-primary" />
            <span className="font-bold font-headline text-slate-900">FactCheck AI</span>
          </div>
          <p className="text-xs text-slate-400 font-medium">
            © {new Date().getFullYear()} FactCheck AI. Secured with Firebase.
          </p>
        </div>
      </footer>
    </div>
  );
}
