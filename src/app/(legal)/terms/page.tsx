import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service - CalisAI",
  description: "Terms of Service for CalisAI - AI Calisthenics Coach",
};

export default function TermsPage() {
  return (
    <article className="prose prose-invert prose-emerald max-w-none">
      <h1 className="text-4xl font-display font-medium text-white mb-2">Terms of Service</h1>
      <p className="text-slate-400 text-lg mb-8">Last updated: January 2025</p>

      <section className="space-y-6">
        <div>
          <h2 className="text-2xl font-display font-medium text-white mt-12 mb-4">1. Acceptance of Terms</h2>
          <p className="text-slate-400 leading-relaxed">
            By accessing or using CalisAI (&quot;the Service&quot;), you agree to be bound by these Terms of Service. 
            If you do not agree to these terms, please do not use the Service.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-display font-medium text-white mt-12 mb-4">2. Description of Service</h2>
          <p className="text-slate-400 leading-relaxed">
            CalisAI is an AI-powered fitness application that provides personalized calisthenics workout plans, 
            exercise guidance, and progress tracking. The Service uses artificial intelligence to generate 
            workout recommendations based on user-provided information.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-display font-medium text-white mt-12 mb-4">3. User Accounts</h2>
          <p className="text-slate-400 leading-relaxed">
            To use certain features of the Service, you must create an account. You are responsible for:
          </p>
          <ul className="list-disc list-inside text-slate-400 mt-4 space-y-2">
            <li>Maintaining the confidentiality of your account credentials</li>
            <li>All activities that occur under your account</li>
            <li>Providing accurate and complete information</li>
            <li>Updating your information to keep it current</li>
          </ul>
        </div>

        <div>
          <h2 className="text-2xl font-display font-medium text-white mt-12 mb-4">4. Subscription and Payments</h2>
          <p className="text-slate-400 leading-relaxed">
            Some features require a paid subscription. By subscribing, you agree to:
          </p>
          <ul className="list-disc list-inside text-slate-400 mt-4 space-y-2">
            <li>Pay the subscription fees at the rates in effect at the time of purchase</li>
            <li>Automatic renewal unless cancelled before the renewal date</li>
            <li>Our payment processing through PayPal and their terms of service</li>
          </ul>
          <p className="text-slate-400 leading-relaxed mt-4">
            You may cancel your subscription at any time. Cancellation will take effect at the end of your 
            current billing period. We do not provide refunds for partial subscription periods.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-display font-medium text-white mt-12 mb-4">5. Health and Safety Disclaimer</h2>
          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-6 my-6">
            <p className="text-yellow-300 font-medium mb-2">⚠️ Important Health Notice</p>
            <p className="text-slate-400 leading-relaxed">
              CalisAI is not a substitute for professional medical advice, diagnosis, or treatment. 
              Always consult with a qualified healthcare provider before starting any exercise program, 
              especially if you have pre-existing health conditions, injuries, or concerns.
            </p>
          </div>
          <p className="text-slate-400 leading-relaxed">
            By using the Service, you acknowledge that:
          </p>
          <ul className="list-disc list-inside text-slate-400 mt-4 space-y-2">
            <li>Exercise carries inherent risks of injury</li>
            <li>You are solely responsible for your physical health and safety</li>
            <li>You should stop exercising immediately if you experience pain or discomfort</li>
            <li>AI-generated recommendations may not be suitable for everyone</li>
          </ul>
        </div>

        <div>
          <h2 className="text-2xl font-display font-medium text-white mt-12 mb-4">6. Acceptable Use</h2>
          <p className="text-slate-400 leading-relaxed">
            You agree not to:
          </p>
          <ul className="list-disc list-inside text-slate-400 mt-4 space-y-2">
            <li>Use the Service for any unlawful purpose</li>
            <li>Share your account with others</li>
            <li>Attempt to reverse engineer or extract the underlying AI models</li>
            <li>Abuse the AI chat feature or attempt to bypass safety filters</li>
            <li>Upload harmful or inappropriate content</li>
          </ul>
        </div>

        <div>
          <h2 className="text-2xl font-display font-medium text-white mt-12 mb-4">7. Intellectual Property</h2>
          <p className="text-slate-400 leading-relaxed">
            All content, features, and functionality of the Service are owned by CalisAI and are protected 
            by copyright, trademark, and other intellectual property laws. You may not copy, modify, 
            distribute, or create derivative works without our express permission.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-display font-medium text-white mt-12 mb-4">8. Limitation of Liability</h2>
          <p className="text-slate-400 leading-relaxed">
            To the maximum extent permitted by law, CalisAI shall not be liable for any indirect, incidental, 
            special, consequential, or punitive damages, including but not limited to personal injury, 
            loss of data, or loss of profits arising from your use of the Service.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-display font-medium text-white mt-12 mb-4">9. Changes to Terms</h2>
          <p className="text-slate-400 leading-relaxed">
            We reserve the right to modify these terms at any time. We will notify users of material changes 
            via email or through the Service. Continued use after changes constitutes acceptance of the new terms.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-display font-medium text-white mt-12 mb-4">10. Contact</h2>
          <p className="text-slate-400 leading-relaxed">
            If you have questions about these Terms, please contact us at{" "}
            <a href="mailto:legal@calisai.com" className="text-emerald-400 hover:text-emerald-300">
              legal@calisai.com
            </a>
          </p>
        </div>
      </section>
    </article>
  );
}

