export class HttpError extends Error {
    constructor(
        message: string,
        public readonly statusCode: number,
        public readonly expose = true,
    ) {
        super(message);
    }
}

export class BadRequestError extends HttpError {
    constructor(message: string, expose = true) {
        super(message, 400, expose);
    }
}

export class UnauthorizedError extends HttpError {
    constructor(message: string, expose = true) {
        super(message, 401, expose);
    }
}

export class UnsupportedMediaTypeError extends HttpError {
    constructor(message: string, expose = true) {
        super(message, 415, expose);
    }
}
