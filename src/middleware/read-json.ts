import {Middleware} from "koa";
import getRawBody from "raw-body";
import {BadRequestError, UnsupportedMediaTypeError} from "./error";

declare module "koa" {
    interface Request {
        body?: unknown;
        rawBody?: Buffer;
    }
}

export function readJson(): Middleware {
    return async (ctx, next): Promise<void> => {
        if (!ctx.is("application/json")) {
            return next();
        }

        const rawBody = await getRawBody(ctx.req, {
            length: ctx.length,
            limit: '30mb',
        });

        const charset = ctx.request.charset || "utf8";

        if (!Buffer.isEncoding(charset)) {
            throw new UnsupportedMediaTypeError(`Charset ${charset} is not supported.`);
        }

        try {
            const str = rawBody.toString(charset);
            ctx.request.body = JSON.parse(str);
        } catch (e) {
            if (e instanceof SyntaxError) {
                throw new BadRequestError("Invalid JSON syntax");
            }
            throw e;
        }

        await next();
    };
}
