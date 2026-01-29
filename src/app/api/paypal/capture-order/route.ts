import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const PAYPAL_CLIENT_ID = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
const PAYPAL_SECRET = process.env.PAYPAL_SECRET;
// Live PayPal API URL
const PAYPAL_API_URL = "https://api-m.paypal.com";

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
    throw new Error("Failed to authenticate with PayPal");
  }

  return data.access_token;
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { orderId } = await req.json();

    if (!orderId) {
      return NextResponse.json({ error: "Order ID required" }, { status: 400 });
    }

    const accessToken = await getPayPalAccessToken();

    // Capture the order
    const response = await fetch(
      `${PAYPAL_API_URL}/v2/checkout/orders/${orderId}/capture`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const captureData = await response.json();

    if (!response.ok || captureData.status !== "COMPLETED") {
      console.error("PayPal capture error:", captureData);
      return NextResponse.json(
        { error: "Payment capture failed" },
        { status: 500 }
      );
    }

    // Extract custom data from the order
    const customId = captureData.purchase_units?.[0]?.payments?.captures?.[0]?.custom_id;
    let orderData: { userId: string; tier: string; planId: string };
    
    try {
      orderData = JSON.parse(customId);
    } catch {
      console.error("Failed to parse custom_id:", customId);
      return NextResponse.json(
        { error: "Invalid order data" },
        { status: 500 }
      );
    }

    // Verify the user matches
    if (orderData.userId !== session.user.id) {
      return NextResponse.json(
        { error: "User mismatch" },
        { status: 403 }
      );
    }

    // Deactivate any existing subscriptions
    await prisma.subscription.updateMany({
      where: {
        userId: session.user.id,
        status: "ACTIVE",
      },
      data: {
        status: "CANCELLED",
      },
    });

    // Create new subscription
    const currentPeriodEnd = new Date();
    currentPeriodEnd.setDate(currentPeriodEnd.getDate() + 30);

    const captureId = captureData.purchase_units?.[0]?.payments?.captures?.[0]?.id || orderId;
    
    const subscription = await prisma.subscription.create({
      data: {
        userId: session.user.id,
        tier: orderData.tier,
        status: "ACTIVE",
        currentPeriodEnd,
        paypalSubscriptionId: `order_${orderId}`, // Using order ID since this is a one-time payment
        paypalPlanId: orderData.planId,
        paypalOrderId: orderId,
        paypalCaptureId: captureId,
      },
    });

    return NextResponse.json({
      success: true,
      subscriptionId: subscription.id,
      tier: subscription.tier,
      expiresAt: subscription.currentPeriodEnd,
    });
  } catch (error) {
    console.error("Capture order error:", error);
    return NextResponse.json(
      { error: "Failed to capture order" },
      { status: 500 }
    );
  }
}


