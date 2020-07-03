import {Request} from "express";
import {WebhookData} from "../simple-discord-webhooks/Webhook";
import {Resonance} from "./Resonance";

export class TestResonance extends Resonance {

    constructor(
        route: string,
        hookTarget: string,
        private readonly secret: string,
    ) {
        super(route, hookTarget);
    }

    async resonate(req: Request): Promise<WebhookData | "rejected" | "ignored"> {
        const {secret} = req.query;
        if (secret !== this.secret) {
            return "rejected";
        }
        return {
            content: "Test success!",
            embeds: [{
                title: "This is a test",
                description: "I am testing a webhook. Thanks!",
            }],
        };
    }
}
