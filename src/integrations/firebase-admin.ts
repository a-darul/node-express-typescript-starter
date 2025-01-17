import * as admin from 'firebase-admin';
import { DecodedIdToken } from 'firebase-admin/lib/auth/token-verifier';

import config from '../shared/config';
import { logger } from '../utils/logger';

async function deleteFirebaseUser(uid: string): Promise<void> {
    try {
        await admin.auth().deleteUser(uid);
    } catch (error) {
        logger.error(`Firebase Admin delete user failed.`, error);
    }
}

async function initFirebaseAdmin(): Promise<void> {
    try {
        admin.initializeApp({
            credential: admin.credential.cert(config.FIREBASE.adminSdkConf as admin.ServiceAccount),
        });
        logger.info(`Firebase Admin was initialized successfully.`);
    } catch (error) {
        logger.error(`Firebase Admin initialization failed.`, error);
        process.exit(0);
    }
}

async function verifyFirebaseToken(token: string): Promise<DecodedIdToken | null> {
    try {
        const decodedToken = admin.auth().verifyIdToken(token);
        if (decodedToken) {
            return decodedToken;
        }

        return null;
    } catch (error) {
        logger.error(`Verify firebase failed.`, error);
        return null;
    }
}

export { deleteFirebaseUser, initFirebaseAdmin, verifyFirebaseToken };
