"use client";

import { useEffect, useRef } from "react";

const testimonials = [
  {
    name: "Marcus Johnson",
    role: "Street Workout Athlete",
    avatar: "MJ",
    avatarBg: "from-blue-500 to-blue-700",
    content: "CalisAI helped me finally unlock the muscle-up after 6 months of trying on my own. The progression system is incredibly well thought out.",
    stats: { label: "Muscle-ups", before: "0", after: "8" },
    rating: 5,
  },
  {
    name: "Sarah Chen",
    role: "CrossFit Coach",
    avatar: "SC",
    avatarBg: "from-purple-500 to-purple-700",
    content: "I use CalisAI for my own training and recommend it to all my clients. The AI really understands calisthenics progressions in a way other apps don't.",
    stats: { label: "Clients helped", before: "", after: "45+" },
    rating: 5,
  },
  {
    name: "Alex Rivera",
    role: "Beginner",
    avatar: "AR",
    avatarBg: "from-emerald-500 to-emerald-700",
    content: "As someone who couldn't do a single pull-up, this app changed everything. Now I'm working on front lever progressions!",
    stats: { label: "Pull-ups", before: "0", after: "15" },
    rating: 5,
  },
  {
    name: "Tom Williams",
    role: "Gymnast",
    avatar: "TW",
    avatarBg: "from-orange-500 to-orange-700",
    content: "The skill tree approach is exactly what I needed. Clear progressions with proper prerequisites. My planche hold time doubled in 2 months.",
    stats: { label: "Planche hold", before: "5s", after: "12s" },
    rating: 5,
  },
  {
    name: "Elena Kowalski",
    role: "Personal Trainer",
    avatar: "EK",
    avatarBg: "from-pink-500 to-pink-700",
    content: "The Coach plan is a game-changer. I can now provide personalized calisthenics programming to all my clients without spending hours on each plan.",
    stats: { label: "Hours saved/week", before: "", after: "10+" },
    rating: 5,
  },
  {
    name: "David Park",
    role: "Intermediate Athlete",
    avatar: "DP",
    avatarBg: "from-cyan-500 to-cyan-700",
    content: "What I love is how the AI adapts when I tell it I'm sore or tired. It's like having a coach who actually listens.",
    stats: { label: "Training consistency", before: "60%", after: "95%" },
    rating: 5,
  },
];

export function TestimonialsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

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
    <section ref={sectionRef} className="py-32 relative overflow-hidden">
      {/* Background accent */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-emerald-500/5 rounded-full blur-[150px] pointer-events-none" />
      
      <div className="max-w-[1400px] mx-auto px-6 mb-16 relative z-10">
        <div className="text-center max-w-2xl mx-auto">
          <span className="inline-block px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-semibold text-emerald-400 mb-6">
            Testimonials
          </span>
          <h2 className="animate-on-scroll opacity-0 text-4xl md:text-5xl text-white font-display font-medium tracking-tight mb-4">
            Athletes Love CalisAI
          </h2>
          <p className="animate-on-scroll opacity-0 text-slate-400 text-lg">
            Join thousands of athletes who have transformed their training with AI-powered guidance.
          </p>
        </div>
      </div>

      {/* Scrolling testimonials */}
      <div 
        ref={scrollRef}
        className="flex gap-6 overflow-x-auto pb-8 px-6 snap-x snap-mandatory custom-scrollbar relative z-10"
        style={{ scrollbarWidth: 'thin' }}
      >
        {testimonials.map((testimonial, index) => (
          <div
            key={testimonial.name}
            className={`animate-on-scroll opacity-0 stagger-${(index % 3) + 1} flex-shrink-0 w-[350px] md:w-[400px] snap-center`}
          >
            <div className="card-interactive p-6 h-full flex flex-col">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${testimonial.avatarBg} flex items-center justify-center text-white font-bold text-sm`}>
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="text-white font-medium">{testimonial.name}</div>
                    <div className="text-sm text-slate-500">{testimonial.role}</div>
                  </div>
                </div>
                {/* Rating */}
                <div className="flex gap-0.5">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <svg key={i} className="w-4 h-4 text-yellow-500 fill-current" viewBox="0 0 24 24">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                  ))}
                </div>
              </div>

              {/* Content */}
              <p className="text-slate-300 text-sm leading-relaxed flex-1 mb-6">
                &quot;{testimonial.content}&quot;
              </p>

              {/* Stats */}
              <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-xl p-4">
                <div className="text-xs text-slate-500 mb-2">{testimonial.stats.label}</div>
                <div className="flex items-center gap-3">
                  {testimonial.stats.before && (
                    <>
                      <span className="text-slate-500 text-lg">{testimonial.stats.before}</span>
                      <svg className="w-5 h-5 text-emerald-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M5 12h14m-7-7l7 7-7 7" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </>
                  )}
                  <span className="text-emerald-400 text-2xl font-display font-bold">{testimonial.stats.after}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

