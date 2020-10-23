import {Poller} from "./Poller";
import {executeWebhook} from "../simple-discord-webhooks/Webhook";

async function runPoller(poller: Poller): Promise<void> {
    const data = await poller.poll();
    if (data === "ignored") {
        return;
    }
    await executeWebhook(poller.data.hookTarget, data);
    console.info(`[${poller.data.name}] Sent webhook message to Discord!`);
}

function sleep(delay: number): Promise<void> {
    return new Promise(resolve => setTimeout(() => resolve(), delay));
}

export async function pollerAwareBackOff(poller: Poller): Promise<void> {
    await sleep(poller.data.periodMillis);
    let iterations = 0;
    let lastError: unknown | undefined;
    while (iterations < 10) {
        try {
            await runPoller(poller);
            return;
        } catch (e) {
            console.warn(`[${poller.data.name}] Retrying due to error (attempt ${iterations})`);
            lastError = e;
        }

        iterations++;
        await sleep(Math.random() * Math.pow(2, iterations));
    }
    throw lastError || "no error?";
}