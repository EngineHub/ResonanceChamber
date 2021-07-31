import {Request} from "koa";
import axios, {AxiosRequestConfig} from "axios";

export interface MufflerData {
    readonly route: string;
    readonly hookTarget: string;
}

/**
 * Narrows webhook requests and redirects them to another Discord endpoint.
 */
export abstract class Muffler<D extends MufflerData = MufflerData> {
    constructor(
        public readonly data: D
    ) {
    }

    abstract muffle(req: Request): Promise<AxiosRequestConfig | "ignored">
}

const presetAxios = axios.create({
    timeout: 5000,
    headers: {
        "Content-type": "application/json",
    },
});

/**
 * Execute a muffler webhook.
 * @param target the URL to send the data to for execution
 * @param config the request base
 */
export async function executeMuffler(target: string, config: AxiosRequestConfig): Promise<void> {
    return presetAxios.request({
        ...config,
        method: "POST",
        url: `${target}?wait=true`,
    });
}
