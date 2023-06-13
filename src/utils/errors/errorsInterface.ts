export interface Error {
    name: string;
    message: string;
    stack?: string;
}

export interface ErrorConstructor {
    new (message?: string): Error;
    (message?: string): Error;
    readonly prototype: Error;
}
export interface ErrorProps {
    message: string;
    error?: any;
    errorType?: string;
    httpCode?: any;
    status?: number;
}
