import Store from './Store';
export default class Keys {
    value: Array<string>;
    store: Store;
    name: string;
    prefix: string;
    addPrefix: (s: string) => string;
    constructor(store: Store, dataPrefix: string);
    set(_moduleName: string): void;
    has(_moduleName: string): boolean;
    get(): string[];
    clear(): void;
}
