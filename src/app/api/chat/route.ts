import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { openai } from "@/lib/openai";
import { checkChatLimit, recordChatUsage } from "@/lib/entitlements";
import { getActiveSubscription } from "@/lib/session";

const SYSTEM_PROMPT = `You are Aura, an expert AI calisthenics coach. You help users with:
- Exercise form and technique
- Workout programming and progressions
- Skill development (muscle-ups, handstands, levers, planche)
- Recovery and injury prevention
- Nutrition basics for athletic performance

IMPORTANT RULES:
1. You are NOT a doctor. Always recommend consulting a healthcare professional for medical issues.
2. If someone describes pain or injury, advise them to stop exercising and see a doctor.
3. Keep responses concise and actionable.
4. Use encouraging, supportive language.
5. Focus on calisthenics and bodyweight training.
6. For diet questions, give general guidance but recommend consulting a nutritionist for personalized plans.

You have access to the user's training profile and current workout plan to give personalized advice.`;

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check for active subscription
    const subscription = await getActiveSubscription(session.user.id);
    if (!subscription) {
      return NextResponse.json(
        { error: "Subscription required", code: "SUBSCRIPTION_REQUIRED" },
        { status: 403 }
      );
    }

    // Check rate limit
    const { allowed, remaining } = await checkChatLimit(session.user.id);
    if (!allowed) {
      return NextResponse.json(
        {
          error: "Daily chat limit reached. Upgrade to continue chatting.",
          limitReached: true,
        },
        { status: 429 }
      );
    }

    const { message } = await req.json();

    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    // Get user context
    const [profile, plan] = await Promise.all([
      prisma.trainingProfile.findFirst({
        where: { userId: session.user.id, isActive: true },
      }),
      prisma.workoutPlan.findFirst({
        where: { userId: session.user.id, isActive: true },
      }),
    ]);

    // Build context
    let userContext = "";
    if (profile) {
      userContext += `\nUser Profile:
- Fitness Level: ${profile.fitnessLevel}
- Goals: ${profile.goalPrimary}${profile.goalSecondary ? `, ${profile.goalSecondary}` : ""}
- Training: ${profile.daysPerWeek} days/week, ${profile.sessionDurationMin} min sessions
- Equipment: ${profile.equipment}
- Injuries/Limitations: ${profile.hasCurrentPain ? profile.painAreas : "None"}`;
    }

    if (plan) {
      userContext += `\n\nActive Plan: ${plan.generationType} plan with ${plan.totalWeeklyVolume} weekly sets`;
    }

    // Get recent chat history
    const recentMessages = await prisma.chatMessage.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      take: 10,
    });

    const chatHistory = recentMessages
      .reverse()
      .map((m) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      }));

    // Call OpenAI
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: SYSTEM_PROMPT + userContext },
        ...chatHistory,
        { role: "user", content: message },
      ],
      max_tokens: 500,
    });

    const assistantMessage = response.choices[0]?.message?.content || "I apologize, I couldn't generate a response.";
    const tokensUsed = response.usage?.total_tokens || 0;

    // Save messages
    await prisma.chatMessage.createMany({
      data: [
        {
          userId: session.user.id,
          role: "user",
          content: message,
          contextPlanId: plan?.id,
          contextProfileId: profile?.id,
        },
        {
          userId: session.user.id,
          role: "assistant",
          content: assistantMessage,
          tokensUsed,
          contextPlanId: plan?.id,
          contextProfileId: profile?.id,
        },
      ],
    });

    // Record usage
    await recordChatUsage(session.user.id, tokensUsed);

    return NextResponse.json({
      message: assistantMessage,
      remaining: remaining !== null ? remaining - 1 : null,
    });
  } catch (error) {
    console.error("Chat error:", error);
    return NextResponse.json(
      { error: "Failed to process message" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const messages = await prisma.chatMessage.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "asc" },
      take: 50,
    });

    const { remaining } = await checkChatLimit(session.user.id);

    return NextResponse.json({ messages, remaining });
  } catch (error) {
    console.error("Get chat history error:", error);
    return NextResponse.json(
      { error: "Failed to get chat history" },
      { status: 500 }
    );
  }
}

