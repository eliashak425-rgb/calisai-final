"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import Image from "next/image";

export function HeroSection() {
  const animatedRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-fade-slide-in");
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = animatedRef.current?.querySelectorAll(".animate-on-scroll");
    elements?.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <main
      ref={animatedRef}
      className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 px-6 max-w-[1400px] mx-auto grid lg:grid-cols-2 gap-16 items-center"
    >
      {/* Background Gradients */}
      <div className="absolute top-0 left-0 w-full h-[800px] bg-[radial-gradient(circle_at_50%_0%,rgba(16,185,129,0.12),transparent_60%)] pointer-events-none -z-10" />
      <div className="absolute top-20 right-0 w-[500px] h-[500px] bg-[radial-gradient(circle,rgba(16,185,129,0.08),transparent_70%)] pointer-events-none -z-10" />
      
      {/* Subtle grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:80px_80px] pointer-events-none -z-10" />

      {/* Left Content */}
      <div className="flex flex-col items-start gap-8 z-10">
        <div className="animate-on-scroll opacity-0 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-semibold text-emerald-400">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          Powered by GPT-4o • Calisthenics Specialist
        </div>

        <h1 className="animate-on-scroll opacity-0 text-5xl lg:text-7xl font-display font-medium text-white leading-[1.05] tracking-tight">
          Your AI-Powered{" "}
          <span className="gradient-text">Calisthenics</span>{" "}
          <span className="relative">
            Coach
            <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 200 12" fill="none">
              <path d="M2 10C50 4 150 4 198 10" stroke="url(#underline)" strokeWidth="3" strokeLinecap="round"/>
              <defs>
                <linearGradient id="underline" x1="0" y1="0" x2="200" y2="0">
                  <stop offset="0%" stopColor="#10b981"/>
                  <stop offset="100%" stopColor="#059669"/>
                </linearGradient>
              </defs>
            </svg>
          </span>
        </h1>

        <p className="animate-on-scroll opacity-0 text-lg lg:text-xl text-slate-400 max-w-xl font-light leading-relaxed">
          Get personalized workout plans for muscle-ups, handstands, planche, and more. 
          CalisAI learns your strengths, adapts to your recovery, and guides you to mastery.
        </p>

        <div className="animate-on-scroll opacity-0 flex flex-col sm:flex-row gap-4 mt-4 w-full sm:w-auto">
          <Link
            href="/assessment"
            className="group px-8 py-4 rounded-full bg-gradient-to-r from-emerald-500 to-emerald-600 text-white text-sm font-semibold hover:from-emerald-400 hover:to-emerald-500 transition-all shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2"
          >
            Start Assessment
            <svg
              className="w-5 h-5 group-hover:translate-x-1 transition-transform"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M5 12h14m-7-7l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
          <Link
            href="#how-it-works"
            className="px-8 py-4 rounded-full border border-white/10 text-white text-sm font-medium hover:bg-white/5 hover:border-white/20 transition-all flex items-center justify-center gap-2"
          >
            See How It Works
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <polygon points="10,8 16,12 10,16" fill="currentColor" stroke="none" />
            </svg>
          </Link>
        </div>

        {/* Social Proof */}
        <div className="animate-on-scroll opacity-0 flex items-center gap-6 mt-6">
          <div className="flex -space-x-3">
            {[
              "bg-gradient-to-br from-emerald-400 to-emerald-600",
              "bg-gradient-to-br from-blue-400 to-blue-600",
              "bg-gradient-to-br from-purple-400 to-purple-600",
              "bg-gradient-to-br from-orange-400 to-orange-600",
            ].map((bg, i) => (
              <div key={i} className={`w-10 h-10 rounded-full border-2 border-black ${bg} flex items-center justify-center text-white text-xs font-bold`}>
                {["JM", "AK", "SR", "TL"][i]}
              </div>
            ))}
            <div className="w-10 h-10 rounded-full border-2 border-black bg-slate-800 flex items-center justify-center text-white text-xs font-medium">
              +12k
            </div>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <svg key={i} className="w-4 h-4 text-yellow-500 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              ))}
              <span className="text-white text-sm font-semibold ml-1">4.9</span>
            </div>
            <span className="text-xs text-slate-500">12,000+ athletes training</span>
          </div>
        </div>
      </div>

      {/* Right Visual: Interactive Widget */}
      <div className="animate-on-scroll opacity-0 relative perspective-distant group">
        {/* Glow */}
        <div className="absolute inset-0 bg-emerald-500/20 blur-[120px] rounded-full opacity-40 group-hover:opacity-60 transition-opacity duration-700" />

        {/* Main Card */}
        <div className="relative bg-gradient-to-b from-[#0A0B0E] to-[#070809] border border-white/10 rounded-3xl p-6 shadow-2xl hover:border-emerald-500/20 transition-colors duration-500">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center text-white font-bold text-sm">
                AM
              </div>
              <div>
                <div className="text-white font-medium">Alex M.</div>
                <div className="text-xs text-slate-500">Intermediate • Week 8</div>
              </div>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs text-emerald-400 font-medium">Recovery: 94%</span>
            </div>
          </div>

          {/* Skill Progress Bars */}
          <div className="space-y-5 mb-8">
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
              <div className="flex justify-between text-sm mb-3">
                <span className="text-white font-medium flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-400 text-xs">🏋️</span>
                  Full Planche
                </span>
                <span className="text-emerald-400 font-semibold">82%</span>
              </div>
              <div className="h-2.5 w-full bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 w-[82%] rounded-full shadow-[0_0_20px_rgba(16,185,129,0.5)] relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent w-full animate-shimmer" />
                </div>
              </div>
              <div className="mt-3 flex justify-between text-xs text-slate-500">
                <span>Current: Straddle Hold 12s</span>
                <span className="text-emerald-400">Next: Full 5s</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
              <div className="flex justify-between text-sm mb-3">
                <span className="text-white font-medium flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-400 text-xs">💪</span>
                  Front Lever
                </span>
                <span className="text-slate-300 font-semibold">65%</span>
              </div>
              <div className="h-2.5 w-full bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-slate-500 to-slate-400 w-[65%] rounded-full" />
              </div>
            </div>
          </div>

          {/* Mini Chart */}
          <div className="relative h-24 w-full border-t border-white/5 pt-4 flex items-end justify-between gap-1.5">
            {[45, 65, 35, 85, 55, 30, 70].map((height, i) => (
              <div
                key={i}
                className={`w-full rounded-t transition-all duration-300 hover:opacity-100 ${
                  i === 3
                    ? "bg-gradient-to-t from-emerald-600 to-emerald-400 opacity-100"
                    : "bg-gradient-to-t from-emerald-700/50 to-emerald-500/50 opacity-60"
                }`}
                style={{ height: `${height}%` }}
              />
            ))}
          </div>
          <div className="flex justify-between text-[10px] text-slate-600 mt-2 font-mono">
            {["M", "T", "W", "T", "F", "S", "S"].map((day, i) => (
              <span key={i} className={i === 3 ? "text-emerald-400" : ""}>{day}</span>
            ))}
          </div>
        </div>

        {/* Floating Achievement Badge */}
        <div className="absolute -right-4 top-24 bg-gradient-to-br from-[#121317] to-[#0A0B0E] border border-white/10 p-4 rounded-xl shadow-2xl animate-float">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-yellow-500 to-orange-500 p-2 rounded-lg text-white">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div>
              <div className="text-[10px] text-slate-500 uppercase tracking-wide">New PR!</div>
              <div className="text-white text-sm font-semibold">Muscle-up +1</div>
            </div>
          </div>
        </div>

        {/* AI Suggestion Popup */}
        <div className="absolute -left-8 bottom-20 bg-gradient-to-br from-[#121317] to-[#0A0B0E] border border-emerald-500/20 p-4 rounded-xl shadow-2xl animate-float-delayed max-w-[200px]">
          <div className="flex items-start gap-3">
            <div className="bg-emerald-500/20 p-2 rounded-lg text-emerald-400 shrink-0">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2a10 10 0 100 20 10 10 0 000-20z" />
                <path d="M12 8v4l2 2" />
              </svg>
            </div>
            <div>
              <div className="text-xs text-emerald-400 font-medium">CalisAI Insight</div>
              <div className="text-[11px] text-slate-400 mt-1">Rest shoulders today. Push focus tomorrow.</div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
