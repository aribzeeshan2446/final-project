import { ShieldCheck, ArrowRight, Zap, Search, MessageSquare, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TextVerifier } from "@/components/fact-check/text-verifier";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b bg-white sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="bg-primary p-1.5 rounded-lg shadow-sm group-hover:scale-105 transition-transform">
                <ShieldCheck className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-xl font-bold font-headline tracking-tight">
                FactCheck <span className="text-primary">AI</span>
              </h1>
            </Link>
          </div>
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
            <a href="#how-it-works" className="hover:text-primary transition-colors">How it works</a>
            <Button asChild variant="link" className="p-0 h-auto font-medium hover:text-primary transition-colors">
              <Link href="/extension-demo">Extension Demo</Link>
            </Button>
            <a href="#" className="hover:text-primary transition-colors">Pricing</a>
          </nav>
          <div className="flex items-center gap-3">
            <Button asChild variant="ghost" size="sm" className="hidden sm:flex rounded-full">
              <Link href="/extension-demo">Demo</Link>
            </Button>
            <Button asChild size="sm" className="bg-primary hover:bg-primary/90 rounded-full font-semibold px-4">
              <a href="#verify">Get Started</a>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero & Verifier Section */}
        <section id="verify" className="py-16 md:py-24 px-4 bg-gradient-to-b from-white to-slate-50">
          <div className="container mx-auto max-w-5xl space-y-12">
            <div className="text-center space-y-6 max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-bold animate-in fade-in slide-in-from-top-4 duration-500">
                <Zap className="h-4 w-4" />
                <span>Web-scale Factual Verification</span>
              </div>
              <h2 className="text-4xl md:text-6xl font-bold font-headline tracking-tight text-slate-900 leading-tight">
                Verify any claim in <span className="text-primary italic">seconds</span>.
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Paste any text below to analyze its factual accuracy. Our AI scans thousands of verified sources to identify potential hallucinations and misinformation.
              </p>
            </div>

            <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
              <TextVerifier />
            </div>
          </div>
        </section>

        {/* CTA to Extension */}
        <section id="how-it-works" className="py-20 px-4 border-y bg-white">
          <div className="container mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
              <div className="space-y-6">
                <h3 className="text-3xl font-bold font-headline leading-tight">
                  Want the truth <span className="text-primary">everywhere</span> you browse?
                </h3>
                <p className="text-slate-600 text-lg leading-relaxed">
                  Our Chrome extension lives where you read. Highlight any text on any website, and FactCheck AI will verify it instantly without you ever leaving the page.
                </p>
                <div className="space-y-4">
                  {[
                    "Works on any website (News, Social, Blogs)",
                    "Instant verification badges",
                    "Detailed context and corrections",
                    "Privacy-first, no tracking"
                  ].map((feature, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="bg-primary/10 p-1 rounded-full">
                        <CheckCircle className="h-4 w-4 text-primary" />
                      </div>
                      <span className="text-sm font-medium text-slate-700">{feature}</span>
                    </div>
                  ))}
                </div>
                <div className="pt-4">
                  <Button asChild size="lg" className="rounded-full gap-2 px-8 py-6 text-lg shadow-xl shadow-primary/20 hover:scale-105 transition-transform">
                    <Link href="/extension-demo">
                      Try the Extension Demo <ArrowRight className="h-5 w-5" />
                    </Link>
                  </Button>
                </div>
              </div>
              <Link href="/extension-demo" className="relative group block">
                <div className="absolute -inset-4 bg-primary/5 rounded-[2rem] blur-2xl group-hover:bg-primary/10 transition-colors" />
                <div className="relative rounded-2xl border-4 border-slate-100 bg-white shadow-2xl overflow-hidden aspect-video flex items-center justify-center p-8 group-hover:border-primary/20 transition-colors">
                  <div className="text-center space-y-4">
                    <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                      <Zap className="h-8 w-8 text-primary" />
                    </div>
                    <p className="font-bold text-slate-900">Interactive Demo Experience</p>
                    <p className="text-sm text-muted-foreground">See how the extension behaves in a real browser environment.</p>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t py-12 px-4 bg-slate-50">
        <div className="container mx-auto text-center space-y-6">
          <div className="flex items-center justify-center gap-2">
            <ShieldCheck className="h-5 w-5 text-primary" />
            <span className="font-bold font-headline">FactCheck AI</span>
          </div>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            Providing real-time factual verification tools to combat misinformation across the digital landscape.
          </p>
          <div className="pt-4 border-t text-xs text-muted-foreground">
            © {new Date().getFullYear()} FactCheck AI. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
