import Store from './Store';
export default class Keys {
    value: Array<string>;
    store: Store;
    name: string;
    prefix: string;
    constructor(store: Store, dataPrefix: string);
    set(moduleName: string): void;
    has(moduleName: string): boolean;
    get(): string[];
    clear(): void;
}
