import {Poller} from "./polling/Poller";
import {SECRETS} from "./secrets/webhooks";
import {pollerAwareBackOff} from "./polling/poller-aware-back-off";

async function tryPoll(poller: Poller): Promise<boolean> {
    try {
        await pollerAwareBackOff(poller);
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
