import { Express, NextFunction, Request, Response } from 'express';
import swaggerUi from 'swagger-ui-express';

import mobileSwaggerDocument from './mobile-docs';

const passwordProtected = (username: string, password: string) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const authHeader = req.header(`Authorization`);
        const validAuth = `Basic ` + Buffer.from(`${username}:${password}`).toString(`base64`);

        if (!authHeader || authHeader !== validAuth) {
            res.setHeader(`WWW-Authenticate`, `Basic realm="Access to API docs"`);
            res.status(401).send(`Unauthorized`);
            return;
        }

        next();
    };
};

export const configureSwaggerDocs = (app: Express) => {
    if (process.env.NODE_ENV !== `STG` && process.env.NODE_ENV !== `PROD`) {
        app.use(
            `/mobile-api-docs`,
            passwordProtected(`fammap`, `docs`),
            swaggerUi.serveFiles(mobileSwaggerDocument),
            (_: Request, res: Response) => {
                const html = swaggerUi.generateHTML(mobileSwaggerDocument);
                res.send(html);
            },
        );
    }
};
