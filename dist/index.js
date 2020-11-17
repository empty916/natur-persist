import Store from './Store';
import Keys from './Keys';
function createPersistMiddleware(_a) {
    var _b = _a.name, name = _b === void 0 ? 'natur' : _b, _c = _a.time, time = _c === void 0 ? 100 : _c, exclude = _a.exclude, include = _a.include, _d = _a.storageType, storageType = _d === void 0 ? 'localStorage' : _d, _e = _a.specific, specific = _e === void 0 ? {} : _e;
    var setLsData = function (name, data) { return window[storageType].setItem(name, JSON.stringify(data)); };
    var getLsData = function (name) { return JSON.parse(window[storageType][name]); };
    var removeLsData = function (name) { return window[storageType].removeItem(name); };
    var store = new Store({
        set: setLsData,
        get: getLsData,
        remove: removeLsData
    });
    var lsData = undefined;
    var dataPrefix = name + "/";
    var keys = new Keys(store, dataPrefix);
    var isSaving = {};
    var debounceSave = function (key, data) {
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
    // 同步excludeModule、includeModule配置到keys
    (function syncConfig() {
        keys.value.forEach(function (m) {
            if (excludeModule(m) || !includeModule(m)) {
                keys.remove(m);
                store.remove("" + dataPrefix + m);
            }
        });
    })();
    var updateData = function (data, record) {
        var moduleName = record.moduleName, state = record.state;
        if (excludeModule(moduleName)) {
            return;
        }
        if (includeModule(moduleName)) {
            keys.set(moduleName);
            data[moduleName] = state;
            debounceSave(moduleName, state);
        }
    };
    var lsMiddleware = function () { return function (next) { return function (record) {
        if (lsData === undefined) {
            lsData = {};
        }
        updateData(lsData, record);
        return next(record);
    }; }; };
    var getData = function () { return lsData; };
    var clearData = function () {
        lsData = undefined;
        keys.get().forEach(function (moduleName) { return store.remove(moduleName); });
        keys.clear();
    };
    if (keys.get().length) {
        lsData = keys.get().reduce(function (res, key) {
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
