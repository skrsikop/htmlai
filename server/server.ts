import express, { Request, Response } from "express";
import 'dotenv/config';
import cors from 'cors';
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth.js";
import userRouter from "./routes/user-routes.js";
import projectRouter from "./routes/projects-routes.js";
import { stripeWebhook } from "./controllers/stripeWebhook.js";

// Create Express app
const app = express();
const port = process.env.PORT || 3000;

// Parse JSON
app.use(express.json({ limit: '50mb' }));

// Setup CORS
const allowedOrigins = process.env.TRUSTED_ORIGINS?.split(",") || [];
app.use((req: Request, res: Response, next) => {
    const origin = req.headers.origin;
    if (origin && allowedOrigins.includes(origin)) {
        res.setHeader("Access-Control-Allow-Origin", origin);
    }
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type,Authorization");
    if (req.method === "OPTIONS") return res.sendStatus(200);
    next();
});

// Stripe webhook
app.post('/api/stripe', express.raw({ type: 'application/json' }), stripeWebhook);

// Better Auth routes (with CORS wrapper)
app.all('/api/auth/:path*', (req, res) => {
    // Headers already set by CORS middleware
    return toNodeHandler(auth)(req, res);
});

// Test route
app.get('/', (req: Request, res: Response) => {
    res.send('Server is Live!');
});

// Other API routes
app.use('/api/user', userRouter);
app.use('/api/project', projectRouter);

// Start server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
