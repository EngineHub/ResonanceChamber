import {Request} from "koa";
import {UnauthorizedError} from "../middleware/error";
import {WebhookData} from "../simple-discord-webhooks/Webhook";
import {Resonance, ResonanceData} from "./Resonance";

export interface TestResonanceData extends ResonanceData {
    readonly secret: string
}

export class TestResonance extends Resonance<TestResonanceData> {
    async resonate(req: Request): Promise<WebhookData | "ignored"> {
        const secret = req.get("X-Secret");
        if (secret !== this.data.secret) {
            throw new UnauthorizedError("You don't know the secret!");
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
