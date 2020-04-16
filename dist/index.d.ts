import { Middleware } from 'natur';
declare type Data = {
    [m: string]: any;
};
declare type CreateLocalStorageMiddleware = {
    name?: string;
    time?: number;
    exclude?: Array<RegExp | string>;
    specific?: {
        [n: string]: number;
    };
};
declare function createPersistMiddleware({ name, time, exclude, specific }: CreateLocalStorageMiddleware): {
    middleware: Middleware;
    getData: () => Data;
    clearData: () => void;
};
export default createPersistMiddleware;
