# Aura - AI Calisthenics Coach

Aura is an AI-powered calisthenics coaching platform that generates personalized workout plans, tracks progress, and provides intelligent coaching through an AI chat interface.

## Features

- 🏋️ **Personalized Workout Plans** - AI-generated calisthenics programs based on your goals, fitness level, and available equipment
- 📊 **Progress Tracking** - Log workouts, track personal records, and visualize your progress
- 💬 **AI Coach** - Ask questions about exercises, form, progressions, and training
- 📚 **Exercise Library** - 50+ calisthenics exercises with form cues and progressions
- 🔐 **Authentication** - Email/password and Google OAuth
- 💳 **Subscriptions** - Tiered access with PayPal integration

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Database**: SQLite (dev) / PostgreSQL (prod) with Prisma ORM
- **Auth**: NextAuth.js v5
- **AI**: OpenAI GPT-4o
- **Styling**: Tailwind CSS
- **Payments**: PayPal Subscriptions

## Getting Started

### Prerequisites

- Node.js 18+
- npm or pnpm

### Installation

1. Clone the repository:
\`\`\`bash
git clone <your-repo-url>
cd calisai
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
\`\`\`

3. Set up environment variables:
\`\`\`bash
cp .env.example .env.local
\`\`\`

4. Configure your `.env.local`:
\`\`\`env
DATABASE_URL="file:./dev.db"
NEXTAUTH_SECRET="your-secret-here"
NEXTAUTH_URL="http://localhost:3000"
OPENAI_API_KEY="sk-..."
GOOGLE_CLIENT_ID="..."
GOOGLE_CLIENT_SECRET="..."
\`\`\`

5. Initialize the database:
\`\`\`bash
npx prisma db push
\`\`\`

6. Seed the database:
\`\`\`bash
npx tsx prisma/seed.ts
npx tsx prisma/seedTemplates.ts
\`\`\`

7. Start the development server:
\`\`\`bash
npm run dev
\`\`\`

Visit [http://localhost:3000](http://localhost:3000)

## Project Structure

\`\`\`
src/
├── app/                    # Next.js App Router
│   ├── (app)/             # Authenticated routes
│   │   ├── dashboard/     # User dashboard
│   │   ├── assessment/    # Fitness assessment wizard
│   │   ├── plan/          # Workout plan views
│   │   ├── workout/       # Active workout tracking
│   │   ├── exercises/     # Exercise library
│   │   ├── chat/          # AI coach chat
│   │   └── settings/      # User settings
│   ├── (auth)/            # Authentication routes
│   │   ├── login/
│   │   └── signup/
│   └── api/               # API routes
├── components/            # React components
│   ├── assessment/        # Assessment wizard steps
│   ├── dashboard/         # Dashboard widgets
│   ├── landing/           # Landing page sections
│   └── providers/         # Context providers
├── domain/                # Business logic
│   ├── assessment/        # Profile computation
│   └── plan/              # Plan validation
├── lib/                   # Utilities
│   ├── auth.ts           # NextAuth config
│   ├── prisma.ts         # Prisma client
│   ├── openai.ts         # OpenAI client
│   └── entitlements.ts   # Subscription logic
├── services/              # External services
│   └── openai/           # AI plan generation
└── types/                 # TypeScript types
\`\`\`

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repo to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

### Environment Variables for Production

| Variable | Description |
|----------|-------------|
| DATABASE_URL | PostgreSQL connection string |
| NEXTAUTH_SECRET | Random secret for session encryption |
| NEXTAUTH_URL | Your production URL |
| OPENAI_API_KEY | OpenAI API key |
| GOOGLE_CLIENT_ID | Google OAuth client ID |
| GOOGLE_CLIENT_SECRET | Google OAuth secret |

## License

MIT

---

Built with ❤️ by the Aura team
