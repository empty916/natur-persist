import Store from './Store';

const createAddPrefix = (prefix: string) => (str: string) => `${prefix}${str}`;

export default class Keys {
    value: Array<string>;
    store: Store;
    name: string;
    prefix: string;
    addPrefix: (s: string) => string;
    constructor(store: Store, dataPrefix: string) {
        this.store = store;
        this.prefix = dataPrefix;
        this.name = `${dataPrefix}keys`;
        this.value = store.get(this.name, []);
        this.addPrefix = createAddPrefix(this.prefix);
    }
    set(_moduleName: string) {
        if(this.has(_moduleName)) {
            return;
        }
        const moduleName = this.addPrefix(_moduleName);
        this.value.push(moduleName);
        this.store.set(this.name, this.value);
    }
    has(_moduleName: string) {
        const moduleName = this.addPrefix(_moduleName);
        return this.value.includes(moduleName);
    }
    get() {
        return this.store.get(this.name, this.value);
    }
    clear() {
        this.store.remove(this.name);
    }
}