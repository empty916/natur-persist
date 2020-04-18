var Store = /** @class */ (function () {
    function Store(_a) {
        var set = _a.set, get = _a.get, remove = _a.remove;
        this.$set = set;
        this.$get = get;
        this.$remove = remove;
    }
    Store.prototype.set = function (name, data) {
        return this.$set(name, data);
    };
    Store.prototype.get = function (name, defaultValue) {
        if (defaultValue === void 0) { defaultValue = {}; }
        try {
            return this.$get(name);
        }
        catch (_a) {
            return defaultValue;
        }
    };
    Store.prototype.remove = function (name) {
        try {
            this.$remove(name);
        }
        catch (e) {
            throw e;
        }
    };
    return Store;
}());
export default Store;
