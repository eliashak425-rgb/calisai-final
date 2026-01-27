"use client";

import { useEffect, useRef, useState } from "react";

const faqs = [
  {
    question: "What makes CalisAI different from other workout apps?",
    answer: "CalisAI is specifically designed for calisthenics and bodyweight training. Unlike generic fitness apps, we understand skill progressions (like working toward a muscle-up or planche), proper prerequisites, and how to program around equipment limitations. Our AI is trained on calisthenics-specific knowledge and adapts your plan based on your recovery and progress."
  },
  {
    question: "How does the AI generate personalized plans?",
    answer: "Our AI uses GPT-4o with structured output to analyze your assessment data (experience level, goals, available equipment, injury history) and generates a scientifically-backed workout plan. It considers push/pull balance, recovery needs, and progressive overload principles specific to calisthenics movements."
  },
  {
    question: "I'm a complete beginner. Is CalisAI right for me?",
    answer: "Absolutely! CalisAI is designed for all levels. If you're just starting, the AI will create a foundational program focusing on basic movements like push-ups, rows, and planks. As you progress, it will gradually introduce more advanced skills. Every exercise includes regressions if something is too difficult."
  },
  {
    question: "Can CalisAI help me achieve specific skills like muscle-ups or handstands?",
    answer: "Yes! Skill acquisition is our specialty. CalisAI breaks down complex movements into prerequisite skills, tracks your progress on each, and tells you when you're ready to attempt the full skill. Our skill tree system shows exactly what you need to unlock each advanced movement."
  },
  {
    question: "What if I have injuries or limitations?",
    answer: "During the assessment, you'll indicate any pain areas or injuries. CalisAI automatically excludes exercises that could aggravate these issues and suggests safe alternatives. For example, if you have wrist pain, it will avoid exercises with heavy wrist loading and suggest modifications."
  },
  {
    question: "Can I cancel my subscription anytime?",
    answer: "Yes, you can cancel your subscription at any time with no questions asked. You'll continue to have access until the end of your billing period. We use PayPal for secure payment processing."
  },
  {
    question: "Does CalisAI provide diet and nutrition advice?",
    answer: "Our Pro plan includes personalized diet guidance to support your training goals. However, we focus on general nutritional principles for athletic performance. For specific medical dietary needs, we recommend consulting a registered dietitian. We include disclaimers and always encourage professional consultation."
  },
  {
    question: "How often is my workout plan updated?",
    answer: "Your plan adapts continuously based on your logged workouts. When you mark exercises as complete and rate your difficulty, CalisAI adjusts future sessions accordingly. You can also regenerate your entire plan anytime with new constraints (like less time available or new equipment)."
  },
];

export function FAQSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [openIndex, setOpenIndex] = useState<number | null>(0);

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
    <section ref={sectionRef} id="faq" className="max-w-[1400px] mx-auto px-6 py-32">
      <div className="grid lg:grid-cols-2 gap-16 items-start">
        {/* Left side - Header */}
        <div className="lg:sticky lg:top-32">
          <span className="inline-block px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-semibold text-emerald-400 mb-6">
            FAQ
          </span>
          <h2 className="animate-on-scroll opacity-0 text-4xl md:text-5xl text-white font-display font-medium tracking-tight mb-4">
            Frequently Asked Questions
          </h2>
          <p className="animate-on-scroll opacity-0 text-slate-400 text-lg mb-8">
            Everything you need to know about CalisAI and how it can help you master calisthenics.
          </p>
          
          <div className="animate-on-scroll opacity-0 p-6 rounded-2xl bg-gradient-to-br from-emerald-500/10 to-transparent border border-emerald-500/20">
            <h3 className="text-white font-medium mb-2">Still have questions?</h3>
            <p className="text-sm text-slate-400 mb-4">Can&apos;t find the answer you&apos;re looking for? Our support team is here to help.</p>
            <a href="mailto:support@calisai.com" className="btn-primary inline-flex items-center gap-2 text-sm">
              Contact Support
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14m-7-7l7 7-7 7" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </a>
          </div>
        </div>

        {/* Right side - Accordion */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className={`animate-on-scroll opacity-0 stagger-${(index % 4) + 1} rounded-2xl border transition-all duration-300 overflow-hidden ${
                openIndex === index 
                  ? "bg-white/[0.03] border-emerald-500/30" 
                  : "bg-white/[0.01] border-white/5 hover:border-white/10"
              }`}
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full p-6 text-left flex items-start justify-between gap-4"
              >
                <span className={`font-medium transition-colors ${openIndex === index ? "text-white" : "text-slate-300"}`}>
                  {faq.question}
                </span>
                <span className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                  openIndex === index 
                    ? "bg-emerald-500 text-black rotate-180" 
                    : "bg-white/5 text-slate-400"
                }`}>
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </span>
              </button>
              
              <div className={`overflow-hidden transition-all duration-300 ${openIndex === index ? "max-h-96" : "max-h-0"}`}>
                <div className="px-6 pb-6 text-sm text-slate-400 leading-relaxed">
                  {faq.answer}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

