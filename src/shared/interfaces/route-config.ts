import { Options } from 'express-rate-limit';

import { AuthLevel } from '../enums/auth-level';
import { HttpMethod } from '../enums/http-method';

export interface IConfig {
    authLevel: AuthLevel;
    httpMethod: HttpMethod;
    path: string;
    weight?: number;
    rateLimit?: Partial<Options>;
    deprecated?: boolean;
}
