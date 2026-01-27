"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const plans = [
  {
    id: "starter",
    name: "Starter",
    description: "Perfect for beginners",
    originalPrice: 50,
    price: 15,
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
    highlighted: false,
  },
  {
    id: "pro",
    name: "Pro",
    description: "For serious athletes",
    originalPrice: 99,
    price: 29,
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
    highlighted: true,
    badge: "MOST POPULAR",
  },
  {
    id: "elite",
    name: "Elite",
    description: "For coaches & pros",
    originalPrice: 199,
    price: 79,
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
    highlighted: false,
  },
];

export default function SubscribePage() {
  const router = useRouter();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async (planId: string) => {
    setLoading(true);
    setSelectedPlan(planId);

    try {
      // For now, create a test subscription
      // In production, this would redirect to Stripe checkout
      const response = await fetch("/api/subscription/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId }),
      });

      if (response.ok) {
        router.push("/plan");
      } else {
        const data = await response.json();
        alert(data.error || "Failed to subscribe");
      }
    } catch (error) {
      console.error("Subscription error:", error);
      alert("Failed to process subscription");
    } finally {
      setLoading(false);
      setSelectedPlan(null);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 py-12 px-4">
      {/* Background effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-emerald-500/5 rounded-full blur-[150px]" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-violet-500/5 rounded-full blur-[150px]" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium mb-6">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
            Your plan is ready!
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Unlock Your Personalized Plan
          </h1>
          <p className="text-lg text-neutral-400 max-w-2xl mx-auto">
            We&apos;ve created a custom workout plan based on your assessment. 
            Choose a plan to unlock it and start your transformation.
          </p>
        </div>

        {/* Plan Preview Teaser */}
        <div className="mb-12 p-6 rounded-2xl bg-gradient-to-br from-neutral-900 to-neutral-800 border border-neutral-700/50 max-w-md mx-auto">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-neutral-400">Your Generated Plan</span>
            <span className="px-2 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-medium">
              Ready
            </span>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-emerald-500/20 to-emerald-600/20 flex items-center justify-center">
              <svg className="w-8 h-8 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-white font-semibold">30-Day Training Program</h3>
              <p className="text-neutral-400 text-sm">Customized to your goals and fitness level</p>
            </div>
            <svg className="w-6 h-6 text-neutral-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
              <path d="M7 11V7a5 5 0 0110 0v4"/>
            </svg>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mb-12">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`rounded-3xl p-8 flex flex-col transition-all duration-300 ${
                plan.highlighted
                  ? "bg-gradient-to-b from-neutral-900 to-neutral-800 border border-emerald-500/30 relative shadow-2xl shadow-emerald-500/10 md:-translate-y-4"
                  : "bg-neutral-900 border border-neutral-800 hover:border-neutral-700"
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
                      : "bg-white/5 text-neutral-400"
                  }`}>
                    {plan.id === "starter" && (
                      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" strokeLinecap="round" strokeLinejoin="round"/>
                        <circle cx="12" cy="7" r="4"/>
                      </svg>
                    )}
                    {plan.id === "pro" && (
                      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                      </svg>
                    )}
                    {plan.id === "elite" && (
                      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" strokeLinecap="round" strokeLinejoin="round"/>
                        <circle cx="9" cy="7" r="4"/>
                        <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/>
                      </svg>
                    )}
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
                <h3 className={`text-xl font-semibold mb-1 ${plan.highlighted ? "text-emerald-400" : "text-white"}`}>
                  {plan.name}
                </h3>
                <p className="text-sm text-neutral-500">{plan.description}</p>
              </div>

              {/* Price */}
              <div className="mb-8">
                <div className="flex items-baseline gap-2">
                  <span className="text-lg text-neutral-500 line-through decoration-red-500/70 decoration-2">
                    ${plan.originalPrice}
                  </span>
                  <span className="text-4xl font-bold text-white">${plan.price}</span>
                  <span className="text-sm text-neutral-500">{plan.period}</span>
                </div>
                <p className="text-xs text-emerald-400 mt-2">
                  Save ${plan.originalPrice - plan.price}/month
                </p>
              </div>

              {/* Features */}
              <ul className="space-y-4 mb-8 flex-1">
                {plan.features.map((feature, i) => (
                  <li key={i} className={`flex items-start gap-3 text-sm ${feature.included ? "text-neutral-300" : "text-neutral-600"}`}>
                    {feature.included ? (
                      <svg className={`w-5 h-5 flex-shrink-0 mt-0.5 ${plan.highlighted ? "text-emerald-400" : "text-emerald-500"}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
                        <circle cx="12" cy="12" r="9" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5 flex-shrink-0 mt-0.5 text-neutral-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="9" />
                        <path d="M9 9l6 6M15 9l-6 6" strokeLinecap="round" />
                      </svg>
                    )}
                    {feature.text}
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <button
                onClick={() => handleSubscribe(plan.id)}
                disabled={loading}
                className={`w-full py-4 rounded-xl font-semibold text-sm transition-all duration-300 disabled:opacity-50 ${
                  plan.highlighted
                    ? "bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white shadow-lg shadow-emerald-500/25"
                    : "border border-neutral-700 text-white hover:bg-white/5 hover:border-neutral-600"
                }`}
              >
                {loading && selectedPlan === plan.id ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                    </svg>
                    Processing...
                  </span>
                ) : (
                  `Get ${plan.name}`
                )}
              </button>
            </div>
          ))}
        </div>

        {/* Trust badges */}
        <div className="flex flex-wrap justify-center items-center gap-8 text-neutral-500 text-sm">
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
              <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>30-day money back</span>
          </div>
        </div>

        {/* Back link */}
        <div className="text-center mt-8">
          <Link href="/" className="text-neutral-500 hover:text-neutral-400 text-sm">
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}

