import { ShieldCheck, ArrowRight, Zap, CircleCheckBig, History as HistoryIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TextVerifier } from "@/components/fact-check/text-verifier";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col selection:bg-primary/30">
      {/* Header */}
      <header className="border-b border-white/5 bg-black/40 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="bg-primary p-1.5 rounded-lg shadow-[0_0_15px_rgba(180,160,200,0.3)] group-hover:scale-105 transition-transform">
                <ShieldCheck className="h-6 w-6 text-black" />
              </div>
              <h1 className="text-xl font-bold font-headline tracking-tight text-white">
                FactCheck <span className="text-primary">AI</span>
              </h1>
            </Link>
          </div>
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
            <Link href="/history" className="hover:text-primary transition-colors flex items-center gap-2 text-white/60">
              <HistoryIcon className="h-4 w-4" /> History
            </Link>
          </nav>
          <div className="w-10 md:hidden" />
        </div>
      </header>

      <main className="flex-1">
        {/* Hero & Verifier Section */}
        <section id="verify" className="py-20 md:py-32 px-4 relative">
          <div className="container mx-auto max-w-5xl space-y-16 relative z-10">
            <div className="text-center space-y-8 max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-widest animate-in fade-in slide-in-from-top-4 duration-700">
                <Zap className="h-3 w-3" />
                <span>Forensic Intelligence Active</span>
              </div>
              <h2 className="text-5xl md:text-7xl font-bold font-headline tracking-tight text-white leading-[1.1]">
                Scrutinize the <span className="text-primary italic">Atmosphere</span>.
              </h2>
              <p className="text-lg text-white/50 leading-relaxed font-medium">
                Misinformation is the digital fog. We are the bioluminescent pulse that reveals the truth. Analyze text and images instantly.
              </p>
            </div>

            <div className="animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-200">
              <TextVerifier />
            </div>
          </div>
        </section>

        {/* Extension Demo CTA */}
        <section className="py-24 px-4 border-t border-white/5 bg-black/20">
          <div className="container mx-auto">
            <div className="grid md:grid-cols-2 gap-20 items-center max-w-6xl mx-auto">
              <div className="space-y-8">
                <h3 className="text-4xl font-bold font-headline leading-tight text-white">
                  Reality, clarified <span className="text-primary">everywhere</span>.
                </h3>
                <p className="text-white/50 text-xl leading-relaxed">
                  The extension acts as a forensic lens on your browser. Highlight any claim to instantly sweep away the fog of misinformation.
                </p>
                <div className="space-y-5">
                  {[
                    "Omniscience Page Scan",
                    "Bioluminescent Verification",
                    "Deep Forensic Context",
                    "Privacy-First Intelligence"
                  ].map((feature, i) => (
                    <div key={i} className="flex items-center gap-4">
                      <div className="bg-primary/20 p-1.5 rounded-full ring-1 ring-primary/30">
                        <CircleCheckBig className="h-4 w-4 text-primary" />
                      </div>
                      <span className="text-sm font-bold text-white/80 tracking-wide">{feature}</span>
                    </div>
                  ))}
                </div>
                <Link href="/extension-demo" className="inline-block pt-6">
                  <Button size="lg" className="rounded-full gap-3 px-10 py-7 text-xl font-bold shadow-[0_0_30px_rgba(180,160,200,0.2)] hover:scale-105 transition-all">
                    Experience the Demo <ArrowRight className="h-6 w-6" />
                  </Button>
                </Link>
              </div>
              
              <Link href="/extension-demo" className="relative group">
                <div className="absolute -inset-10 bg-primary/10 rounded-full blur-[100px] group-hover:bg-primary/20 transition-all" />
                <div className="relative misty-glass rounded-3xl p-10 flex flex-col items-center text-center space-y-6">
                  <div className="bg-primary/10 w-20 h-20 rounded-full flex items-center justify-center ring-1 ring-primary/30">
                    <Zap className="h-10 w-10 text-primary" />
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-2xl font-bold text-white">Atmospheric Analysis</h4>
                    <p className="text-sm text-white/40 max-w-xs">See how the extension behaves in a simulated forest of unverified data.</p>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/5 py-16 px-4 bg-black/40 backdrop-blur-xl">
        <div className="container mx-auto text-center space-y-8">
          <div className="flex items-center justify-center gap-2">
            <ShieldCheck className="h-6 w-6 text-primary" />
            <span className="font-bold font-headline text-white tracking-widest text-lg uppercase">FactCheck AI</span>
          </div>
          <p className="text-sm text-white/40 max-w-md mx-auto leading-relaxed">
            Protecting the digital atmosphere through forensic truth detection and bioluminescent factual analysis.
          </p>
          <div className="pt-8 border-t border-white/5 text-[10px] font-black uppercase tracking-[0.4em] text-white/20">
            © {new Date().getFullYear()} FactCheck AI. Forensic Node 1.4.2
          </div>
        </div>
      </footer>
    </div>
  );
}
