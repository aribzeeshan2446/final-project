import { MockBrowser } from "@/components/fact-check/mock-browser";
import { ShieldCheck, Zap, Globe, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b bg-white sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-primary p-1.5 rounded-lg shadow-sm">
              <ShieldCheck className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-xl font-bold font-headline tracking-tight">
              FactCheck <span className="text-primary">AI</span>
            </h1>
          </div>
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
            <a href="#" className="hover:text-primary transition-colors">How it works</a>
            <a href="#" className="hover:text-primary transition-colors">Privacy</a>
            <a href="#" className="hover:text-primary transition-colors">Support</a>
          </nav>
          <Button size="sm" className="bg-primary hover:bg-primary/90 rounded-full font-semibold">
            Add to Chrome
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="py-20 px-4 text-center space-y-6 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-bold animate-in fade-in slide-in-from-top-4 duration-500">
            <Zap className="h-4 w-4" />
            <span>Introducing Version 2.0</span>
          </div>
          <h2 className="text-5xl md:text-7xl font-bold font-headline tracking-tight text-slate-900 leading-[1.1]">
            Truth at the <span className="text-primary italic">click</span> of a button.
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            The lightweight browser extension that instantly verifies web text using advanced generative AI. Stop misinformation before it spreads.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-white rounded-full px-8 py-6 text-lg font-bold shadow-xl shadow-primary/20 transition-all hover:scale-105 active:scale-95">
              Install Chrome Extension
            </Button>
            <Button size="lg" variant="outline" className="rounded-full px-8 py-6 text-lg font-bold border-2">
              Learn More
            </Button>
          </div>
        </section>

        {/* Demo Section */}
        <section className="bg-slate-50 border-y py-24 px-4 overflow-hidden">
          <div className="container mx-auto space-y-16">
            <div className="text-center space-y-4 max-w-2xl mx-auto">
              <h3 className="text-3xl font-bold font-headline">Interactive Demo</h3>
              <p className="text-muted-foreground">
                Experience FactCheck AI directly below. Select any text in our simulated browser window to trigger a factual accuracy check.
              </p>
            </div>
            <MockBrowser />
          </div>
        </section>

        {/* Features Section */}
        <section className="py-24 px-4">
          <div className="container mx-auto grid md:grid-cols-3 gap-12">
            <div className="space-y-4">
              <div className="bg-primary/10 p-3 w-fit rounded-2xl">
                <Globe className="h-6 w-6 text-primary" />
              </div>
              <h4 className="text-xl font-bold font-headline">Seamless Integration</h4>
              <p className="text-muted-foreground leading-relaxed">
                Works quietly in the background. Just highlight text on any website to see the verification badge appear instantly.
              </p>
            </div>
            <div className="space-y-4">
              <div className="bg-primary/10 p-3 w-fit rounded-2xl">
                <ShieldCheck className="h-6 w-6 text-primary" />
              </div>
              <h4 className="text-xl font-bold font-headline">Reliable Verdicts</h4>
              <p className="text-muted-foreground leading-relaxed">
                Our AI compares information against thousands of verified sources to give you a clear, honest verdict.
              </p>
            </div>
            <div className="space-y-4">
              <div className="bg-primary/10 p-3 w-fit rounded-2xl">
                <MessageSquare className="h-6 w-6 text-primary" />
              </div>
              <h4 className="text-xl font-bold font-headline">Deep Context</h4>
              <p className="text-muted-foreground leading-relaxed">
                Don't just know if it's wrong—know why. We provide suggested corrections and additional context for misleading claims.
              </p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-primary text-white py-20 px-4">
          <div className="container mx-auto text-center space-y-8 max-w-3xl">
            <h3 className="text-4xl font-bold font-headline leading-tight">
              Ready to verify the web?
            </h3>
            <p className="text-primary-foreground/90 text-xl">
              Join 50,000+ users who trust FactCheck AI to keep their digital world honest.
            </p>
            <div className="flex justify-center">
              <Button size="lg" className="bg-white text-primary hover:bg-white/90 rounded-full px-10 py-7 text-xl font-bold shadow-2xl transition-all hover:scale-105">
                Get Started for Free
              </Button>
            </div>
            <p className="text-sm text-primary-foreground/70">
              No credit card required. Free for personal use.
            </p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t py-12 px-4 bg-slate-50">
        <div className="container mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1 space-y-4">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-primary" />
              <span className="font-bold font-headline">FactCheck AI</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Combatting misinformation through transparent, AI-driven factual verification.
            </p>
          </div>
          <div>
            <h5 className="font-bold text-sm mb-4">Product</h5>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-primary transition-colors">Features</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Pricing</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Chrome Store</a></li>
            </ul>
          </div>
          <div>
            <h5 className="font-bold text-sm mb-4">Company</h5>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-primary transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Terms of Service</a></li>
            </ul>
          </div>
          <div>
            <h5 className="font-bold text-sm mb-4">Support</h5>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-primary transition-colors">Help Center</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Contact Us</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Status</a></li>
            </ul>
          </div>
        </div>
        <div className="container mx-auto mt-12 pt-8 border-t text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} FactCheck AI. All rights reserved.
        </div>
      </footer>
    </div>
  );
}