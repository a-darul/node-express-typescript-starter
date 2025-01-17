import { OpenAPIV3 } from 'openapi-types';
import path from 'path';

import buildSwaggerPaths from './helper';

const mobileHeaders: OpenAPIV3.ParameterObject[] = [
    {
        name: `platform`,
        in: `header`,
        required: true,
        schema: {
            type: `string`,
            enum: [`android`, `ios`],
            example: `android`,
        },
        description: `Platform from which the request is made`,
    },
    {
        name: `version`,
        in: `header`,
        required: true,
        schema: {
            type: `string`,
            example: `1.0.0`,
        },
        description: `Version of the client making the request`,
    },
];

const mobileSwaggerDocument: OpenAPIV3.Document = {
    openapi: `3.0.0`,
    info: {
        title: `Mobile API`,
        version: `1.0.0`,
        description: `API Documentation For Mobile Application`,
    },
    components: {
        securitySchemes: {
            USER_LOGIN: {
                type: `http`,
                scheme: `bearer`,
                bearerFormat: `JWT`,
                description: `JWT token from Google Auth`,
            },
        },
    },
    paths: buildSwaggerPaths(path.join(__dirname, `../../endpoints`), [`admin`], mobileHeaders),
};

if (process.env.NODE_ENV === `DEV`) {
    mobileSwaggerDocument[`servers`] = [
        {
            url: `https://api.development.project.com`,
        },
    ];
}

export default mobileSwaggerDocument;
