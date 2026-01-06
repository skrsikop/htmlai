import { Request, Response } from "express";
import Stripe from "stripe";
import prisma from "../lib/prisma.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export const stripeWebhook = async (request: Request, response: Response) => {
  const signature = request.headers['stripe-signature'] as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      request.body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET as string
    );
  } catch (err: any) {
    console.log("Webhook verification failed:", err.message);
    return response.sendStatus(400);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;

    const { transactionId, appId } = session.metadata as {
      transactionId: string;
      appId: string;
    };

    if (appId === 'htmlai' && transactionId) {
      const transaction = await prisma.transaction.findUnique({
        where: { id: transactionId }
      });

      if (!transaction || transaction.isPaid) {
        return response.json({ received: true });
      }

      // ✅ ADD CREDITS TO USER
      await prisma.user.update({
        where: { id: transaction.userId },
        data: {
          credits: {
            increment: transaction.credits
          }
        }
      });

      // ✅ MARK TRANSACTION AS PAID
      await prisma.transaction.update({
        where: { id: transactionId },
        data: { isPaid: true }
      });
    }
  }

  response.json({ received: true });
};
