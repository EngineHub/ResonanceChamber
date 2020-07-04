import {promisify} from "util";
import {Poller} from "./polling/Poller";
import {SECRETS} from "./secrets/webhooks";
import {executeWebhook} from "./simple-discord-webhooks/Webhook";

async function doPoll(poller: Poller): Promise<void> {
    try {
        const data = await poller.poll();
        if (data === "ignored") {
            return;
        }
        await executeWebhook(poller.data.hookTarget, data);
        console.info(`[${poller.data.name}] Sent webhook message to Discord!`);
    } catch (e) {
        console.warn(`[${poller.data.name}] Error during processing`, e);
    }
}

export function startPollManager(): void {
    SECRETS.pollers.forEach(poller => {
        function periodPromise(): Promise<void> {
            return promisify(setTimeout)(poller.data.periodMillis);
        }

        console.log(`[${poller.data.name}] Starting, checking every ${poller.data.periodMillis}ms`);
        Promise.resolve()
            .then(async () => {
                // We intend to loop forever here, as we don't expect to stop polling
                // eslint-disable-next-line no-constant-condition
                while (true) {
                    await periodPromise();
                    await doPoll(poller);
                }
            });
    });
    console.log("Pollers are running");
}
