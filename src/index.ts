import { Middleware } from 'natur';
import Store from './Store';
import Keys from './Keys';

type Data = { [m: string]: any };

type CreateLocalStorageMiddleware = {
	name?: string;
	time?: number;
	exclude?: Array<RegExp|string>;
	include?: Array<RegExp|string>;
	storageType?: 'localStorage' | 'sessionStorage';
	specific?: {
		[n: string]: number;
	}
}


function createPersistMiddleware({
	name = 'natur',
	time = 100,
	exclude,
	include,
	storageType = 'localStorage',
	specific = {}
}: CreateLocalStorageMiddleware) {
	
	const setLsData = (name: string, data: Data) => window[storageType].setItem(name, JSON.stringify(data));
	const getLsData = (name: string) => JSON.parse(window[storageType][name]) as Data;
	const removeLsData = (name: string) => window[storageType].removeItem(name);

	const store = new Store({
		set: setLsData,
		get: getLsData,
		remove: removeLsData,
	});

	
	let lsData: Data | undefined = undefined;
	const dataPrefix = `${name}/`;
	const keys = new Keys(store, dataPrefix);
	const isSaving: any = {};

	const debounceSave = (key: string|number, data: any) => {
		const _time = specific[key] !== undefined ? specific[key] : time;
		if (_time === 0) {
			store.set(`${dataPrefix}${key}`, data);
		} else {
			clearTimeout(isSaving[key]);
			isSaving[key] = setTimeout(() => store.set(`${dataPrefix}${key}`, data), time);
		}
	};
	const excludeModule = (targetName: string) => {
		if (exclude) {
			const shouldExclude = exclude.some(exc => {
				if (exc instanceof RegExp) {
					return exc.test(targetName);
				}
				return exc === targetName;
			});
			return shouldExclude;
		}
		return false;
	};
	const includeModule = (targetName: string) => {
		if (include) {
			const shouldInclude = include.some(exc => {
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
	(function syncConfig(){
		keys.value.forEach(m => {
			if (excludeModule(m) || !includeModule(m)) {
				keys.remove(m);
				store.remove(`${dataPrefix}${m}`);
			}
		})
	})()

	const updateData = (
		data: Data,
		record: { moduleName: string; state: any },
	) => {
		const {moduleName, state} = record;
		if (excludeModule(moduleName)) {
			return;
		}
		if (includeModule(moduleName)) {
			keys.set(moduleName);
			data[moduleName] = state;
			debounceSave(moduleName, state);
		}
	};
	const lsMiddleware: Middleware<any> = () => next => record => {
		if (lsData === undefined) {
			lsData = {};
		}
		updateData(lsData, record as any);
		return next(record);
	};
	const getData = () => lsData;
	const clearData = () => {
		lsData = undefined;
		keys.get().forEach((moduleName: string) => store.remove(moduleName));
		keys.clear();
	};

	if (keys.get().length) {
		lsData = keys.get().reduce((res, key) => {
			res[key.replace(dataPrefix, '')] = store.get(key);
			return res;
		}, {} as Data);
	}

	return {
		middleware: lsMiddleware,
		getData,
		clearData,
	};
}

export default createPersistMiddleware;
