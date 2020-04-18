import { Middleware } from 'natur';
declare type Data = {
    [m: string]: any;
};
declare type CreateLocalStorageMiddleware = {
    name?: string;
    time?: number;
    exclude?: Array<RegExp | string>;
    include?: Array<RegExp | string>;
    specific?: {
        [n: string]: number;
    };
};
declare function createPersistMiddleware({ name, time, exclude, include, specific }: CreateLocalStorageMiddleware): {
    middleware: Middleware;
    getData: () => Data;
    clearData: () => void;
};
export default createPersistMiddleware;
