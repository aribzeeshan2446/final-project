import { MockBrowser } from "@/components/fact-check/mock-browser";
import { ShieldCheck, Zap, Globe, MessageSquare, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function ExtensionDemoPage() {
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
            <Link href="/" className="hover:text-primary transition-colors flex items-center gap-1.5 text-slate-600">
              <ArrowLeft className="h-4 w-4" /> Back to Verifier
            </Link>
          </nav>
          <Button size="sm" className="bg-primary hover:bg-primary/90 rounded-full font-semibold px-4">
            Add to Chrome
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="py-12 px-4 text-center space-y-6 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-bold">
            <Zap className="h-4 w-4" />
            <span>Interactive Extension Experience</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-bold font-headline tracking-tight text-slate-900 leading-tight">
            The Extension <span className="text-primary italic">Demo</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Select any text in our simulated browser window below to trigger the FactCheck AI verification badge, just like it would appear in Chrome.
          </p>
        </section>

        {/* Demo Section */}
        <section className="bg-slate-50 border-y py-12 md:py-20 px-4 overflow-hidden">
          <div className="container mx-auto space-y-12">
            <MockBrowser />
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 px-4">
          <div className="container mx-auto grid md:grid-cols-3 gap-12 max-w-6xl">
            <div className="space-y-4">
              <div className="bg-primary/10 p-3 w-fit rounded-2xl">
                <Globe className="h-6 w-6 text-primary" />
              </div>
              <h4 className="text-xl font-bold font-headline">Zero Friction</h4>
              <p className="text-muted-foreground leading-relaxed">
                No need to copy and paste. Highlight text and get results instantly without breaking your reading flow.
              </p>
            </div>
            <div className="space-y-4">
              <div className="bg-primary/10 p-3 w-fit rounded-2xl">
                <ShieldCheck className="h-6 w-6 text-primary" />
              </div>
              <h4 className="text-xl font-bold font-headline">Smart Detection</h4>
              <p className="text-muted-foreground leading-relaxed">
                Automatically identifies claims, statistics, and dates that require factual backing.
              </p>
            </div>
            <div className="space-y-4">
              <div className="bg-primary/10 p-3 w-fit rounded-2xl">
                <MessageSquare className="h-6 w-6 text-primary" />
              </div>
              <h4 className="text-xl font-bold font-headline">Deep Insights</h4>
              <p className="text-muted-foreground leading-relaxed">
                Get full transparency with source citations and reasoning behind every verdict.
              </p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-primary text-white py-20 px-4">
          <div className="container mx-auto text-center space-y-8 max-w-3xl">
            <h3 className="text-4xl font-bold font-headline leading-tight">
              Protect your browser today.
            </h3>
            <p className="text-primary-foreground/90 text-xl">
              Install the extension and never guess if a claim is a hallucination again.
            </p>
            <div className="flex justify-center">
              <Button size="lg" className="bg-white text-primary hover:bg-white/90 rounded-full px-10 py-7 text-xl font-bold shadow-2xl transition-all hover:scale-105">
                Install for Chrome
              </Button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t py-12 px-4 bg-slate-50">
        <div className="container mx-auto text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} FactCheck AI. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
