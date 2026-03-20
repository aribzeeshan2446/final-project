import { ShieldCheck, ArrowRight, Zap, CircleCheckBig, History as HistoryIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TextVerifier } from "@/components/fact-check/text-verifier";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col selection:bg-primary/30">
      {/* Header */}
      <header className="border-b border-slate-200/60 bg-white/90 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="bg-primary p-1.5 rounded-lg shadow-sm group-hover:scale-105 transition-transform">
                <ShieldCheck className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-xl font-bold tracking-tight text-slate-900">
                FactCheck <span className="text-primary">AI</span>
              </h1>
            </Link>
          </div>
          <nav className="hidden md:flex items-center gap-8 text-sm font-bold">
            <Link href="/history" className="text-slate-900 hover:text-primary transition-colors flex items-center gap-2">
              <HistoryIcon className="h-4 w-4" /> History
            </Link>
          </nav>
          <div className="w-10 md:hidden" />
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-20 md:py-32 px-4 relative">
          <div className="container mx-auto max-w-5xl space-y-16 relative z-10">
            <div className="text-center space-y-8 max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-widest">
                <Zap className="h-3 w-3" />
                <span>AI-Powered Verification</span>
              </div>
              <h2 className="text-5xl md:text-7xl font-bold tracking-tight text-slate-900 leading-[1.1]">
                Verify any claim <span className="text-primary italic">instantly</span>.
              </h2>
              <p className="text-lg text-slate-900 leading-relaxed font-bold">
                Our AI analyzes text and images to find the truth hidden in the fog of misinformation. Fast, accurate, and transparent.
              </p>
            </div>

            <div className="animate-in fade-in slide-in-from-bottom-8 duration-1000">
              <TextVerifier />
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-24 px-4 bg-white/60 backdrop-blur-sm border-t border-slate-100">
          <div className="container mx-auto">
            <div className="grid md:grid-cols-2 gap-20 items-center max-w-6xl mx-auto">
              <div className="space-y-8">
                <h3 className="text-4xl font-bold leading-tight text-slate-900">
                  Trust your news <span className="text-primary">everywhere</span>.
                </h3>
                <p className="text-slate-900 text-xl leading-relaxed font-bold">
                  Install our extension to highlight text on any website and get an instant factual audit without leaving the page.
                </p>
                <div className="space-y-5">
                  {[
                    "Full Page Scans",
                    "Instant Verifications",
                    "Source Citations",
                    "Privacy Focused"
                  ].map((feature, i) => (
                    <div key={i} className="flex items-center gap-4">
                      <div className="bg-primary/20 p-1.5 rounded-full">
                        <CircleCheckBig className="h-4 w-4 text-primary" />
                      </div>
                      <span className="text-sm font-bold text-slate-900 tracking-wide">{feature}</span>
                    </div>
                  ))}
                </div>
                <Link href="/extension-demo" className="inline-block pt-6">
                  <Button size="lg" className="rounded-full gap-3 px-10 py-7 text-xl font-bold shadow-lg hover:scale-105 transition-all">
                    View Demo <ArrowRight className="h-6 w-6" />
                  </Button>
                </Link>
              </div>
              
              <div className="relative group p-12 misty-glass rounded-[2rem] text-center space-y-6">
                <div className="bg-primary/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto">
                  <ShieldCheck className="h-10 w-10 text-primary" />
                </div>
                <div className="space-y-2">
                  <h4 className="text-2xl font-bold text-slate-900">Verified Results</h4>
                  <p className="text-sm text-slate-900 font-bold">See how our AI analyzes information across the web.</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-100 py-16 px-4 bg-white/95">
        <div className="container mx-auto text-center space-y-8">
          <div className="flex items-center justify-center gap-2">
            <ShieldCheck className="h-6 w-6 text-primary" />
            <span className="font-bold text-slate-900 tracking-tight text-lg uppercase">FactCheck AI</span>
          </div>
          <p className="text-sm text-slate-900 font-bold max-w-md mx-auto">
            Providing clarity and truth through AI-powered factual analysis of text and imagery.
          </p>
          <div className="pt-8 text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">
            © {new Date().getFullYear()} FactCheck AI. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}