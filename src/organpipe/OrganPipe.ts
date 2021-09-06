import {Request} from "koa";
import axios, {AxiosRequestConfig} from "axios";

export interface OrganPipeData {
    readonly route: string;
}

export interface OrganPipeResult {
    readonly config: AxiosRequestConfig;
    readonly target: string;
}

/**
 * Narrows webhook requests and redirects them to another Discord endpoint.
 */
export abstract class OrganPipe<D extends OrganPipeData = OrganPipeData> {
    constructor(
        public readonly data: D
    ) {
    }

    abstract determinePipe(req: Request): Promise<OrganPipeResult | "ignored">
}

const presetAxios = axios.create({
    timeout: 5000,
    headers: {
        "Content-type": "application/json",
    },
});

/**
 * Execute an organ pipe webhook.
 * @param result organ pipe result
 */
export async function executeOrganPipe(result: OrganPipeResult): Promise<void> {
    return presetAxios.request({
        ...result.config,
        method: "POST",
        url: `${result.target}?wait=true`,
    });
}
