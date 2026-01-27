import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Community - CalisAI",
  description: "Join the CalisAI community of calisthenics athletes",
};

const communityFeatures = [
  {
    icon: "💬",
    title: "Discussion Forums",
    description: "Share your progress, ask questions, and learn from fellow athletes.",
  },
  {
    icon: "🏆",
    title: "Challenges",
    description: "Participate in monthly skill challenges and compete with others.",
  },
  {
    icon: "📸",
    title: "Progress Sharing",
    description: "Post your PRs, form checks, and celebrate achievements together.",
  },
  {
    icon: "🎓",
    title: "Expert AMAs",
    description: "Regular Q&A sessions with professional calisthenics coaches.",
  },
];

export default function CommunityPage() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-16">
      {/* Background */}
      <div className="absolute top-0 left-0 w-full h-[600px] bg-[radial-gradient(circle_at_50%_0%,rgba(16,185,129,0.1),transparent_60%)] pointer-events-none -z-10" />

      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-16">
        <span className="inline-block px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-semibold text-emerald-400 mb-6">
          Coming Soon
        </span>
        <h1 className="text-4xl md:text-5xl font-display font-medium text-white mb-4">
          CalisAI Community
        </h1>
        <p className="text-slate-400 text-lg">
          Connect with thousands of calisthenics athletes. Share progress, get feedback, and grow together.
        </p>
      </div>

      {/* Features Preview */}
      <div className="grid md:grid-cols-2 gap-6 mb-16">
        {communityFeatures.map((feature, i) => (
          <div key={i} className="card-interactive p-6">
            <div className="text-4xl mb-4">{feature.icon}</div>
            <h3 className="text-lg font-display font-medium text-white mb-2">{feature.title}</h3>
            <p className="text-sm text-slate-400">{feature.description}</p>
          </div>
        ))}
      </div>

      {/* Waitlist Signup */}
      <div className="card-interactive p-8 max-w-xl mx-auto text-center">
        <div className="w-16 h-16 mx-auto mb-6 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-400 border border-emerald-500/20">
          <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" strokeLinecap="round"/>
            <circle cx="9" cy="7" r="4"/>
            <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/>
          </svg>
        </div>
        <h2 className="text-xl font-display font-medium text-white mb-2">Join the Waitlist</h2>
        <p className="text-slate-400 text-sm mb-6">Be among the first to access the CalisAI community when it launches.</p>
        <form className="flex gap-3">
          <input
            type="email"
            placeholder="you@example.com"
            className="input-dark flex-1"
          />
          <button type="submit" className="btn-primary whitespace-nowrap">
            Join Waitlist
          </button>
        </form>
        <p className="text-xs text-slate-500 mt-4">We&apos;ll notify you as soon as the community is live.</p>
      </div>

      {/* Current Options */}
      <div className="text-center mt-16">
        <h3 className="text-lg font-display font-medium text-white mb-4">In the meantime...</h3>
        <p className="text-slate-400 mb-6">Start training with CalisAI and be ready to share your progress!</p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link href="/signup" className="btn-primary">
            Start Training
          </Link>
          <a 
            href="https://instagram.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="btn-secondary"
          >
            Follow on Instagram
          </a>
        </div>
      </div>
    </div>
  );
}

