import Router from "@koa/router";
import * as crypto from "crypto";
import Koa, {Response} from "koa";
import http from "http";
import json from "koa-json";
import {exit} from "process";
import {readJson} from "./middleware/read-json";
import {SECRETS} from "./secrets/webhooks";
import {executeWebhook} from "./simple-discord-webhooks/Webhook";
import {getSavedLatestVersions} from "./polling/MinecraftVersionManifestPoller";
import {executeOrganPipe} from "./organpipe/OrganPipe";

export function startHttpServer(port: number, host: string): void {
    console.info("Creating HTTP server...");

    const app = new Koa();

    app.use(json());

    app.use(async (ctx, next) => {
        try {
            await next();
        } catch (err) {
            const fixedErr = err as {statusCode?: number, status?: number, message: string};
            // will only respond with JSON
            ctx.status = fixedErr.statusCode || fixedErr.status || 500;
            ctx.body = {
                error: fixedErr.message
            };
        }
    });

    app.use(readJson());

    const router = setupRouting();
    app.use(router.routes());
    app.use(router.allowedMethods());

    const server = http.createServer(app.callback());

    server.on("listening", () => {
        console.info(`HTTP Server is listening on port ${port}`);
    });
    server.on("error", (e: unknown) => {
        if ((e as { code: string }).code === "EADDRINUSE") {
            console.error(`The port ${port} is in use.`);
            exit(1);
        }
    });

    server.listen(port, host);
}

function setupRouting(): Router {
    const webhooks = new Router();
    const seenRoutes = new Set<string>();
    SECRETS.resonances.forEach(resonance => {
        const route = resonance.data.route;
        if (seenRoutes.has(route)) {
            throw new Error(`Duplicate route ${route}`);
        }
        webhooks.post(route, async (ctx) => {
            const res = ctx.response;
            const result = await resonance.resonate(ctx.request);
            if (result === "ignored") {
                // Not a call we care about
                res.status = 204;
                return;
            }
            await safeExecuteFunction(res, () => executeWebhook(resonance.data.hookTarget, result));
        });
    });
    SECRETS.organPipes.forEach(organPipe => {
        const route = organPipe.data.route;
        if (seenRoutes.has(route)) {
            throw new Error(`Duplicate route ${route}`);
        }
        webhooks.post(route, async (ctx) => {
            const res = ctx.response;
            const result = await organPipe.determinePipe(ctx.request);
            if (result === "ignored") {
                // Not a call we care about
                res.status = 204;
                return;
            }
            await safeExecuteFunction(res, () => executeOrganPipe(result));
        });
    });

    const router = new Router();
    router.use("/webhooks", webhooks.routes(), webhooks.allowedMethods());
    router.get("/latest-mc-versions-recorded", async (ctx) => {
        const versions = await getSavedLatestVersions();
        ctx.response.status = 200;
        ctx.response.body = {
            versions
        };
    });

    return router;
}

async function safeExecuteFunction(res: Response, func: () => Promise<void>): Promise<void> {
    try {
        await func();
    } catch (e) {
        const errorId = crypto.randomBytes(10).toString("hex");
        console.warn(errorId, e);
        res.status = 500;
        res.body = {
            id: errorId,
            error: "I was unable to execute the webhook.",
        };
        return;
    }
    res.status = 200;
    res.body = {
        message: "I've contacted the Discord Servers. Thanks!",
    };
}
