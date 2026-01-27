"use client";

const integrations = [
  { name: "Powered by GPT-4o", icon: "🧠" },
  { name: "Apple Health", icon: "🍎" },
  { name: "Google Fit", icon: "📊" },
  { name: "Strava", icon: "🏃" },
  { name: "Whoop", icon: "⌚" },
  { name: "Oura Ring", icon: "💍" },
  { name: "Garmin", icon: "📍" },
  { name: "MyFitnessPal", icon: "🍽️" },
];

export function MarqueeSection() {
  return (
    <section className="py-16 border-y border-white/5 bg-[#030303] relative overflow-hidden">
      {/* Gradient overlays */}
      <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-[#030303] to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-[#030303] to-transparent z-10 pointer-events-none" />
      
      <div className="text-center mb-8">
        <p className="text-xs uppercase tracking-widest text-slate-600">
          Trusted by 12,000+ athletes • Integrates with your favorite apps
        </p>
      </div>
      
      <div className="flex animate-marquee whitespace-nowrap">
        {[...integrations, ...integrations].map((item, index) => (
          <div
            key={index}
            className="mx-8 flex items-center gap-3 px-6 py-3 rounded-full bg-white/[0.02] border border-white/5 hover:border-emerald-500/20 transition-colors"
          >
            <span className="text-xl">{item.icon}</span>
            <span className="text-slate-400 text-sm font-medium whitespace-nowrap">{item.name}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
