import {Request} from "express";
import {WebhookData} from "../simple-discord-webhooks/Webhook";
import {Resonance, ResonanceData} from "./Resonance";

export interface TestResonanceData extends ResonanceData {
    readonly secret: string
}

export class TestResonance extends Resonance<TestResonanceData> {
    async resonate(req: Request): Promise<WebhookData | "rejected" | "ignored"> {
        const {secret} = req.query;
        if (secret !== this.data.secret) {
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
