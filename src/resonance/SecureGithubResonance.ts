import * as crypto from "crypto";
import {Request} from "koa";
import {UnauthorizedError} from "../middleware/error";
import {WebhookData} from "../simple-discord-webhooks/Webhook";
import {Resonance} from "./Resonance";

export class SecureGithubResonance extends Resonance {
    /**
     * @param secret The secret that is also in the GitHub webhook secret field. It is used to
     * validate that the webhook is coming from an authorized source.
     * @param downstream The downstream resonance to continue to on success
     */
    constructor(
        private readonly secret: string,
        private readonly downstream: Resonance
    ) {
        super(downstream.data);
    }

    async resonate(req: Request): Promise<WebhookData | "ignored"> {
        const signature = req.get("X-Hub-Signature");
        if (!signature.trim() || !signature.includes('=')) {
            throw new UnauthorizedError("No X-Hub-Signature provided, insecure request.");
        }
        if (typeof req.rawBody === "undefined") {
            throw new UnauthorizedError("Body unavailable, cannot verify");
        }
        const [hash, signatureDigest] = signature.split('=', 2);
        const hmac = crypto.createHmac(hash, this.secret);
        const digest = hmac.update(req.rawBody).digest("hex");
        if (digest !== signatureDigest) {
            throw new UnauthorizedError("Signature does not match digest");
        }
        return this.downstream.resonate(req);
    }
}
