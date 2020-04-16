var setLsData = function (name, data) { return window.localStorage[name] = JSON.stringify(data); };
var getLsData = function (name) { return JSON.parse(window.localStorage[name]); };
var removeLsData = function (name) { return window.localStorage.removeItem(name); };
var getKeys = function (keysReg) { return Object.keys(window.localStorage).filter(keysReg.test.bind(keysReg)); };
var lsHasData = function (keysReg) { return !!getKeys(keysReg).length; };
function createPersistMiddleware(_a) {
    var _b = _a.name, name = _b === void 0 ? 'natur' : _b, _c = _a.time, time = _c === void 0 ? 100 : _c, exclude = _a.exclude, _d = _a.specific, specific = _d === void 0 ? {} : _d;
    var lsData = {};
    var dataPrefix = name + "/";
    var keyOfNameReg = new RegExp("^" + dataPrefix + "[^]+");
    var isSaving = {};
    var saveToLocalStorage = function (key, data) {
        var _time = specific[key] !== undefined ? specific[key] : time;
        if (_time === 0) {
            setLsData("" + dataPrefix + key, data);
        }
        else {
            clearTimeout(isSaving[key]);
            isSaving[key] = setTimeout(function () { return setLsData("" + dataPrefix + key, data); }, time);
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
    var updateData = function (data, record) {
        if (excludeModule(record.moduleName)) {
            return;
        }
        data[record.moduleName] = record.state;
        saveToLocalStorage(record.moduleName, record.state);
    };
    var lsMiddleware = function () { return function (next) { return function (record) {
        updateData(lsData, record);
        return next(record);
    }; }; };
    var getData = function () { return lsData; };
    var clearData = function () {
        lsData = {};
        getKeys(keyOfNameReg).forEach(removeLsData);
    };
    if (lsHasData(keyOfNameReg)) {
        try {
            lsData = getKeys(keyOfNameReg).reduce(function (res, key) {
                res[key.replace(dataPrefix, '')] = getLsData(key);
                return res;
            }, {});
        }
        catch (error) {
            lsData = {};
        }
    }
    return {
        middleware: lsMiddleware,
        getData: getData,
        clearData: clearData
    };
}
export default createPersistMiddleware;
