"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";

const plans = [
  {
    name: "Starter",
    description: "Perfect for beginners",
    originalPrice: "$50",
    price: "$15",
    period: "/month",
    discount: "70% OFF",
    features: [
      { text: "AI workout plan generation", included: true },
      { text: "Basic progression tracking", included: true },
      { text: "10 AI coach chats per day", included: true },
      { text: "Exercise library access", included: true },
      { text: "Email support", included: true },
      { text: "Advanced analytics", included: false },
      { text: "Video form analysis", included: false },
    ],
    cta: "Get Started",
    href: "/assessment?plan=starter",
    highlighted: false,
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="12" cy="7" r="4"/>
      </svg>
    ),
  },
  {
    name: "Pro",
    description: "For serious athletes",
    originalPrice: "$99",
    price: "$29",
    period: "/month",
    discount: "71% OFF",
    features: [
      { text: "Everything in Starter", included: true },
      { text: "Unlimited AI coach chats", included: true },
      { text: "Advanced skill progressions", included: true },
      { text: "Detailed recovery insights", included: true },
      { text: "Personalized diet guidance", included: true },
      { text: "Priority support", included: true },
      { text: "Export workout data", included: true },
    ],
    cta: "Start 7-Day Free Trial",
    href: "/assessment?plan=pro",
    highlighted: true,
    badge: "MOST POPULAR",
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
      </svg>
    ),
  },
  {
    name: "Elite",
    description: "For coaches & pros",
    originalPrice: "$199",
    price: "$79",
    period: "/month",
    discount: "60% OFF",
    features: [
      { text: "Everything in Pro", included: true },
      { text: "Manage up to 25 clients", included: true },
      { text: "White-label reports", included: true },
      { text: "Client progress dashboard", included: true },
      { text: "Bulk plan generation", included: true },
      { text: "API access", included: true },
      { text: "Dedicated support", included: true },
    ],
    cta: "Start Free Trial",
    href: "/assessment?plan=elite",
    highlighted: false,
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/>
      </svg>
    ),
  },
];

export function PricingSection() {
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
    <section ref={sectionRef} id="pricing" className="max-w-[1400px] mx-auto px-6 py-32 relative">
      {/* Background accent */}
      <div className="absolute top-1/2 right-0 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[150px] -translate-y-1/2 pointer-events-none" />
      
      <div className="text-center max-w-2xl mx-auto mb-16 relative z-10">
        <span className="inline-block px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-semibold text-emerald-400 mb-6">
          Limited Time Offer
        </span>
        <h2 className="animate-on-scroll opacity-0 text-4xl md:text-5xl text-white font-display font-medium tracking-tight mb-4">
          Invest in Your Training
        </h2>
        <p className="animate-on-scroll opacity-0 text-slate-400 text-lg">
          Lock in these special launch prices. Cancel anytime, no questions asked.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 relative z-10">
        {plans.map((plan, index) => (
          <div
            key={plan.name}
            className={`animate-on-scroll opacity-0 stagger-${index + 1} rounded-3xl p-8 flex flex-col transition-all duration-300 ${
              plan.highlighted
                ? "bg-gradient-to-b from-[#121317] to-[#0A0B0E] border border-emerald-500/30 relative shadow-2xl shadow-emerald-500/10 md:-translate-y-4 hover:shadow-emerald-500/20"
                : "bg-[#0A0B0E] border border-white/10 hover:border-white/20 hover:bg-[#0D0E12]"
            }`}
          >
            {plan.highlighted && (
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-400 rounded-t-3xl" />
            )}

            {/* Header */}
            <div className="mb-6">
              <div className="flex justify-between items-start mb-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  plan.highlighted 
                    ? "bg-emerald-500/20 text-emerald-400" 
                    : "bg-white/5 text-slate-400"
                }`}>
                  {plan.icon}
                </div>
                <div className="flex flex-col items-end gap-1">
                  {plan.badge && (
                    <span className="text-[10px] font-bold tracking-wider bg-gradient-to-r from-emerald-500 to-teal-400 text-black px-3 py-1 rounded-full">
                      {plan.badge}
                    </span>
                  )}
                  <span className="text-[10px] font-bold tracking-wider bg-red-500/20 text-red-400 px-2 py-0.5 rounded-full border border-red-500/30">
                    {plan.discount}
                  </span>
                </div>
              </div>
              <h3 className={`text-xl font-display font-semibold mb-1 ${plan.highlighted ? "text-emerald-400" : "text-white"}`}>
                {plan.name}
              </h3>
              <p className="text-sm text-slate-500">{plan.description}</p>
            </div>

            {/* Price */}
            <div className="mb-8">
              <div className="flex items-baseline gap-2">
                <span className="text-lg text-slate-500 line-through decoration-red-500/70 decoration-2">
                  {plan.originalPrice}
                </span>
                <span className="text-4xl font-display font-bold text-white">{plan.price}</span>
                <span className="text-sm text-slate-500">{plan.period}</span>
              </div>
              <p className="text-xs text-emerald-400 mt-2">
                Save {plan.originalPrice.replace('$', '')} - {plan.price.replace('$', '')} = ${parseInt(plan.originalPrice.replace('$', '')) - parseInt(plan.price.replace('$', ''))}/month
              </p>
            </div>

            {/* Features */}
            <ul className="space-y-4 mb-8 flex-1">
              {plan.features.map((feature, i) => (
                <li key={i} className={`flex items-start gap-3 text-sm ${feature.included ? "text-slate-300" : "text-slate-600"}`}>
                  {feature.included ? (
                    <svg className={`w-5 h-5 flex-shrink-0 mt-0.5 ${plan.highlighted ? "text-emerald-400" : "text-emerald-500"}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
                      <circle cx="12" cy="12" r="9" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5 flex-shrink-0 mt-0.5 text-slate-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="9" />
                      <path d="M9 9l6 6M15 9l-6 6" strokeLinecap="round" />
                    </svg>
                  )}
                  {feature.text}
                </li>
              ))}
            </ul>

            {/* CTA */}
            <Link
              href={plan.href}
              className={`w-full py-4 rounded-xl font-semibold text-sm transition-all duration-300 text-center block ${
                plan.highlighted
                  ? "bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white shadow-lg shadow-emerald-500/25 hover:shadow-xl hover:shadow-emerald-500/30"
                  : "border border-white/10 text-white hover:bg-white/5 hover:border-white/20"
              }`}
            >
              {plan.cta}
            </Link>
          </div>
        ))}
      </div>

      {/* Trust badges */}
      <div className="flex flex-wrap justify-center items-center gap-8 mt-16 text-slate-500 text-sm">
        <div className="flex items-center gap-2">
          <svg className="w-5 h-5 text-emerald-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
          </svg>
          <span>Secure payments</span>
        </div>
        <div className="flex items-center gap-2">
          <svg className="w-5 h-5 text-emerald-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span>Cancel anytime</span>
        </div>
        <div className="flex items-center gap-2">
          <svg className="w-5 h-5 text-emerald-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"/>
          </svg>
          <span>PayPal accepted</span>
        </div>
        <div className="flex items-center gap-2">
          <svg className="w-5 h-5 text-emerald-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span>Limited time pricing</span>
        </div>
      </div>
    </section>
  );
}
