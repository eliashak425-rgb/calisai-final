"use client";

import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { Logo } from "@/components/ui/Logo";

const PRICING_TIERS = [
  {
    id: "free",
    name: "Free Trial",
    price: 0,
    description: "Try it out",
    features: [
      "Week 1 preview",
      "5 AI messages/day",
      "Basic exercises",
    ],
    cta: "Start Free",
    popular: false,
  },
  {
    id: "starter",
    name: "Starter",
    price: 15,
    originalPrice: 50,
    description: "Most popular",
    features: [
      "Full 4-week plan",
      "50 AI messages/day",
      "Weekly plan updates",
      "Progress tracking",
      "All exercises",
    ],
    cta: "Get Started",
    popular: true,
  },
  {
    id: "pro",
    name: "Pro",
    price: 29,
    originalPrice: 80,
    description: "For serious athletes",
    features: [
      "Everything in Starter",
      "Unlimited AI chat",
      "Unlimited updates",
      "Diet guidance",
      "Priority support",
    ],
    cta: "Go Pro",
    popular: false,
  },
];

export default function PaywallPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState<string | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  const handleSelect = async (tierId: string) => {
    setLoading(tierId);
    
    if (tierId === "free") {
      // Free tier - just go to plan
      router.push("/plan");
    } else {
      // For now, simulate payment and go to plan
      // In production, this would redirect to Stripe/PayPal
      await new Promise(resolve => setTimeout(resolve, 500));
      router.push("/plan");
    }
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Background */}
        <div className="absolute top-0 left-0 w-full h-[600px] bg-[radial-gradient(circle_at_50%_0%,rgba(16,185,129,0.15),transparent_60%)] pointer-events-none -z-10" />

        {/* Header */}
        <div className="text-center mb-12">
          <Logo size="lg" className="justify-center mb-6" />
          <h1 className="text-4xl font-display font-medium text-white mb-4">
            Your Plan is Ready! 🎉
          </h1>
          <p className="text-slate-400 text-lg max-w-md mx-auto">
            Choose a plan to unlock your personalized 30-day calisthenics program
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {PRICING_TIERS.map((tier) => (
            <div
              key={tier.id}
              className={`relative p-6 rounded-2xl border transition-all ${
                tier.popular
                  ? "bg-emerald-500/10 border-emerald-500/50 shadow-xl shadow-emerald-500/20 scale-105"
                  : "bg-white/[0.02] border-white/10 hover:border-white/20"
              }`}
            >
              {tier.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-emerald-500 text-black text-xs font-bold rounded-full">
                  BEST VALUE
                </div>
              )}

              <h3 className={`text-xl font-display font-medium mb-1 ${
                tier.popular ? "text-emerald-400" : "text-white"
              }`}>
                {tier.name}
              </h3>
              <p className="text-sm text-slate-500 mb-4">{tier.description}</p>

              {/* Price */}
              <div className="mb-6">
                {tier.price === 0 ? (
                  <div className="text-4xl font-bold text-white">$0</div>
                ) : (
                  <div className="flex items-baseline gap-2">
                    {tier.originalPrice && (
                      <span className="text-lg text-slate-500 line-through">
                        ${tier.originalPrice}
                      </span>
                    )}
                    <span className="text-4xl font-bold text-white">${tier.price}</span>
                    <span className="text-slate-500">/mo</span>
                  </div>
                )}
                {tier.originalPrice && tier.price !== 0 && (
                  <div className="mt-1 text-sm text-emerald-400 font-medium">
                    Save {Math.round((1 - tier.price / tier.originalPrice) * 100)}%
                  </div>
                )}
              </div>

              {/* Features */}
              <ul className="space-y-3 mb-6">
                {tier.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm">
                    <svg className={`w-5 h-5 flex-shrink-0 ${tier.popular ? "text-emerald-400" : "text-emerald-500/70"}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M5 12l5 5L20 7" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span className="text-slate-300">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <button
                onClick={() => handleSelect(tier.id)}
                disabled={loading !== null}
                className={`w-full py-3.5 rounded-xl font-semibold transition-all disabled:opacity-50 ${
                  tier.popular
                    ? "bg-emerald-500 text-black hover:bg-emerald-400 shadow-lg shadow-emerald-500/30"
                    : tier.id === "free"
                    ? "border border-white/20 text-white hover:bg-white/5"
                    : "bg-white/10 text-white hover:bg-white/20"
                }`}
              >
                {loading === tier.id ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" className="opacity-25"/>
                      <path d="M12 2a10 10 0 0110 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
                    </svg>
                    Processing...
                  </span>
                ) : (
                  tier.cta
                )}
              </button>
            </div>
          ))}
        </div>

        {/* Trust */}
        <div className="text-center">
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-slate-500">
            <span className="flex items-center gap-2">
              <svg className="w-5 h-5 text-emerald-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              Secure payment
            </span>
            <span className="flex items-center gap-2">
              <svg className="w-5 h-5 text-emerald-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Cancel anytime
            </span>
            <span className="flex items-center gap-2">
              <svg className="w-5 h-5 text-emerald-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              7-day guarantee
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

