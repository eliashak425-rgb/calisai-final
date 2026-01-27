import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Blog - CalisAI",
  description: "Calisthenics tips, tutorials, and training insights from CalisAI",
};

const upcomingPosts = [
  {
    title: "The Complete Guide to Your First Muscle-Up",
    description: "A step-by-step progression from pull-ups to your first muscle-up, with common mistakes to avoid.",
    category: "Skills",
    readTime: "12 min read",
  },
  {
    title: "Why Progressive Overload Matters in Calisthenics",
    description: "How to continually challenge your muscles using bodyweight-only training methods.",
    category: "Training",
    readTime: "8 min read",
  },
  {
    title: "Handstand Basics: Building Your Foundation",
    description: "Essential wrist prep, wall drills, and balance exercises for handstand beginners.",
    category: "Skills",
    readTime: "10 min read",
  },
  {
    title: "Recovery for Calisthenics Athletes",
    description: "Sleep, nutrition, and active recovery strategies to maximize your gains.",
    category: "Recovery",
    readTime: "7 min read",
  },
];

export default function BlogPage() {
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
          CalisAI Blog
        </h1>
        <p className="text-slate-400 text-lg">
          Expert calisthenics tutorials, training tips, and insights to help you master bodyweight skills.
        </p>
      </div>

      {/* Email Signup */}
      <div className="card-interactive p-8 max-w-xl mx-auto mb-16 text-center">
        <div className="w-16 h-16 mx-auto mb-6 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-400 border border-emerald-500/20">
          <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" strokeLinecap="round"/>
          </svg>
        </div>
        <h2 className="text-xl font-display font-medium text-white mb-2">Get notified when we launch</h2>
        <p className="text-slate-400 text-sm mb-6">Be the first to read our calisthenics guides and tutorials.</p>
        <form className="flex gap-3">
          <input
            type="email"
            placeholder="you@example.com"
            className="input-dark flex-1"
          />
          <button type="submit" className="btn-primary whitespace-nowrap">
            Notify Me
          </button>
        </form>
      </div>

      {/* Upcoming Posts Preview */}
      <div>
        <h2 className="text-2xl font-display font-medium text-white mb-8 text-center">Coming Soon</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {upcomingPosts.map((post, i) => (
            <div key={i} className="card-interactive p-6 opacity-75">
              <div className="flex items-center gap-3 mb-3">
                <span className="px-2 py-1 rounded-full bg-white/5 text-xs text-slate-400">
                  {post.category}
                </span>
                <span className="text-xs text-slate-500">{post.readTime}</span>
              </div>
              <h3 className="text-lg font-medium text-white mb-2">{post.title}</h3>
              <p className="text-sm text-slate-400">{post.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="text-center mt-16">
        <p className="text-slate-500 mb-4">Ready to start training?</p>
        <Link href="/signup" className="btn-primary inline-flex items-center gap-2">
          Try CalisAI Free
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M5 12h14m-7-7l7 7-7 7" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </Link>
      </div>
    </div>
  );
}

