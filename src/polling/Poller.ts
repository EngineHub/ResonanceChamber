import {WebhookData} from "../simple-discord-webhooks/Webhook";

export interface PollerData {
    readonly name: string;
    readonly hookTarget: string;
    readonly periodMillis: number;
}

export abstract class Poller {
    constructor(
        public readonly data: PollerData
    ) {
    }

    abstract poll(): Promise<WebhookData | "ignored">
}
