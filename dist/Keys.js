var createAddPrefix = function (prefix) { return function (str) { return "" + prefix + str; }; };
var Keys = /** @class */ (function () {
    function Keys(store, dataPrefix) {
        this.store = store;
        this.value = store.get(dataPrefix + "keys", []);
        this.prefix = dataPrefix;
        this.name = dataPrefix + "keys";
        this.addPrefix = createAddPrefix(dataPrefix);
    }
    Keys.prototype.set = function (_moduleName) {
        if (this.has(_moduleName)) {
            return;
        }
        var moduleName = this.addPrefix(_moduleName);
        this.value.push(moduleName);
        this.store.set(this.name, this.value);
    };
    Keys.prototype.has = function (_moduleName) {
        var moduleName = this.addPrefix(_moduleName);
        return this.value.includes(moduleName);
    };
    Keys.prototype.get = function () {
        return this.store.get(this.name, this.value);
    };
    Keys.prototype.clear = function () {
        this.store.remove(this.name);
    };
    return Keys;
}());
export default Keys;
