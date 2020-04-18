import Store from './Store';
import Keys from './Keys';
var setLsData = function (name, data) { return window.localStorage.setItem(name, JSON.stringify(data)); };
var getLsData = function (name) { return JSON.parse(window.localStorage[name]); };
var removeLsData = function (name) { return window.localStorage.removeItem(name); };
var store = new Store({
    set: setLsData,
    get: getLsData,
    remove: removeLsData
});
function createPersistMiddleware(_a) {
    var _b = _a.name, name = _b === void 0 ? 'natur' : _b, _c = _a.time, time = _c === void 0 ? 100 : _c, exclude = _a.exclude, include = _a.include, _d = _a.specific, specific = _d === void 0 ? {} : _d;
    var lsData = {};
    var dataPrefix = name + "/";
    var keys = new Keys(store, dataPrefix);
    var isSaving = {};
    var saveToLocalStorage = function (key, data) {
        var _time = specific[key] !== undefined ? specific[key] : time;
        if (_time === 0) {
            store.set("" + dataPrefix + key, data);
        }
        else {
            clearTimeout(isSaving[key]);
            isSaving[key] = setTimeout(function () { return store.set("" + dataPrefix + key, data); }, time);
        }
    };
    var excludeModule = function (targetName) {
        if (exclude) {
            var shouldExclude = exclude.some(function (exc) {
                if (exc instanceof RegExp) {
                    return exc.test(targetName);
                }
                return exc === targetName;
            });
            return shouldExclude;
        }
        return false;
    };
    var includeModule = function (targetName) {
        if (include) {
            var shouldInclude = include.some(function (exc) {
                if (exc instanceof RegExp) {
                    return exc.test(targetName);
                }
                return exc === targetName;
            });
            return shouldInclude;
        }
        return true;
    };
    var updateData = function (data, record) {
        var moduleName = record.moduleName, state = record.state;
        if (excludeModule(moduleName)) {
            return;
        }
        if (includeModule(moduleName)) {
            keys.set(moduleName);
            data[moduleName] = state;
            saveToLocalStorage(moduleName, state);
        }
    };
    var lsMiddleware = function () { return function (next) { return function (record) {
        updateData(lsData, record);
        return next(record);
    }; }; };
    var getData = function () { return lsData; };
    var clearData = function () {
        lsData = {};
        keys.value.forEach(function (moduleName) { return store.remove(moduleName); });
    };
    if (keys.value.length) {
        lsData = keys.value.reduce(function (res, key) {
            res[key.replace(dataPrefix, '')] = store.get(key);
            return res;
        }, {});
    }
    return {
        middleware: lsMiddleware,
        getData: getData,
        clearData: clearData
    };
}
export default createPersistMiddleware;
