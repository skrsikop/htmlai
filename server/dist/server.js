import express from "express";
import 'dotenv/config';
import cors from 'cors';
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth.js";
import userRouter from "./routes/user-routes.js";
import projectRouter from "./routes/projects-routes.js";
import { stripeWebhook } from "./controllers/stripeWebhook.js";
// Create an Express app and Port
const app = express();
const port = 3000;
// setup cors 
const corsOptions = {
    origin: process.env.TRUSTED_ORIGINS?.split(",") || [],
    credentials: true,
};
// Middlewares
app.use(cors(corsOptions));
app.post('/api/stripe', express.raw({ type: 'application/json' }), stripeWebhook);
app.all('/api/auth/{*any}', toNodeHandler(auth));
app.use(express.json({ limit: '50mb' }));
// Define a simple route
app.get('/', (req, res) => {
    res.send('Server is Live!');
});
// ALL API ROUTES 
app.use('/api/user', userRouter);
app.use('/api/project', projectRouter);
// Start the server
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
