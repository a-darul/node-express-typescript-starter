import { NextFunction, Request, Response } from 'express';

const noSession = async (_: Request, res: Response, next: NextFunction): Promise<void> => {
    res.locals.user = { noSession: true };
    next();
};

export { noSession };
