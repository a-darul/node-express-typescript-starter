import { Request, Response } from 'express';

import { IExecutorResponse } from '../../../../shared/interfaces/executor-response';

export async function execute(_: Request, res: Response): Promise<IExecutorResponse> {
    return { status: 200, data: res.locals.user };
}
