import cors from 'cors';
import express from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';

import { initDatabase, initializeTypesCast, runMigrations, runSeeds } from './data-access';
import { loadRoutes } from './endpoints';
import { initFirebaseAdmin } from './integrations/firebase-admin';
import config from './shared/config';
import { getRandomUuid } from './utils/crypto';
import { logger } from './utils/logger';

const app = express();
const host = process.env.SERVER_HOST || process.env.host;
const port = process.env.SERVER_PORT || 3001;
const env = process.env.NODE_ENV;

const options: cors.CorsOptions = {
    allowedHeaders: [
        `Origin`,
        `X-Requested-With`,
        `Content-Type`,
        `Accept`,
        `X-Access-Token`,
        `allowedHeaders`,
        `Authorization`,
        `Platform`,
        `Version`,
    ],
    methods: `GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE`,
    origin: `*`,
    preflightContinue: false,
    optionsSuccessStatus: 204,
};

const limiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 300,
    message: `Too many requests`,
});

async function run() {
    const corsOpts = cors(options);
    app.options(`*`, corsOpts);
    app.use(cors(options));
    app.use(helmet());
    app.use(limiter);

    app.use(express.json({ limit: `50mb` }));

    app.use(express.urlencoded({ extended: true }));

    app.use((req, res, next) => {
        const traceId = req.headers[`trace-id`]?.toString() || getRandomUuid();
        res.locals.traceId = traceId;
        res.locals.hasError = false;
        res.locals.errors = [];

        logger.info(`ROUTE`, {
            path: req.originalUrl,
            traceId,
            method: req.method,
        });

        res.type(`json`);

        next();
    });

    loadRoutes(app);

    initDatabase(config.DB_CONNECTION);

    await runMigrations();
    await runSeeds();

    await initializeTypesCast();

    await initFirebaseAdmin();

    app.use((_, res) => {
        if (!res?.statusMessage) {
            res.status(404).send({ message: `Not found` });
        }
        return;
    });

    app.listen(port, () => {
        logger.info(`${env} server up and running on ${host}:${port}`);
    });
}

run();
