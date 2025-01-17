import Ajv, { AnySchema, ErrorObject } from 'ajv';
import addFormats from 'ajv-formats';
import { Request, Response } from 'express';

interface IValidationResponse {
    valid: boolean | Promise<unknown>;
    errors: ErrorObject<string, Record<string, unknown>, unknown>[] | null | undefined | any;
    message: string;
}

const validator = new Ajv({ coerceTypes: true, useDefaults: true, allowUnionTypes: true, strictSchema: false });
addFormats(validator);

export function validateSchema(
    _: Request,
    res: Response,
    next: Function,
    object: object,
    schema: AnySchema,
    schemaType: string,
): void {
    let result: IValidationResponse;
    try {
        result = {
            valid: validator.validate(schema, object),
            errors: validator.errors?.map((e) => ({
                ...e,
                message: `${e.instancePath} ${e.message} ${e.params?.allowedValues || ``}`,
            })),
            message: validator.errorsText(),
        };
    } catch (error) {
        result = {
            valid: false,
            errors: [error as ErrorObject<string, Record<string, unknown>, unknown>],
            message: `Unexpected validation error`,
        };
    }

    if (!result.valid) {
        res.locals.hasError = true;
        res.locals.errors = result.errors;
        res.locals.schemaType = schemaType;
    }
    next();
}
