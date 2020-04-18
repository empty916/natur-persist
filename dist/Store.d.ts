declare type Data = any;
declare type StoreParams = {
    set(name: string, data: Data): any;
    get(name: string): Data;
    remove(name: string): void;
};
export default class Store {
    private $set;
    private $get;
    private $remove;
    constructor({ set, get, remove }: StoreParams);
    set(name: string, data: Data): any;
    get<T>(name: string, defaultValue?: T): T;
    remove(name: string): void;
}
export {};
