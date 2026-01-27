"use client";

import { useEffect, useRef } from "react";

const steps = [
  {
    number: "01",
    title: "Take the Assessment",
    description: "Answer questions about your experience, goals, equipment, and any injuries. CalisAI builds your unique training profile.",
    icon: (
      <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M9 14l2 2 4-4" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    visual: (
      <div className="space-y-3">
        <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-400 text-sm">1</div>
          <span className="text-sm text-slate-300">Training experience?</span>
          <span className="ml-auto text-xs text-emerald-400 px-2 py-1 bg-emerald-500/10 rounded-full">Intermediate</span>
        </div>
        <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-400 text-sm">2</div>
          <span className="text-sm text-slate-300">Weekly availability?</span>
          <span className="ml-auto text-xs text-emerald-400 px-2 py-1 bg-emerald-500/10 rounded-full">4 days</span>
        </div>
        <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5 opacity-60">
          <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-slate-500 text-sm">3</div>
          <span className="text-sm text-slate-500">Available equipment...</span>
        </div>
      </div>
    ),
  },
  {
    number: "02",
    title: "Get Your AI Plan",
    description: "Our GPT-4o powered engine creates a personalized workout plan with progressions, regressions, and recovery protocols.",
    icon: (
      <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    visual: (
      <div className="relative">
        <div className="absolute inset-0 bg-emerald-500/20 blur-[40px] rounded-full" />
        <div className="relative bg-[#0A0B0E] border border-emerald-500/30 rounded-2xl p-4 space-y-3">
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Generating your plan...
          </div>
          <div className="text-sm text-white font-medium">Week 1: Foundation</div>
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-slate-400">Day 1: Push Focus</span>
              <span className="text-emerald-400">5 exercises</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-slate-400">Day 2: Pull Focus</span>
              <span className="text-emerald-400">5 exercises</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-slate-400">Day 3: Skill Work</span>
              <span className="text-emerald-400">4 exercises</span>
            </div>
          </div>
        </div>
      </div>
    ),
  },
  {
    number: "03",
    title: "Train & Track",
    description: "Log your workouts, track your PRs, and watch your skills improve. CalisAI adapts your plan based on your progress.",
    icon: (
      <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    visual: (
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <div className="text-3xl font-display font-bold text-white">12</div>
          <div>
            <div className="text-xs text-slate-500">Pull-ups</div>
            <div className="text-emerald-400 text-xs flex items-center gap-1">
              <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 15l7-7 7 7" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              +3 this week
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-3xl font-display font-bold text-white">25s</div>
          <div>
            <div className="text-xs text-slate-500">Planche Hold</div>
            <div className="text-emerald-400 text-xs flex items-center gap-1">
              <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 15l7-7 7 7" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              +8s this month
            </div>
          </div>
        </div>
        <div className="h-12 flex items-end gap-1">
          {[30, 45, 35, 60, 55, 75, 80].map((h, i) => (
            <div 
              key={i} 
              className={`flex-1 rounded-t transition-all ${i === 6 ? 'bg-emerald-500' : 'bg-emerald-500/30'}`}
              style={{ height: `${h}%` }}
            />
          ))}
        </div>
      </div>
    ),
  },
];

export function HowItWorksSection() {
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
    <section ref={sectionRef} id="how-it-works" className="max-w-[1400px] mx-auto px-6 py-32 relative">
      {/* Background */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:60px_60px] pointer-events-none" />
      
      <div className="text-center max-w-2xl mx-auto mb-20 relative z-10">
        <span className="inline-block px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-semibold text-emerald-400 mb-6">
          How It Works
        </span>
        <h2 className="animate-on-scroll opacity-0 text-4xl md:text-5xl text-white font-display font-medium tracking-tight mb-4">
          Start Training in Minutes
        </h2>
        <p className="animate-on-scroll opacity-0 text-slate-400 text-lg">
          Three simple steps to unlock your calisthenics potential with AI guidance.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">
        {steps.map((step, index) => (
          <div
            key={step.number}
            className={`animate-on-scroll opacity-0 stagger-${index + 1} relative`}
          >
            {/* Connector line */}
            {index < steps.length - 1 && (
              <div className="hidden lg:block absolute top-16 left-full w-full h-0.5 bg-gradient-to-r from-emerald-500/50 to-transparent z-0" />
            )}
            
            <div className="card-interactive p-8 h-full relative z-10">
              {/* Step number */}
              <div className="absolute -top-4 -left-4 w-10 h-10 rounded-full bg-emerald-500 text-black font-display font-bold text-sm flex items-center justify-center shadow-lg shadow-emerald-500/30">
                {step.number}
              </div>
              
              {/* Icon */}
              <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-6">
                {step.icon}
              </div>
              
              {/* Content */}
              <h3 className="text-xl text-white font-display font-semibold mb-3">{step.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed mb-6">{step.description}</p>
              
              {/* Visual */}
              <div className="bg-[#0A0B0E] rounded-xl p-4 border border-white/5">
                {step.visual}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

