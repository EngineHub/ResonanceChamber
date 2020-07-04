import {backOff} from "exponential-backoff";
import {Poller} from "./polling/Poller";
import {SECRETS} from "./secrets/webhooks";
import {executeWebhook} from "./simple-discord-webhooks/Webhook";

function runPoller(poller: Poller) {
    return async (): Promise<void> => {
        const data = await poller.poll();
        if (data === "ignored") {
            return;
        }
        await executeWebhook(poller.data.hookTarget, data);
        console.info(`[${poller.data.name}] Sent webhook message to Discord!`);
    };
}

async function tryPoll(poller: Poller): Promise<boolean> {
    try {
        await backOff(runPoller(poller), {
            delayFirstAttempt: true,
            startingDelay: poller.data.periodMillis,
            jitter: "full",
            retry(e: unknown, attemptNumber: number): boolean {
                // Do not log the error here for cleaner logs
                console.warn(`[${poller.data.name}] Retrying due to error (attempt ${attemptNumber})`);
                return true;
            }
        });
        return true;
    } catch (e) {
        console.warn(`[${poller.data.name}] Error during processing`, e);
        return false;
    }
}

export function startPollManager(): void {
    SECRETS.pollers.forEach(poller => {
        console.log(`[${poller.data.name}] Starting, checking every ${poller.data.periodMillis}ms`);
        Promise.resolve()
            .then(async () => {
                // We intend to loop forever here, as we don't expect to stop polling
                // eslint-disable-next-line no-constant-condition
                while (true) {
                    await tryPoll(poller);
                }
            });
    });
    console.log("Pollers are running");
}
