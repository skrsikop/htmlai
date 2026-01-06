import Stripe from "stripe";
import prisma from "../lib/prisma.js";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
export const stripeWebhook = async (request, response) => {
    const signature = request.headers['stripe-signature'];
    let event;
    try {
        event = stripe.webhooks.constructEvent(request.body, signature, process.env.STRIPE_WEBHOOK_SECRET);
    }
    catch (err) {
        console.log("Webhook verification failed:", err.message);
        return response.sendStatus(400);
    }
    if (event.type === 'checkout.session.completed') {
        const session = event.data.object;
        const { transactionId, appId } = session.metadata;
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
