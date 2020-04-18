
type Data = any;


type StoreParams = {
    set(name: string, data: Data): any;
    get(name: string): Data;
    remove(name: string): void;
}

export default class Store {
    private $set: StoreParams["set"];
    private $get: StoreParams["get"];
    private $remove: StoreParams["remove"];
    constructor({set, get, remove}: StoreParams) {
        this.$set = set;
        this.$get = get;
        this.$remove = remove;
    }
    set(name: string, data: Data) {
        return this.$set(name, data);
    }
    get<T>(name: string, defaultValue: T = {} as any): T {
        try {
            return this.$get(name) as T;
        } catch {
            return defaultValue;
        }
    }
    remove(name: string) {
        try {
            this.$remove(name);
        } catch (e) {
            throw e;
        }
    }
}
