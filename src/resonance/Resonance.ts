import {Request} from "express";
import {WebhookData} from "../simple-discord-webhooks/Webhook";

export abstract class Resonance {
    protected constructor(
        public readonly route: string,
        public readonly hookTarget: string,
    ) {
    }

    abstract async resonate(req: Request): Promise<WebhookData | "rejected" | "ignored">
}
