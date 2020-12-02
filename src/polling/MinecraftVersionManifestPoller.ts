import axios from "axios";
import {getOrDefault} from "../level";
import {SECRETS} from "../secrets/webhooks";
import {WebhookData} from "../simple-discord-webhooks/Webhook";
import {Poller} from "./Poller";

const VERSION_MANIFEST_URL = "https://launchermeta.mojang.com/mc/game/version_manifest.json";

const LATEST_DB_KEY = "launcher.meta.latest";

async function handleChange(saved: LatestVersions,
                            current: LatestVersions,
                            field: keyof LatestVersions): Promise<WebhookData> {
    saved[field] = current[field];
    await SECRETS.db.put(LATEST_DB_KEY, saved);
    return {
        embeds: [{
            title: `Minecraft ${field[0].toUpperCase() + field.substring(1)} ${saved[field]}`,
            description: `Minecraft **${saved[field]}** was just released!`,
        }],
    };
}

export async function getSavedLatestVersions(): Promise<LatestVersions | undefined> {
    return getOrDefault<LatestVersions>(SECRETS.db, LATEST_DB_KEY);
}

export class MinecraftVersionManifestPoller extends Poller {
    async poll(): Promise<WebhookData | "ignored"> {
        const savedLatest = await getSavedLatestVersions();
        const {latest: currentLatest} = (await axios.get(VERSION_MANIFEST_URL, {timeout: 1000})).data as VersionManifest;

        if (typeof savedLatest === "undefined") {
            await SECRETS.db.put(LATEST_DB_KEY, currentLatest);
            return "ignored";
        }

        if (savedLatest.release !== currentLatest.release) {
            return handleChange(savedLatest, currentLatest, "release");
        }
        if (savedLatest.snapshot !== currentLatest.snapshot) {
            return handleChange(savedLatest, currentLatest, "snapshot");
        }
        console.log(`[${new Date()}] [${this.data.name}] Polled ${JSON.stringify(currentLatest)} from Mojang`);
        return "ignored";
    }
}

interface VersionManifest {
    latest: LatestVersions
}

export interface LatestVersions {
    release: string
    snapshot: string
}
