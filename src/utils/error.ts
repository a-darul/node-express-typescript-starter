import { logger } from './logger';

class GenericError extends Error {
    code?: number;
    data?: object;

    constructor(message: string, code?: number, data?: object) {
        super(message);
        this.code = code;
        this.data = data;
        logger.error(message, { code, data });
    }
}

class ForbiddenError extends GenericError {
    constructor(message?: string, code?: number) {
        super(message || `Forbidden.`, code);
    }
}

class NotFoundError extends GenericError {
    constructor(message: string, code?: number) {
        super(message, code);
    }
}
class UnauthorizedError extends GenericError {
    constructor(message?: string, code?: number) {
        super(message || `Unauthorized.`, code);
    }
}

class UserCredentialsError extends GenericError {
    constructor(code?: number) {
        super(`User credentials invalid.`, code);
    }
}

export { ForbiddenError, GenericError, NotFoundError, UnauthorizedError, UserCredentialsError };
