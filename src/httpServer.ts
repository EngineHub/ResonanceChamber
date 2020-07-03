import * as crypto from "crypto";
import express, {Express, Response, Router} from "express";
import http from "http";
import {exit} from "process";
import {RESONANCES} from "./secrets/webhooks";
import {executeWebhook, WebhookData} from "./simple-discord-webhooks/Webhook";

export function startHttpServer(port: number): void {
    console.info("Creating HTTP server...");
    const app = express();
    setupRouting(app);
    const server = http.createServer(app);

    server.on("listening", () => {
        console.info(`HTTP Server is listening on port ${port}`);
    });
    server.on("error", (e: unknown) => {
        if ((e as { code: string }).code === "EADDRINUSE") {
            console.error(`The port ${port} is in use.`);
            exit(1);
        }
    });

    server.listen(port);
}

function setupRouting(app: Express): void {
    const webhooks = Router();
    const seenRoutes = new Set<string>();
    RESONANCES.forEach(resonance => {
        const route = resonance.data.route;
        if (seenRoutes.has(route)) {
            throw new Error(`Duplicate route ${route}`);
        }
        webhooks.get(route, async (req, res) => {
            const result = await resonance.resonate(req);
            if (result === "ignored") {
                // Not a call we care about
                res.status(204).send();
                return;
            }
            if (result === "rejected") {
                res.status(401).json({
                    error: "Rejected, you don't know the answer!"
                });
                return;
            }
            await safeExecuteWebhook(res, resonance.data.hookTarget, result);
        });
    });

    app.use("/webhooks", webhooks);
}

async function safeExecuteWebhook(res: Response, target: string, data: WebhookData): Promise<void> {
    try {
        await executeWebhook(target, data);
    } catch (e) {
        const errorId = crypto.randomBytes(10).toString("hex");
        console.warn(errorId, e);
        res.status(500).json({
            id: errorId,
            error: "I was unable to execute the webhook.",
        });
        return;
    }
    res.json({
        message: "I've contacted the Discord Servers. Thanks!",
    });
}
