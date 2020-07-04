import {Request} from "koa";

export function isEvent(req: Request, event: string): boolean {
    return req.get("X-GitHub-Event") === event;
}

export function handlePing(route: string, req: Request): boolean {
    if (!isEvent(req, "ping")) {
        return false;
    }
    const {zen} = req.body as {zen: string};
    console.log(`[${route}] I was pinged by GitHub! They said ${zen}`);
    return true;
}
