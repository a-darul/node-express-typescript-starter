import { AuthLevel } from '../../../../shared/enums/auth-level';
import { HttpMethod } from '../../../../shared/enums/http-method';
import { IConfig } from '../../../../shared/interfaces/route-config';

export const config: IConfig = {
    authLevel: AuthLevel.USER_LOGIN,
    httpMethod: HttpMethod.POST,
    path: `/v1/auth/google-verify`,
};
