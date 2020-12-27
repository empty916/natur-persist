"use strict";
exports.__esModule = true;
var Keys = /** @class */ (function () {
    function Keys(store, dataPrefix) {
        this.store = store;
        this.prefix = dataPrefix;
        this.name = dataPrefix + "$keys";
        this.value = store.get(this.name, []);
    }
    Keys.prototype.set = function (moduleName) {
        if (this.has(moduleName)) {
            return;
        }
        this.value.push(moduleName);
        this.store.set(this.name, this.value);
    };
    Keys.prototype.has = function (moduleName) {
        return this.value.includes(moduleName);
    };
    Keys.prototype.remove = function (moduleName) {
        if (this.has(moduleName)) {
            this.value = this.value.filter(function (m) { return m !== moduleName; });
            this.store.set(this.name, this.value);
        }
    };
    Keys.prototype.get = function () {
        var _this = this;
        return this.value.map(function (mn) { return "" + _this.prefix + mn; });
    };
    Keys.prototype.clear = function () {
        this.value = [];
        this.store.remove(this.name);
    };
    return Keys;
}());
exports["default"] = Keys;
