import crypto from 'node:crypto';

export function generateRandomString(length: number): string {
    return crypto
        .randomBytes(Math.ceil(length / 2))
        .toString('hex')
        .slice(0, length);
}

export function getRandomUuid(): string {
    return crypto.randomUUID();
}
