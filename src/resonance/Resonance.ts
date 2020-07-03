import {Request} from "express";
import {WebhookData} from "../simple-discord-webhooks/Webhook";

export interface ResonanceData {
    readonly route: string,
    readonly hookTarget: string,
}

export abstract class Resonance<D extends ResonanceData = ResonanceData> {
    constructor(
        public readonly data: D
    ) {
    }

    abstract async resonate(req: Request): Promise<WebhookData | "rejected" | "ignored">
}
