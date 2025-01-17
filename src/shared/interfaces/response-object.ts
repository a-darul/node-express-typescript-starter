export interface IResponseObject {
    success: boolean;
    data?: object;
    errors?: object;
    traceId: string;
}
