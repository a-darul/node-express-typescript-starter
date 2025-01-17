const { knexSnakeCaseMappers } = require('objection');

import * as Sentry from '@sentry/node';
import knex, { Knex } from 'knex';
import path from 'path';
import { types } from 'pg';

import { ErrorCode } from '../shared/enums/error-codes';
import { GenericError } from '../utils/error';
import { logger } from '../utils/logger';

let _db: Knex | null = null;

export async function destroyConnection(): Promise<void> {
    if (_db) {
        await _db.destroy();
        logger.info(`Database connection was destroyed successfully.`);
    }
}

export async function execQuery(query: string, data?: Record<string, unknown>): Promise<object[]> {
    try {
        if (!_db) {
            throw new GenericError(`Database is not connected.`, ErrorCode.DATABASE_NOT_CONNECTED);
        }
        let result = null;
        if (data) {
            result = await _db.raw(query, data as unknown as Knex.RawBinding);
        } else {
            result = await _db.raw(query);
        }

        return result.rows;
    } catch (error) {
        Sentry.captureMessage(`SQL query Error`, { extra: { query, data } });
        throw new GenericError(`Query single error: ${error}.`, ErrorCode.DATABASE_QUERY_ERROR);
    }
}

export async function execQuerySingle(query: string, data?: Record<string, unknown>): Promise<object | null> {
    try {
        if (!_db) {
            throw new GenericError(`Database is not connected.`, ErrorCode.DATABASE_NOT_CONNECTED);
        }
        let result = null;
        if (data) {
            result = await _db.raw(query, data as unknown as Knex.RawBinding);
        } else {
            result = await _db.raw(query);
        }

        if (result?.rows?.[0]) {
            return result.rows[0];
        }

        return null;
    } catch (error) {
        Sentry.captureMessage(`SQL query Error`, { extra: { query, data } });
        throw new GenericError(`Query single error: ${error}.`, ErrorCode.DATABASE_QUERY_ERROR);
    }
}

export function getKnex(): Knex {
    if (!_db) {
        throw new GenericError(`Database is not connected.`, ErrorCode.DATABASE_NOT_CONNECTED);
    }
    return _db;
}

export async function initDatabase(config: Knex.Config): Promise<void> {
    try {
        _db = knex({ ...config, ...knexSnakeCaseMappers() });
        await _db.raw(`SELECT 1+1 AS result`);
        logger.info(`Database was initialized successfully.`);
    } catch (error) {
        logger.error(`Database initialization failed.`, error);
        process.exit(0);
    }
}

export async function initializeTypesCast(): Promise<void> {
    if (_db) {
        types.setTypeParser(types.builtins.INT8, (value: string) => {
            return parseInt(value);
        });

        types.setTypeParser(types.builtins.FLOAT8, (value: string) => {
            return parseFloat(value);
        });

        types.setTypeParser(types.builtins.NUMERIC, (value: string) => {
            return parseFloat(value);
        });
        logger.info(`Database type cast set successfully.`);
    }
}

export async function runMigrations(): Promise<void> {
    if (_db) {
        await _db.migrate.latest({ disableMigrationsListValidation: true });
        logger.info(`Migrations were run successfully.`);
    }
}

export async function runSchedulers(): Promise<void> {
    if (_db) {
        await _db.migrate.latest({
            directory: path.resolve(__dirname, `./schedulers`),
            disableMigrationsListValidation: true,
        });
        logger.info(`Schedulers were run successfully.`);
    }
}

export async function runSeeds(): Promise<void> {
    if (_db) {
        await _db.migrate.latest({
            directory: path.resolve(__dirname, `${process.env.NODE_ENV === `PROD` ? `./seeds-prod` : `./seeds-dev`}`),
            disableMigrationsListValidation: true,
        });
        logger.info(`Seeds were run successfully.`);
    }
}
