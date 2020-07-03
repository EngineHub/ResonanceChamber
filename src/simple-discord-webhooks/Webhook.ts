import axios from "axios";
import {AllowedMentions} from "./AllowedMentions";
import {Embed} from "./Embed";

export interface BaseWebhookData {
    content?: string;
    embeds?: Embed[];
    allowedMentions?: AllowedMentions;
    username?: string;
    avatarUrl?: string;
    tts?: boolean;
}

export interface ContentRequiredWebhookData extends BaseWebhookData {
    content: string;
}

export interface EmbedsRequiredWebhookData extends BaseWebhookData {
    embeds: Embed[];
}

export type WebhookData = ContentRequiredWebhookData | EmbedsRequiredWebhookData;

/**
 * Execute a webhook.
 * @param target the URL to send the data to for execution
 * @param data the webhook data
 */
export async function executeWebhook(target: string, data: WebhookData): Promise<void> {
    if (typeof data.content === "undefined" && typeof data.embeds === "undefined") {
        throw new Error("Must define either content of embeds");
    }
    return axios.post(
        `${target}?wait=true`,
        {
            content: data.content,
            embeds: data.embeds,
            username: data.username,
            avatar_url: data.avatarUrl,
            tts: data.tts,
            allowed_mentions: data.allowedMentions,
        },
        {
            headers: {
                "Content-type": "application/json",
            },
        },
    );
}
