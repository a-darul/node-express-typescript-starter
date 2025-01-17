import moment from 'moment';

export function getCurrentTimestampInUnix(): number {
    return moment().unix();
}

export function getUnixMilisecondTimestamp(): string {
    return moment().format(`x`);
}
