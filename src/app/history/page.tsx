import { ShieldCheck, ArrowLeft, History as HistoryIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { VerificationHistory } from "@/components/fact-check/history";
import Link from "next/link";

export default function HistoryPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
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
            <Link href="/extension-demo" className="hover:text-primary transition-colors text-slate-600">Extension Demo</Link>
          </nav>
          <div className="w-10 md:hidden" />
        </div>
      </header>

      <main className="flex-1 py-12 px-4">
        <div className="container mx-auto max-w-6xl space-y-12">
          <div className="space-y-4 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-bold">
              <HistoryIcon className="h-4 w-4" />
              <span>Historical Archive</span>
            </div>
            <h2 className="text-4xl font-bold font-headline tracking-tight text-slate-900">
              Verification <span className="text-primary">History</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg leading-relaxed">
              Explore your past factual checks. Our AI keeps track of every claim analyzed, providing a timeline of your journey towards digital clarity.
            </p>
          </div>

          <div className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-xl border border-slate-100">
            <VerificationHistory />
          </div>

          <div className="text-center pt-8">
            <Link href="/">
              <Button variant="outline" className="rounded-full gap-2 px-8 py-6 text-lg border-2 hover:bg-slate-50 transition-all">
                Check New Text <ArrowLeft className="h-5 w-5 rotate-180" />
              </Button>
            </Link>
          </div>
        </div>
      </main>

      <footer className="border-t py-12 px-4 bg-white mt-12">
        <div className="container mx-auto text-center space-y-4">
          <div className="flex items-center justify-center gap-2">
            <ShieldCheck className="h-5 w-5 text-primary" />
            <span className="font-bold font-headline">FactCheck AI</span>
          </div>
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} FactCheck AI. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
