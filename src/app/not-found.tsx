import Link from "next/link";
import { Logo } from "@/components/ui/Logo";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center px-6 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="relative z-10 text-center max-w-lg">
        <Logo size="lg" className="justify-center mb-8" />
        
        <div className="relative mb-8">
          <span className="text-[180px] font-display font-bold text-white/5 leading-none select-none">
            404
          </span>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-6xl font-display font-bold gradient-text">
              Oops!
            </span>
          </div>
        </div>
        
        <h1 className="text-2xl font-display font-medium text-white mb-4">
          Page Not Found
        </h1>
        
        <p className="text-slate-400 mb-8 leading-relaxed">
          Looks like this page went on a rest day. The page you&apos;re looking for 
          doesn&apos;t exist or has been moved.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="btn-primary flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Go Home
          </Link>
          <Link
            href="/dashboard"
            className="btn-secondary flex items-center justify-center gap-2"
          >
            Dashboard
          </Link>
        </div>
        
        {/* Fun fitness tip */}
        <div className="mt-12 p-4 rounded-2xl bg-white/[0.02] border border-white/5">
          <p className="text-sm text-slate-500">
            💡 <span className="text-slate-400">Pro tip:</span> While you&apos;re here, 
            try holding a plank for 30 seconds!
          </p>
        </div>
      </div>
    </div>
  );
}

