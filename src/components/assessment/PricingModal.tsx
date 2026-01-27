"use client";

import { useRouter } from "next/navigation";

interface PricingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PRICING_TIERS = [
  {
    id: "free",
    name: "Free",
    price: 0,
    description: "Get started with basics",
    features: [
      "Week 1 plan preview",
      "5 AI chat messages/day",
      "Basic exercises only",
      "No plan regeneration",
    ],
    limitations: [
      "Limited to 1 week",
      "No advanced skills",
      "No diet guidance",
    ],
    cta: "Continue Free",
    popular: false,
  },
  {
    id: "starter",
    name: "Starter",
    price: 15,
    originalPrice: 50,
    description: "Perfect for beginners",
    features: [
      "Full 4-week plan",
      "50 AI chat messages/day",
      "Plan regeneration (1x/week)",
      "Progress tracking",
      "Exercise library access",
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
      "Unlimited plan regeneration",
      "Advanced skill progressions",
      "Personalized diet guidance",
      "Priority support",
    ],
    cta: "Go Pro",
    popular: false,
  },
  {
    id: "elite",
    name: "Elite",
    price: null,
    description: "Custom coaching",
    features: [
      "Everything in Pro",
      "1-on-1 video coaching calls",
      "Custom program design",
      "Form check reviews",
      "Direct coach access",
    ],
    cta: "Contact Us",
    popular: false,
  },
];

export function PricingModal({ isOpen, onClose }: PricingModalProps) {
  const router = useRouter();

  if (!isOpen) return null;

  const handleSelect = (tierId: string) => {
    if (tierId === "free") {
      // Continue with free - just close modal for now
      onClose();
      router.push("/signup?plan=free");
    } else if (tierId === "elite") {
      router.push("/contact");
    } else {
      // Redirect to signup with plan
      router.push(`/signup?plan=${tierId}`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-5xl max-h-[90vh] overflow-auto bg-gradient-to-b from-[#0D0E12] to-[#0A0B0E] border border-white/10 rounded-3xl shadow-2xl">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-white/5 rounded-lg transition-colors z-10"
        >
          <svg className="w-6 h-6 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" />
          </svg>
        </button>

        <div className="p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-display font-medium text-white mb-2">
              Unlock Your Full Plan
            </h2>
            <p className="text-slate-400">
              Choose the plan that fits your goals
            </p>
          </div>

          {/* Pricing cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {PRICING_TIERS.map((tier) => (
              <div
                key={tier.id}
                className={`relative p-6 rounded-2xl border transition-all ${
                  tier.popular
                    ? "bg-emerald-500/5 border-emerald-500/30 shadow-lg shadow-emerald-500/10"
                    : "bg-white/[0.02] border-white/10 hover:border-white/20"
                }`}
              >
                {/* Popular badge */}
                {tier.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-emerald-500 text-black text-xs font-bold rounded-full">
                    MOST POPULAR
                  </div>
                )}

                {/* Tier name */}
                <h3 className={`text-lg font-medium mb-1 ${
                  tier.popular ? "text-emerald-400" : "text-white"
                }`}>
                  {tier.name}
                </h3>
                <p className="text-xs text-slate-500 mb-4">{tier.description}</p>

                {/* Price */}
                <div className="mb-6">
                  {tier.price === null ? (
                    <div className="text-2xl font-bold text-white">Custom</div>
                  ) : tier.price === 0 ? (
                    <div className="text-3xl font-bold text-white">$0</div>
                  ) : (
                    <div className="flex items-baseline gap-2">
                      {tier.originalPrice && (
                        <span className="text-lg text-slate-500 line-through">
                          ${tier.originalPrice}
                        </span>
                      )}
                      <span className="text-3xl font-bold text-white">${tier.price}</span>
                      <span className="text-slate-500">/mo</span>
                    </div>
                  )}
                  {tier.originalPrice && tier.price !== null && (
                    <div className="mt-1 text-xs text-emerald-400">
                      Save ${tier.originalPrice - tier.price}/month ({Math.round((1 - tier.price / tier.originalPrice) * 100)}% off)
                    </div>
                  )}
                </div>

                {/* Features */}
                <ul className="space-y-2 mb-6">
                  {tier.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <svg className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M5 12l5 5L20 7" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <span className="text-slate-300">{feature}</span>
                    </li>
                  ))}
                  {tier.limitations?.map((limitation, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <svg className="w-4 h-4 text-slate-600 mt-0.5 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" />
                      </svg>
                      <span className="text-slate-500">{limitation}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <button
                  onClick={() => handleSelect(tier.id)}
                  className={`w-full py-3 rounded-xl font-medium transition-all ${
                    tier.popular
                      ? "bg-emerald-500 text-black hover:bg-emerald-400"
                      : tier.id === "free"
                      ? "border border-white/10 text-white hover:bg-white/5"
                      : "bg-white/10 text-white hover:bg-white/20"
                  }`}
                >
                  {tier.cta}
                </button>
              </div>
            ))}
          </div>

          {/* Trust badges */}
          <div className="mt-8 pt-6 border-t border-white/5">
            <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <span>Secure payments</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span>Cancel anytime</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span>7-day money-back guarantee</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

