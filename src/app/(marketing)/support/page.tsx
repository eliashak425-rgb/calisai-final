import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Support - CalisAI",
  description: "Get help with CalisAI - FAQ, contact, and support resources",
};

const faqs = [
  {
    q: "How do I cancel my subscription?",
    a: "Go to Settings > Subscription and click 'Cancel Subscription'. Your access will continue until the end of your billing period.",
  },
  {
    q: "Can I change my workout plan?",
    a: "Yes! Go to Dashboard and click 'Regenerate Plan' to create a new plan with updated preferences or constraints.",
  },
  {
    q: "How does the AI coach work?",
    a: "The AI coach uses your profile and training data to provide personalized advice. You can ask about exercises, form, nutrition, and recovery.",
  },
  {
    q: "What equipment do I need?",
    a: "CalisAI creates plans based on your available equipment. You can train with just your bodyweight, or add equipment like pull-up bars, rings, or parallettes.",
  },
  {
    q: "Is CalisAI suitable for beginners?",
    a: "Absolutely! CalisAI creates plans for all levels and provides proper progressions from basic movements to advanced skills.",
  },
];

export default function SupportPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      {/* Background */}
      <div className="absolute top-0 left-0 w-full h-[600px] bg-[radial-gradient(circle_at_50%_0%,rgba(16,185,129,0.1),transparent_60%)] pointer-events-none -z-10" />

      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-16">
        <h1 className="text-4xl md:text-5xl font-display font-medium text-white mb-4">
          How can we help?
        </h1>
        <p className="text-slate-400 text-lg">
          Find answers to common questions or get in touch with our team.
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-3 gap-6 mb-16">
        <a 
          href="mailto:support@calisai.com"
          className="card-interactive p-6 text-center group"
        >
          <div className="w-14 h-14 mx-auto mb-4 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-400 border border-emerald-500/20 group-hover:bg-emerald-500/20 transition-colors">
            <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" strokeLinecap="round"/>
            </svg>
          </div>
          <h3 className="font-medium text-white mb-1">Email Us</h3>
          <p className="text-sm text-slate-400">support@calisai.com</p>
        </a>

        <Link 
          href="/#faq"
          className="card-interactive p-6 text-center group"
        >
          <div className="w-14 h-14 mx-auto mb-4 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-400 border border-blue-500/20 group-hover:bg-blue-500/20 transition-colors">
            <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/>
              <path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3M12 17h.01" strokeLinecap="round"/>
            </svg>
          </div>
          <h3 className="font-medium text-white mb-1">FAQ</h3>
          <p className="text-sm text-slate-400">Common questions</p>
        </Link>

        <Link 
          href="/chat"
          className="card-interactive p-6 text-center group"
        >
          <div className="w-14 h-14 mx-auto mb-4 bg-purple-500/10 rounded-2xl flex items-center justify-center text-purple-400 border border-purple-500/20 group-hover:bg-purple-500/20 transition-colors">
            <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" strokeLinecap="round"/>
            </svg>
          </div>
          <h3 className="font-medium text-white mb-1">AI Coach</h3>
          <p className="text-sm text-slate-400">Ask training questions</p>
        </Link>
      </div>

      {/* FAQ Section */}
      <div className="mb-16">
        <h2 className="text-2xl font-display font-medium text-white mb-8 text-center">
          Frequently Asked Questions
        </h2>
        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <div key={i} className="card-interactive p-6">
              <h3 className="font-medium text-white mb-2">{faq.q}</h3>
              <p className="text-sm text-slate-400">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Contact Form */}
      <div className="card-interactive p-8">
        <h2 className="text-xl font-display font-medium text-white mb-6 text-center">
          Send us a message
        </h2>
        <form className="space-y-5 max-w-lg mx-auto">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Name</label>
              <input type="text" className="input-dark" placeholder="Your name" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Email</label>
              <input type="email" className="input-dark" placeholder="you@example.com" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Subject</label>
            <select className="input-dark">
              <option>General question</option>
              <option>Technical issue</option>
              <option>Billing question</option>
              <option>Feature request</option>
              <option>Other</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Message</label>
            <textarea 
              className="input-dark min-h-[120px] resize-none" 
              placeholder="How can we help?"
            />
          </div>
          <button type="submit" className="btn-primary w-full">
            Send Message
          </button>
        </form>
      </div>
    </div>
  );
}

