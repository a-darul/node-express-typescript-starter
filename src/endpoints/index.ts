import * as Sentry from '@sentry/node';
import { Application, Express, NextFunction, Request, Response } from 'express';
import rateLimit from 'express-rate-limit';
import fs from 'fs';
import klawSync from 'klaw-sync';
import path from 'path';

import { AuthLevel } from '../shared/enums/auth-level';
import { ErrorCode } from '../shared/enums/error-codes';
import { HandlerType } from '../shared/enums/handler-type';
import { MiddlewareDefaultWeights } from '../shared/enums/middleware-default-weights';
import { IHandler } from '../shared/interfaces/handler';
import { IResponseObject } from '../shared/interfaces/response-object';
import { IRoute } from '../shared/interfaces/route';
import { IConfig } from '../shared/interfaces/route-config';
import { noSession } from '../shared/validators/no-session';
import { validateSchema } from '../shared/validators/schema';
import { isUser } from '../shared/validators/user';
import { GenericError } from '../utils/error';

function nextCallback(_: Request, __: Response, next: NextFunction): void {
    next();
}

const loader = (routePath: string, filter: string) => {
    const file = fs.readdirSync(routePath).find((filePath) => filePath.indexOf(filter) !== -1);
    if (!file) {
        return null;
    }
    const fullPath = path.resolve(routePath, file);

    return require(fullPath);
};

const load = () => {
    const basename = path.join(path.resolve(__dirname), `/`);
    const paths = klawSync(basename, { nodir: true })
        .map((fileStats) => fileStats.path)
        .filter((filePath) => filePath.indexOf(`config.`) !== -1);

    const routes: IRoute[] = [];
    paths.forEach((filePath) => {
        const route: IConfig = require(filePath).config;
        if (!route) {
            throw new GenericError(`Route cannot be null/undefined: ${filePath}`, ErrorCode.ROUTE_UNDEFINED);
        }
        const callbacks = autoLoad(filePath.replace(`${path.sep}config.ts`, ``).replace(`${path.sep}config.js`, ``));
        routes.push({ ...route, callbacks });
    });

    return routes.sort((x, y) => (x.weight && y.weight ? x.weight - y.weight : -1));
};

const execute = async (req: Request, res: Response, next: NextFunction, cb: Function) => {
    try {
        if (res.locals.hasError) {
            return next();
        }
        const response = await cb(req, res, next);

        res.locals.data = response.data;
        res.locals.status = response.status;

        return next();
    } catch (error) {
        if (!error.message.includes(`Query single error`)) {
            Sentry.captureException(error);
        }
        res.locals.hasError = true;
        res.locals.errors = [error];
        return next(false);
    }
};

const getErrorCode = (schemaType: string | undefined, errorCode: number | undefined): string => {
    if (schemaType) {
        if (schemaType === `request`) {
            return ErrorCode.UNPROCESSABLE_ENTITY_REQUEST.toString();
        } else if (schemaType === `response`) {
            return ErrorCode.UNPROCESSABLE_ENTITY_RESPONSE.toString();
        }
    }

    return errorCode?.toString() || ``;
};

const getResponseObject = (res: Response): IResponseObject => {
    const response: IResponseObject = {
        success: false,
        traceId: res.locals.traceId,
    };
    if (res.locals.hasError) {
        const errors = res.locals.errors?.map((error: GenericError) => ({
            message: error.message,
            code: getErrorCode(res.locals.schemaType, error.code),
            data: error?.data,
        }));
        response.errors = errors;
        return response;
    }
    response.success = true;
    response.data = res.locals.data;
    return response;
};

const finalCallback = async (_: Request, res: Response): Promise<Response<object, Record<string, object>>> => {
    const status = res.locals.hasError ? 400 : 200;
    return res.status(res.locals.status || status).json(getResponseObject(res));
};

const getHandlers = (
    handlerType: HandlerType,
    handler?: Record<string, Function>,
    requiredFunc?: string,
): IHandler | null => {
    if (handlerType === HandlerType.FINAL) {
        return {
            weight: MiddlewareDefaultWeights.FINAL,
            cb: async (req: Request, res: Response) => {
                await finalCallback(req, res);
            },
        };
    }
    if (!handler) {
        return null;
    }
    if (!requiredFunc || !handler[requiredFunc]) {
        throw new GenericError(`Invalid handler, missing func: '${requiredFunc}'`, ErrorCode.HANDLER_NOT_VALID);
    }
    if (handlerType === HandlerType.REQUEST_SCHEMA && handler?.requestSchema) {
        return {
            weight: MiddlewareDefaultWeights.REQUEST_SCHEMA,
            cb: async (req: Request, res: Response, next: NextFunction) => {
                await validateSchema(req, res, next, req, handler.requestSchema, `request`);
            },
        };
    }
    if (handlerType === HandlerType.EXECUTOR && handler?.execute) {
        return {
            weight: MiddlewareDefaultWeights.EXECUTOR,
            cb: (req: Request, res: Response, next: NextFunction) => {
                execute(req, res, next, handler.execute);
            },
        };
    }
    if (handlerType === HandlerType.RESPONSE_SCHEMA && handler?.responseSchema) {
        return {
            weight: MiddlewareDefaultWeights.RESPONSE_SCHEMA,
            cb: async (req: Request, res: Response, next: NextFunction) => {
                if (!res.locals.hasError) {
                    await validateSchema(req, res, next, res.locals.data, handler.responseSchema, `response`);
                } else {
                    next();
                }
            },
        };
    }

    throw new GenericError(`Invalid handler type: '${handlerType}'`, ErrorCode.HANDLER_TYPE_NOT_VALID);
};

const getAuthCallback = (authLevel: AuthLevel) => {
    switch (authLevel) {
        case AuthLevel.NO_SESSION:
            return noSession;
        case AuthLevel.USER_LOGIN:
            return isUser;
        default:
            break;
    }
};

const autoLoad = (dirPath: string): IHandler[] => {
    const requestSchema = getHandlers(HandlerType.REQUEST_SCHEMA, loader(dirPath, `request.`), `requestSchema`);
    const executors = getHandlers(HandlerType.EXECUTOR, loader(dirPath, `executor.`), `execute`);
    const responseSchema = getHandlers(HandlerType.RESPONSE_SCHEMA, loader(dirPath, `response.`), `responseSchema`);
    const final = getHandlers(HandlerType.FINAL);

    const handlers: IHandler[] = [];
    if (requestSchema) {
        handlers.push(requestSchema);
    }
    if (executors) {
        handlers.push(executors);
    }
    if (responseSchema) {
        handlers.push(responseSchema);
    }
    if (final) {
        handlers.push(final);
    }

    return handlers.sort((x, y) => x.weight - y.weight);
};

export const loadRoutes = (server: Express): void => {
    const routes: IRoute[] = load();
    routes.forEach((route) => {
        const authCallback = getAuthCallback(route.authLevel);
        server[route.httpMethod](
            route.path,
            authCallback as Application,
            route?.rateLimit ? rateLimit(route.rateLimit) : nextCallback,
            route.callbacks.map((c: IHandler) => c.cb as Application),
        );
    });
};
