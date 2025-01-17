import { NextFunction, Request, Response } from 'express';

import { User } from '../../data-access/models/user';
import repositories from '../../data-access/repositories';
import { verifyFirebaseToken } from '../../integrations/firebase-admin';
import config from '../../shared/config';
import { ErrorCode } from '../enums/error-codes';

const isUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const token = req.headers.authorization;
    if (!token || !token.startsWith('Bearer ')) {
        res.status(ErrorCode.UNAUTHORIZED).send('You are not authorized to access this resource');
        return;
    }

    const platform = req.headers.platform as string;
    if (!platform) {
        res.status(ErrorCode.UNAUTHORIZED).send(`You must provide a platform header`);
        return;
    } else if (![config.PLATFORM.android.value, config.PLATFORM.ios.value].includes(platform)) {
        res.status(ErrorCode.UNAUTHORIZED).send(`You must provide a valid platform header`);
        return;
    }

    const version = req.headers.version as string;
    if (!version) {
        res.status(ErrorCode.UNAUTHORIZED).send(`You must provide a version header`);
        return;
    }

    try {
        const decodedToken = await verifyFirebaseToken(token.replace('Bearer ', ''));
        if (!decodedToken?.email) {
            res.status(ErrorCode.UNAUTHORIZED).send('Unauthorized');
            return;
        }

        let registeredUser = await repositories.users.findUserByEmail(decodedToken.email);
        if (!registeredUser) {
            registeredUser = await repositories.users.insertUser({
                email: decodedToken.email,
                name: decodedToken.name,
                image: decodedToken.picture,
                version,
                platform,
                firebaseUid: decodedToken.uid,
            } as User);
        }

        res.locals.user = registeredUser;
        next();
    } catch (error) {
        res.status(ErrorCode.UNAUTHORIZED).send(error.message);
    }
};

export { isUser };
