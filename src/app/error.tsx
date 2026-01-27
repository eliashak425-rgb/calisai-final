"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Logo } from "@/components/ui/Logo";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center px-6 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-red-500/5 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-red-500/5 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="relative z-10 text-center max-w-lg">
        <Logo size="lg" className="justify-center mb-8" />
        
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center">
          <svg className="w-10 h-10 text-red-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/>
            <path d="M12 8v4m0 4h.01" strokeLinecap="round"/>
          </svg>
        </div>
        
        <h1 className="text-2xl font-display font-medium text-white mb-4">
          Something Went Wrong
        </h1>
        
        <p className="text-slate-400 mb-8 leading-relaxed">
          We hit an unexpected obstacle. Don&apos;t worry, your progress is safe. 
          Try refreshing the page or going back to the dashboard.
        </p>
        
        {error.digest && (
          <p className="text-xs text-slate-600 mb-6 font-mono">
            Error ID: {error.digest}
          </p>
        )}
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={reset}
            className="btn-primary flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M1 4v6h6M23 20v-6h-6" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M20.49 9A9 9 0 005.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 013.51 15" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Try Again
          </button>
          <Link
            href="/dashboard"
            className="btn-secondary flex items-center justify-center gap-2"
          >
            Go to Dashboard
          </Link>
        </div>
        
        {/* Support link */}
        <div className="mt-12 p-4 rounded-2xl bg-white/[0.02] border border-white/5">
          <p className="text-sm text-slate-500">
            If this keeps happening, please{" "}
            <a 
              href="mailto:support@calisai.com" 
              className="text-emerald-400 hover:text-emerald-300"
            >
              contact support
            </a>
            {" "}and include the error ID.
          </p>
        </div>
      </div>
    </div>
  );
}

