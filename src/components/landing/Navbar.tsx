"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { Logo } from "@/components/ui/Logo";

export function Navbar() {
  const { data: session, status } = useSession();
  const isLoading = status === "loading";

  return (
    <div className="fixed top-0 left-0 right-0 z-50 flex justify-center px-4 pt-4">
      <nav className="glass-panel rounded-full px-2 py-2 flex items-center justify-between gap-8 max-w-5xl w-full">
        <Link href="/" className="pl-3">
          <Logo size="sm" />
        </Link>

        <div className="hidden md:flex items-center gap-6 text-sm font-medium">
          <Link href="#features" className="text-white hover:text-emerald-400 transition-colors">
            Features
          </Link>
          <Link href="#how-it-works" className="text-slate-400 hover:text-white transition-colors">
            How It Works
          </Link>
          <Link href="#pricing" className="text-slate-400 hover:text-white transition-colors">
            Pricing
          </Link>
          <Link href="#faq" className="text-slate-400 hover:text-white transition-colors">
            FAQ
          </Link>
        </div>

        <div className="flex items-center gap-2 pr-1">
          {isLoading ? (
            <div className="px-5 py-2.5 rounded-full bg-white/10 text-transparent text-xs font-semibold animate-pulse">
              Loading...
            </div>
          ) : session ? (
            <Link
              href="/dashboard"
              className="px-5 py-2.5 rounded-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white text-xs font-semibold transition-all shadow-lg shadow-emerald-500/25 flex items-center gap-2"
            >
              Dashboard
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14m-7-7l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors"
              >
                Log In
              </Link>
              <Link
                href="/assessment"
                className="px-5 py-2.5 rounded-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white text-xs font-semibold transition-all shadow-lg shadow-emerald-500/25 flex items-center gap-2"
              >
                Start Assessment
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14m-7-7l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
            </>
          )}
        </div>
      </nav>
    </div>
  );
}
