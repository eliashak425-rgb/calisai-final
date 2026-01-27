import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Contact Sales - CalisAI",
  description: "Contact CalisAI for Elite plan inquiries and enterprise solutions",
};

export default function ContactPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      {/* Background */}
      <div className="absolute top-0 left-0 w-full h-[600px] bg-[radial-gradient(circle_at_50%_0%,rgba(16,185,129,0.1),transparent_60%)] pointer-events-none -z-10" />

      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-16">
        <span className="inline-block px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-semibold text-emerald-400 mb-6">
          Elite Plan
        </span>
        <h1 className="text-4xl md:text-5xl font-display font-medium text-white mb-4">
          Let&apos;s Talk
        </h1>
        <p className="text-slate-400 text-lg">
          Interested in our Elite plan for coaches and gyms? We&apos;d love to hear from you.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-12">
        {/* Contact Form */}
        <div className="card-interactive p-8">
          <h2 className="text-xl font-display font-medium text-white mb-6">
            Get in touch
          </h2>
          <form className="space-y-5">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">First name</label>
                <input type="text" className="input-dark" placeholder="John" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Last name</label>
                <input type="text" className="input-dark" placeholder="Doe" required />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Work email</label>
              <input type="email" className="input-dark" placeholder="john@gym.com" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Company / Gym name</label>
              <input type="text" className="input-dark" placeholder="Apex Fitness" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Number of clients</label>
              <select className="input-dark">
                <option>1-10</option>
                <option>11-25</option>
                <option>26-50</option>
                <option>50+</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Message</label>
              <textarea 
                className="input-dark min-h-[100px] resize-none" 
                placeholder="Tell us about your needs..."
              />
            </div>
            <button type="submit" className="btn-primary w-full">
              Submit Inquiry
            </button>
          </form>
        </div>

        {/* Info */}
        <div className="space-y-8">
          <div>
            <h3 className="text-lg font-display font-medium text-white mb-4">
              What&apos;s included in Elite
            </h3>
            <ul className="space-y-3">
              {[
                "Manage up to 25 clients",
                "White-label workout reports",
                "Client progress dashboard",
                "Bulk plan generation",
                "API access for integrations",
                "Dedicated account manager",
                "Custom onboarding",
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-slate-300">
                  <svg className="w-5 h-5 text-emerald-500 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round"/>
                  </svg>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="card-interactive p-6">
            <h3 className="font-medium text-white mb-2">Need more than 25 clients?</h3>
            <p className="text-sm text-slate-400 mb-4">
              We offer custom enterprise plans for larger organizations. Let us know your requirements.
            </p>
            <a 
              href="mailto:enterprise@calisai.com"
              className="text-emerald-400 hover:text-emerald-300 text-sm font-medium"
            >
              enterprise@calisai.com →
            </a>
          </div>

          <div className="card-interactive p-6">
            <h3 className="font-medium text-white mb-2">Quick questions?</h3>
            <p className="text-sm text-slate-400 mb-4">
              For general support inquiries, visit our support page or email us directly.
            </p>
            <div className="flex gap-4">
              <Link 
                href="/support"
                className="text-emerald-400 hover:text-emerald-300 text-sm font-medium"
              >
                Support Center →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

