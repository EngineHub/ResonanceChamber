import * as crypto from "crypto";
import express, {Express, Response, Router} from "express";
import http from "http";
import {exit} from "process";
import webhookSecrets from "./secrets/webhook.json";
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
    webhooks.get("/test", async (req, res) => {
        const {secret} = req.query;
        if (secret != webhookSecrets.test.secret) {
            res.status(401).send("You don't know the answer!\n");
            return;
        }
        await safeExecuteWebhook(res, webhookSecrets.test.target, {
            content: "Test success!",
            embeds: [{
                title: "This is a test",
                description: "I am testing a webhook. Thanks!",
            }],
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
        res.status(500).send(JSON.stringify({
            id: errorId,
            error: "I was unable to execute the webhook.",
        }));
        return;
    }
    res.send(JSON.stringify({
        message: "I've contacted the Discord Servers. Thanks!",
    }));
}
