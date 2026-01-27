"use client";

import { useEffect, useRef } from "react";

export function FeaturesSection() {
  const sectionRef = useRef<HTMLElement>(null);

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

    const elements = sectionRef.current?.querySelectorAll(".animate-on-scroll");
    elements?.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} id="features" className="max-w-[1400px] mx-auto px-6 py-32 relative">
      {/* Background accent */}
      <div className="absolute top-1/2 left-0 w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-[150px] -translate-y-1/2 pointer-events-none" />
      
      <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-6 relative z-10">
        <div className="max-w-2xl">
          <span className="inline-block px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-semibold text-emerald-400 mb-6">
            Powerful Features
          </span>
          <h2 className="animate-on-scroll opacity-0 text-3xl md:text-5xl text-white font-display font-medium tracking-tight mb-6">
            AI-Powered <span className="gradient-text">Calisthenics</span> Training
          </h2>
          <p className="animate-on-scroll opacity-0 text-slate-400 text-lg font-light">
            CalisAI analyzes your performance, adapts to your recovery, and builds 
            progressive overload plans specifically for bodyweight mastery.
          </p>
        </div>
        <a 
          href="#pricing"
          className="animate-on-scroll opacity-0 btn-secondary whitespace-nowrap"
        >
          View Pricing
        </a>
      </div>

      {/* BENTO GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 relative z-10">
        {/* Feature 1: AI Coach Analysis */}
        <div className="animate-on-scroll opacity-0 stagger-1 lg:col-span-2 card-interactive card-glow p-1 overflow-hidden group">
          <div className="bg-gradient-to-br from-[#121317] to-[#0A0B0E] rounded-[20px] h-full p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-emerald-500/10 blur-[80px] rounded-full pointer-events-none" />

            <div className="flex items-center gap-3 mb-6">
              <div className="w-3 h-3 rounded-full bg-red-500/50" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
              <div className="w-3 h-3 rounded-full bg-green-500/50" />
              <span className="ml-2 text-xs text-slate-500 font-mono">
                calisai_coach.py
              </span>
            </div>

            <div className="font-mono text-xs md:text-sm leading-relaxed text-slate-400 space-y-2">
              <div className="flex gap-2">
                <span className="text-emerald-500">$</span>
                <span>Analyzing training session...</span>
              </div>
              <div className="flex gap-2">
                <span className="text-emerald-500">$</span>
                <span>
                  Exercise: <span className="text-white">Muscle-Up Progression</span>
                </span>
              </div>
              <div className="flex gap-2">
                <span className="text-emerald-500">$</span>
                <span>
                  Current Level: <span className="text-emerald-400">High Pull-ups (8 reps)</span>
                </span>
              </div>
              <div className="flex gap-2">
                <span className="text-emerald-500">$</span>
                <span>
                  Recovery Status: <span className="text-green-400">94% Ready</span>
                </span>
              </div>
              <div className="flex gap-2 mt-4 pl-4 border-l-2 border-emerald-500/50">
                <span className="text-emerald-400">CalisAI:</span>
                <span className="text-white">
                  Ready for explosive pull-up negatives. Target: 5x3 with 4s eccentric.
                </span>
              </div>
              <div className="flex gap-2 animate-pulse">
                <span className="text-emerald-500">$</span>
                <span className="w-2 h-4 bg-emerald-500" />
              </div>
            </div>
          </div>
        </div>

        {/* Feature 2: Recovery Tracking */}
        <div className="animate-on-scroll opacity-0 stagger-2 card-interactive card-glow p-8 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/60 z-10" />
          <div className="relative z-20 h-full flex flex-col justify-between">
            <div className="w-14 h-14 bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 rounded-2xl flex items-center justify-center text-emerald-400 mb-4 border border-emerald-500/20">
              <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div>
              <h3 className="text-xl text-white font-display font-medium mb-2">Smart Recovery</h3>
              <p className="text-sm text-slate-400 font-light leading-relaxed">
                Track muscle group fatigue and optimize rest days based on your training intensity and volume.
              </p>
            </div>
            {/* Recovery Visualization */}
            <div className="mt-6 space-y-3">
              <div className="flex items-center gap-3">
                <span className="text-xs text-slate-500 w-16">Chest</span>
                <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full w-[90%] bg-gradient-to-r from-green-500 to-emerald-400 rounded-full" />
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-slate-500 w-16">Back</span>
                <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full w-[65%] bg-gradient-to-r from-yellow-500 to-orange-400 rounded-full" />
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-slate-500 w-16">Shoulders</span>
                <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full w-[30%] bg-gradient-to-r from-red-500 to-red-400 rounded-full" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Feature 3: Progress Analytics */}
        <div className="animate-on-scroll opacity-0 stagger-3 card-interactive card-glow p-8 relative overflow-hidden group">
          <div className="flex justify-between items-start mb-6">
            <h3 className="text-lg text-white font-display font-medium">Strength Progress</h3>
            <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
              +18.5%
            </span>
          </div>

          {/* Chart simulation */}
          <div className="relative h-40 w-full">
            <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 300 100">
              {/* Grid lines */}
              <path d="M0,25 L300,25" fill="none" stroke="#1f2937" strokeWidth="1" opacity="0.3" />
              <path d="M0,50 L300,50" fill="none" stroke="#1f2937" strokeWidth="1" opacity="0.3" />
              <path d="M0,75 L300,75" fill="none" stroke="#1f2937" strokeWidth="1" opacity="0.3" />
              
              {/* Trend line */}
              <path
                d="M0,85 C30,80 60,75 90,65 C120,55 150,50 180,35 C210,25 240,20 270,15 L300,10"
                fill="none"
                stroke="url(#gradient)"
                strokeWidth="3"
                strokeLinecap="round"
              />
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#059669" />
                  <stop offset="100%" stopColor="#10b981" />
                </linearGradient>
              </defs>
              
              {/* Glow effect */}
              <path
                d="M0,85 C30,80 60,75 90,65 C120,55 150,50 180,35 C210,25 240,20 270,15 L300,10"
                fill="none"
                stroke="#10b981"
                strokeWidth="6"
                strokeLinecap="round"
                opacity="0.2"
                filter="blur(4px)"
              />
              
              {/* Current point */}
              <circle cx="270" cy="15" r="6" fill="#10b981" className="animate-pulse" />
              <circle cx="270" cy="15" r="4" fill="#10b981" />
            </svg>
          </div>
          <p className="text-sm text-slate-500 mt-4">
            Track your progression on pull-ups, dips, and advanced holds over time.
          </p>
        </div>

        {/* Feature 4: Skill Progression Trees */}
        <div className="animate-on-scroll opacity-0 stagger-4 lg:col-span-2 card-interactive card-glow p-8 relative overflow-hidden">
          <div className="flex flex-col md:flex-row gap-8 items-center h-full">
            <div className="flex-1">
              <span className="inline-block px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs font-medium text-blue-400 mb-4">
                Skill Paths
              </span>
              <h3 className="text-2xl text-white font-display font-medium mb-4">Progressive Skill Trees</h3>
              <ul className="space-y-4">
                <li className="flex items-center gap-3 text-slate-300">
                  <div className="w-6 h-6 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                    <svg className="w-4 h-4 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  Unlock muscle-ups, planches, and handstands
                </li>
                <li className="flex items-center gap-3 text-slate-300">
                  <div className="w-6 h-6 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                    <svg className="w-4 h-4 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  Prerequisite checking (strength + mobility)
                </li>
                <li className="flex items-center gap-3 text-slate-300">
                  <div className="w-6 h-6 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                    <svg className="w-4 h-4 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  Regression options for every skill level
                </li>
              </ul>
            </div>

            {/* Skill Tree Visualization */}
            <div className="flex-1 w-full h-56 relative border border-white/5 rounded-2xl bg-gradient-to-br from-white/[0.02] to-transparent p-6">
              <div className="flex items-center justify-center gap-6 h-full">
                {/* Completed Node */}
                <div className="flex flex-col items-center gap-3">
                  <div className="w-16 h-16 rounded-2xl border-2 border-emerald-500 bg-emerald-500/20 flex items-center justify-center text-white text-xs font-semibold shadow-lg shadow-emerald-500/20">
                    <svg className="w-6 h-6 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <span className="text-xs text-slate-400">Tuck FL</span>
                </div>
                
                {/* Connector */}
                <div className="h-0.5 w-12 bg-gradient-to-r from-emerald-500 to-emerald-500/50" />
                
                {/* Current Node */}
                <div className="flex flex-col items-center gap-3">
                  <div className="w-20 h-20 rounded-2xl border-2 border-emerald-400 bg-emerald-500/10 flex flex-col items-center justify-center text-white shadow-xl shadow-emerald-500/30 animate-glow">
                    <span className="text-xs font-bold">ADV</span>
                    <span className="text-[10px] text-emerald-400">In Progress</span>
                  </div>
                  <span className="text-xs text-white font-medium">Adv. Tuck</span>
                </div>
                
                {/* Connector */}
                <div className="h-0.5 w-12 bg-gradient-to-r from-slate-700/50 to-slate-700" />
                
                {/* Locked Node */}
                <div className="flex flex-col items-center gap-3 opacity-50">
                  <div className="w-16 h-16 rounded-2xl border-2 border-slate-700 bg-slate-800/50 flex items-center justify-center text-slate-500">
                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                      <path d="M7 11V7a5 5 0 0110 0v4" />
                    </svg>
                  </div>
                  <span className="text-xs text-slate-500">Full FL</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
