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


app.use(cors());


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
