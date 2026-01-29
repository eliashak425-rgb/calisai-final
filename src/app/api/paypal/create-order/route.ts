import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const PAYPAL_CLIENT_ID = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
const PAYPAL_SECRET = process.env.PAYPAL_SECRET;
// Live PayPal API URL
const PAYPAL_API_URL = "https://api-m.paypal.com";

function getBaseUrl(): string {
  if (process.env.NEXTAUTH_URL) return process.env.NEXTAUTH_URL;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "https://calisai-final-git-main-eliashak425s-projects.vercel.app";
}

const PRICING = {
  starter: { price: "15.00", name: "CalisAI Starter", tier: "BASIC" },
  pro: { price: "29.00", name: "CalisAI Pro", tier: "PREMIUM" },
  elite: { price: "79.00", name: "CalisAI Elite", tier: "ELITE" },
};

async function getPayPalAccessToken(): Promise<string> {
  if (!PAYPAL_CLIENT_ID || !PAYPAL_SECRET) {
    throw new Error("PayPal credentials not configured");
  }

  const auth = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_SECRET}`).toString("base64");
  
  const response = await fetch(`${PAYPAL_API_URL}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${auth}`,
    },
    body: "grant_type=client_credentials",
  });

  const data = await response.json();
  
  if (!response.ok) {
    console.error("PayPal auth error:", data);
    throw new Error("Failed to authenticate with PayPal");
  }

  return data.access_token;
}

export async function POST(req: Request) {
  console.log("=== PayPal Create Order Start ===");
  console.log("PAYPAL_CLIENT_ID exists:", !!PAYPAL_CLIENT_ID);
  console.log("PAYPAL_SECRET exists:", !!PAYPAL_SECRET);
  
  try {
    const session = await getServerSession(authOptions);
    console.log("Session user:", session?.user?.id ? "Found" : "Not found");
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { planId } = await req.json();
    console.log("Plan ID:", planId);

    if (!planId || !PRICING[planId as keyof typeof PRICING]) {
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
    }

    const plan = PRICING[planId as keyof typeof PRICING];
    console.log("Getting PayPal access token...");
    const accessToken = await getPayPalAccessToken();
    console.log("Access token received:", !!accessToken);

    const response = await fetch(`${PAYPAL_API_URL}/v2/checkout/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        intent: "CAPTURE",
        purchase_units: [
          {
            amount: {
              currency_code: "USD",
              value: plan.price,
            },
            description: `${plan.name} - Monthly Subscription`,
            custom_id: JSON.stringify({
              userId: session.user.id,
              tier: plan.tier,
              planId,
            }),
          },
        ],
        application_context: {
          brand_name: "CalisAI",
          landing_page: "NO_PREFERENCE",
          user_action: "PAY_NOW",
          return_url: `${getBaseUrl()}/paywall/success`,
          cancel_url: `${getBaseUrl()}/paywall`,
        },
      }),
    });

    const order = await response.json();
    console.log("PayPal response status:", response.status);
    console.log("PayPal order response:", JSON.stringify(order, null, 2));

    if (!response.ok) {
      console.error("PayPal create order error:", order);
      return NextResponse.json(
        { error: `PayPal error: ${order.message || order.error_description || "Unknown error"}` },
        { status: 500 }
      );
    }

    console.log("Order created successfully:", order.id);
    return NextResponse.json({ orderId: order.id });
  } catch (error) {
    console.error("Create order error:", error);
    return NextResponse.json(
      { error: `Server error: ${error instanceof Error ? error.message : "Unknown error"}` },
      { status: 500 }
    );
  }
}


