import fs from 'fs';
import { OpenAPIV3 } from 'openapi-types';
import path from 'path';

import { AuthLevel } from '../enums/auth-level';

const loadFile = (filePath: string) => {
    const jsFilePath = filePath.replace(/\.ts$/, `.js`);
    if (fs.existsSync(jsFilePath)) {
        return require(jsFilePath);
    } else if (fs.existsSync(filePath)) {
        return require(filePath);
    }
    return null;
};

const formatTagName = (tag: string) => {
    return tag
        .split(`-`)
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(` `);
};

const mapAuthLevelToSecurity = (authLevel: AuthLevel) => {
    switch (authLevel) {
        case AuthLevel.USER_LOGIN:
            return [{ USER_LOGIN: [] }];
        case AuthLevel.ADMIN_LOGIN:
            return [{ ADMIN_LOGIN: [] }];
        default:
            return [];
    }
};

const transformPath = (path: string) => {
    return path.replace(`(\\d+)`, ``).replace(/:([^/]+)/g, `{$1}`);
};

const ajvSchemaToSwagger = (schema: any) => {
    if (Array.isArray(schema.type) && schema.type.includes(`null`)) {
        schema.type = schema.type.find((type: string) => type !== `null`);
        schema.nullable = true;
    }

    if (schema.properties) {
        Object.keys(schema.properties).forEach((key) => {
            schema.properties[key] = ajvSchemaToSwagger(schema.properties[key]);
        });
    }

    if (schema.items) {
        if (Array.isArray(schema.items)) {
            schema.items = schema.items.map((item: any) => ajvSchemaToSwagger(item));
        } else {
            schema.items = ajvSchemaToSwagger(schema.items);
        }
    }

    return schema;
};

const buildSwaggerPaths = (
    endpointsDir: string,
    excludeDirs: string[] = [],
    globalHeaders: OpenAPIV3.ParameterObject[] = [],
): { [key: string]: { [method: string]: OpenAPIV3.OperationObject } } => {
    const paths: { [key: string]: { [method: string]: OpenAPIV3.OperationObject } } = {};
    const tags = fs.readdirSync(endpointsDir);

    tags.forEach((tag) => {
        if (excludeDirs.concat('index.ts').includes(tag)) {
            return;
        }

        const tagDir = path.join(endpointsDir, tag);
        const operations = fs.readdirSync(tagDir);

        operations.forEach((operation) => {
            const operationDir = path.join(tagDir, tagDir.includes('application') ? operation : operation + '/v1');
            const configPath = path.join(operationDir, `config.ts`);
            const requestPath = path.join(operationDir, `request.ts`);
            const responsePath = path.join(operationDir, `response.ts`);

            const config = loadFile(configPath)?.config;
            const requestSchema = loadFile(requestPath)?.requestSchema;
            const responseSchema = loadFile(responsePath)?.responseSchema;

            if (config && config.path && config.httpMethod) {
                const transformedPath = transformPath(config.path);
                if (!paths[transformedPath]) {
                    paths[transformedPath] = {};
                }

                const method = config.httpMethod.toLowerCase();
                const pathObject: OpenAPIV3.OperationObject = {
                    tags: [formatTagName(tag)],
                    summary: formatTagName(operation),
                    security: mapAuthLevelToSecurity(config.authLevel),
                    responses: {
                        '200': {
                            description: `Successful response`,
                            content: {
                                'application/json': {
                                    schema: {
                                        type: `object`,
                                        properties: {
                                            success: {
                                                type: `boolean`,
                                                example: true,
                                            },
                                            traceId: {
                                                type: `string`,
                                                example: `f458b7ec-fdbd-4cf4-8a26-5edaa9cc57c8`,
                                            },
                                            data: responseSchema
                                                ? ajvSchemaToSwagger(responseSchema)
                                                : { type: `object` },
                                        },
                                    },
                                },
                            },
                        },
                        '400': {
                            description: `Handled error response `,
                            content: {
                                'application/json': {
                                    schema: {
                                        type: `object`,
                                        properties: {
                                            success: {
                                                type: `boolean`,
                                                example: false,
                                            },
                                            traceId: {
                                                type: `string`,
                                                example: `5de05b92-7070-4320-8e08-07889c769617`,
                                            },
                                            errors: {
                                                type: `array`,
                                                items: {
                                                    type: `object`,
                                                    properties: {
                                                        message: {
                                                            type: `string`,
                                                        },
                                                        code: {
                                                            type: `string`,
                                                        },
                                                    },
                                                },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                };

                if (config.deprecated) {
                    pathObject.deprecated = true;
                }

                const parameters: OpenAPIV3.ParameterObject[] = [];

                if (requestSchema) {
                    const { params, query, body, headers } = requestSchema.properties;

                    if (params) {
                        Object.keys(params.properties).forEach((paramName) => {
                            parameters.push({
                                name: paramName,
                                in: `path`,
                                required: params.required?.includes(paramName),
                                schema: params.properties[paramName],
                            });
                        });
                    }

                    if (query) {
                        Object.keys(query.properties).forEach((queryParam) => {
                            parameters.push({
                                name: queryParam,
                                in: `query`,
                                required: query.required?.includes(queryParam),
                                schema: query.properties[queryParam],
                                description: query.properties[queryParam].description,
                            });
                        });
                    }

                    if (body) {
                        pathObject[`requestBody`] = {
                            description: body.description,
                            content: {
                                'application/json': {
                                    schema: ajvSchemaToSwagger(body),
                                },
                            },
                        };
                    }

                    if (headers) {
                        Object.keys(headers.properties).forEach((headerName) => {
                            parameters.push({
                                name: headerName,
                                in: `header`,
                                schema: headers.properties[headerName],
                                description: headers.properties[headerName].description,
                            });
                        });
                    }
                }

                globalHeaders.forEach((globalHeader) => {
                    parameters.push(globalHeader);
                });

                pathObject.parameters = parameters;

                paths[transformedPath][method] = pathObject;
            }
        });
    });

    return paths;
};

export default buildSwaggerPaths;
