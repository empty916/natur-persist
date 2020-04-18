import Store from './Store';


export default class Keys {
    value: Array<string>;
    store: Store;
    name: string;
    prefix: string;
    constructor(store: Store, dataPrefix: string) {
        this.store = store;
        this.prefix = dataPrefix;
        this.name = `${dataPrefix}$keys`;
        this.value = store.get(this.name, []);
    }
    set(moduleName: string) {
        if(this.has(moduleName)) {
            return;
        }
        this.value.push(moduleName);
        this.store.set(this.name, this.value);
    }
    has(moduleName: string) {
        return this.value.includes(moduleName);
    }
    get() {
        return this.value.map((mn: string) => `${this.prefix}${mn}`);
    }
    clear() {
        this.store.remove(this.name);
    }
}