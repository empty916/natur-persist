import { Middleware } from 'natur';
declare type Data = {
    [m: string]: any;
};
declare type CreateLocalStorageMiddleware = {
    name?: string;
    time?: number;
    exclude?: Array<RegExp | string>;
    include?: Array<RegExp | string>;
    storageType?: 'localStorage' | 'sessionStorage';
    specific?: {
        [n: string]: number;
    };
};
declare function createPersistMiddleware({ name, time, exclude, include, storageType, specific }: CreateLocalStorageMiddleware): {
    middleware: Middleware;
    getData: () => Data | undefined;
    clearData: () => void;
};
export default createPersistMiddleware;
