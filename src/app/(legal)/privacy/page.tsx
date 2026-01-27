import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy - CalisAI",
  description: "Privacy Policy for CalisAI - AI Calisthenics Coach",
};

export default function PrivacyPage() {
  return (
    <article className="prose prose-invert prose-emerald max-w-none">
      <h1 className="text-4xl font-display font-medium text-white mb-2">Privacy Policy</h1>
      <p className="text-slate-400 text-lg mb-8">Last updated: January 2025</p>

      <section className="space-y-6">
        <div>
          <h2 className="text-2xl font-display font-medium text-white mt-12 mb-4">1. Information We Collect</h2>
          <p className="text-slate-400 leading-relaxed">
            We collect information you provide directly to us, including:
          </p>
          <ul className="list-disc list-inside text-slate-400 mt-4 space-y-2">
            <li><strong className="text-white">Account Information:</strong> Name, email address, and password</li>
            <li><strong className="text-white">Profile Data:</strong> Age, height, weight, training experience, and fitness goals</li>
            <li><strong className="text-white">Health Information:</strong> Injury history and physical limitations you choose to share</li>
            <li><strong className="text-white">Workout Data:</strong> Exercise logs, progress tracking, and performance metrics</li>
            <li><strong className="text-white">Chat Conversations:</strong> Messages with the AI coach</li>
            <li><strong className="text-white">Payment Information:</strong> Processed securely through PayPal</li>
          </ul>
        </div>

        <div>
          <h2 className="text-2xl font-display font-medium text-white mt-12 mb-4">2. How We Use Your Information</h2>
          <p className="text-slate-400 leading-relaxed">
            We use your information to:
          </p>
          <ul className="list-disc list-inside text-slate-400 mt-4 space-y-2">
            <li>Generate personalized workout plans using AI</li>
            <li>Track your progress and adapt recommendations</li>
            <li>Provide AI coaching responses tailored to your profile</li>
            <li>Process payments and manage subscriptions</li>
            <li>Send important service updates and notifications</li>
            <li>Improve our AI models and service quality</li>
            <li>Ensure safety and prevent abuse</li>
          </ul>
        </div>

        <div>
          <h2 className="text-2xl font-display font-medium text-white mt-12 mb-4">3. AI and Data Processing</h2>
          <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-6 my-6">
            <p className="text-emerald-300 font-medium mb-2">🤖 AI Transparency</p>
            <p className="text-slate-400 leading-relaxed">
              CalisAI uses OpenAI&apos;s GPT models to generate workout plans and provide coaching. 
              Your data is sent to OpenAI&apos;s API for processing but is not used to train their models.
              We retain conversation logs to improve service quality and ensure safety compliance.
            </p>
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-display font-medium text-white mt-12 mb-4">4. Data Sharing</h2>
          <p className="text-slate-400 leading-relaxed">
            We do not sell your personal information. We may share data with:
          </p>
          <ul className="list-disc list-inside text-slate-400 mt-4 space-y-2">
            <li><strong className="text-white">Service Providers:</strong> OpenAI (AI processing), PayPal (payments), cloud hosting providers</li>
            <li><strong className="text-white">Legal Requirements:</strong> When required by law or to protect rights and safety</li>
            <li><strong className="text-white">Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets</li>
          </ul>
        </div>

        <div>
          <h2 className="text-2xl font-display font-medium text-white mt-12 mb-4">5. Data Security</h2>
          <p className="text-slate-400 leading-relaxed">
            We implement industry-standard security measures to protect your data, including:
          </p>
          <ul className="list-disc list-inside text-slate-400 mt-4 space-y-2">
            <li>Encryption of data in transit (HTTPS/TLS)</li>
            <li>Secure password hashing</li>
            <li>Regular security audits</li>
            <li>Access controls and authentication</li>
          </ul>
        </div>

        <div>
          <h2 className="text-2xl font-display font-medium text-white mt-12 mb-4">6. Your Rights</h2>
          <p className="text-slate-400 leading-relaxed">
            Depending on your location, you may have the right to:
          </p>
          <ul className="list-disc list-inside text-slate-400 mt-4 space-y-2">
            <li>Access the personal data we hold about you</li>
            <li>Request correction of inaccurate data</li>
            <li>Request deletion of your data</li>
            <li>Export your data in a portable format</li>
            <li>Opt out of certain data processing</li>
          </ul>
          <p className="text-slate-400 leading-relaxed mt-4">
            To exercise these rights, contact us at{" "}
            <a href="mailto:privacy@calisai.com" className="text-emerald-400 hover:text-emerald-300">
              privacy@calisai.com
            </a>
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-display font-medium text-white mt-12 mb-4">7. Data Retention</h2>
          <p className="text-slate-400 leading-relaxed">
            We retain your data for as long as your account is active or as needed to provide services. 
            You can request account deletion at any time. Some data may be retained for legal or 
            legitimate business purposes after deletion.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-display font-medium text-white mt-12 mb-4">8. Cookies and Tracking</h2>
          <p className="text-slate-400 leading-relaxed">
            We use essential cookies for authentication and session management. We may use analytics 
            to understand how users interact with the Service. You can control cookie preferences 
            through your browser settings.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-display font-medium text-white mt-12 mb-4">9. Children&apos;s Privacy</h2>
          <p className="text-slate-400 leading-relaxed">
            CalisAI is not intended for users under 16 years of age. We do not knowingly collect 
            personal information from children. If you believe we have collected data from a child, 
            please contact us immediately.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-display font-medium text-white mt-12 mb-4">10. Changes to This Policy</h2>
          <p className="text-slate-400 leading-relaxed">
            We may update this Privacy Policy from time to time. We will notify you of material changes 
            via email or through the Service. Your continued use after changes indicates acceptance.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-display font-medium text-white mt-12 mb-4">11. Contact Us</h2>
          <p className="text-slate-400 leading-relaxed">
            For privacy-related questions or concerns, contact us at{" "}
            <a href="mailto:privacy@calisai.com" className="text-emerald-400 hover:text-emerald-300">
              privacy@calisai.com
            </a>
          </p>
        </div>
      </section>
    </article>
  );
}

