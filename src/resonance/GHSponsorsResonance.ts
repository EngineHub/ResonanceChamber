import {Request} from "koa";
import {WebhookData} from "../simple-discord-webhooks/Webhook";
import {Resonance} from "./Resonance";
import {handlePing, isEvent} from "../util/github";

export class GHSponsorsResonance extends Resonance {
    async resonate(req: Request): Promise<WebhookData | "ignored"> {
        if (handlePing(this.data.route, req) || !isEvent(req, "sponsorship")) {
            return "ignored";
        }
        const payload = req.body as SponsorshipPayload;
        const sponsorable = payload.sponsorship.sponsorable.login;
        const sponsor = payload.sponsorship.sponsor.login;
        const currentTier = payload.sponsorship.tier.name;
        switch (payload.action) {
            case "created":
                return {
                    embeds: [{
                        title: "Sponsorship Created!",
                        description: `**${sponsor}** has sponsored **${sponsorable}** with the tier **${currentTier}**`,
                    }],
                };
            case "cancelled":
                return {
                    embeds: [{
                        title: "Sponsorship Cancelled...",
                        description: `**${sponsor}** is no longer sponsoring **${sponsorable}** with the tier **${currentTier}**`,
                    }]
                };
            case "tier_changed":
                return {
                    embeds: [{
                        title: "Sponsorship Tier Changed",
                        description: `**${sponsor}** is now sponsoring **${sponsorable}** with the **${currentTier}** tier instead of` +
                            ` **${payload.changes?.tier?.from?.name}**`,
                    }]
                };
        }
        return "ignored";
    }
}

interface SponsorshipPayload {
    action: "created" | "cancelled" | "edited" | "tier_changed" | "pending_cancellation" | "pending_tier_change"
    effective_date: string
    sponsorship: Sponsorship
    changes?: SponsorshipChange
    sender: User
}

interface Sponsorship {
    sponsorable: User
    sponsor: User
    tier: Tier
}

interface User {
    login: string
}

interface Tier {
    name: string
}

interface SponsorshipChange {
    tier?: TierChange
}

interface TierChange {
    from: Tier
}
