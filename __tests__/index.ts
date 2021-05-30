import { createStore } from "natur";
import createPersistMiddleware from "../src";

const { middleware, getData, clearData } = createPersistMiddleware({
  name: "_data",
  time: 500,
  exclude: ["module1", /^module2$/],
  include: ["module3", /^module4$/],
  specific: {
    user: 0,
  },
});

const count = {
  state: 0,
  actions: {
    update: (ns: number) => ns,
  },
  maps: {
    plus1: (s: number) => s + 1,
  },
};

const count2 = {
  state: {
    value: 0,
  },
  actions: {
    update: (ns: number) => ({ value: ns }),
  },
  maps: {
    plus1: (s: { value: number }) => s.value + 1,
  },
};

type M = {
  count: typeof count;
  count2: typeof count;
};

const initStore = (...mid: any) => {
  return createStore(
    { count, count2 },
    {},
    {
      middlewares: [...mid],
    }
  );
};

let store: ReturnType<typeof initStore>;

const sleep = (time: number) => new Promise((res) => setTimeout(res, time));

const initStorage = (type: 'localStorage' | 'sessionStorage' = 'localStorage') => {
    window[type].setItem("_data/$keys", JSON.stringify(["count", "count2"]));
    window[type].setItem("_data/count", JSON.stringify(count.state + 1));
    window[type].setItem("_data/count2", JSON.stringify({
        value: count2.state.value + 2
    }));
}

const clearStorage = (type: 'localStorage' | 'sessionStorage' = 'localStorage') => {
    window[type].removeItem("_data/$keys");
    window[type].removeItem("_data/count");
    window[type].removeItem("_data/count2");
}


test('storage util', () => {
    initStorage();
    expect(window.localStorage["_data/$keys"]).toBe(JSON.stringify(['count', 'count2']));
    expect(window.localStorage["_data/count"]).toBe(JSON.stringify(1));
    expect(window.localStorage["_data/count2"]).toBe(JSON.stringify({value: 2}));
    clearStorage();

    initStorage('sessionStorage');
    expect(window['sessionStorage']["_data/$keys"]).toBe(JSON.stringify(['count', 'count2']));
    expect(window['sessionStorage']["_data/count"]).toBe(JSON.stringify(1));
    expect(window['sessionStorage']["_data/count2"]).toBe(JSON.stringify({value: 2}));
    clearStorage('sessionStorage');
})

test("get localStorage data", () => {
    initStorage();

    const { getData } = createPersistMiddleware({
        name: "_data",
        time: 500,
    });
  
    expect(getData()).toEqual({
        count: 1,
        count2: {
            value: 2,
        }
    });
    clearStorage();
});



test("get sessionStorage data", () => {
    initStorage('sessionStorage');

    const { getData } = createPersistMiddleware({
        name: "_data",
        storageType: 'sessionStorage',
        time: 500,
    });
  
    expect(getData()).toEqual({
        count: 1,
        count2: {
            value: 2,
        }
    });
    clearStorage('sessionStorage');
});


test("clear localStorage data", () => {
    initStorage();

    const { clearData } = createPersistMiddleware({
        name: "_data",
        time: 500,
    });

    clearData();

    expect(window.localStorage['_data/$keys']).toBe(undefined);
    expect(window.localStorage['_data/count']).toBe(undefined);
    expect(window.localStorage['_data/count2']).toBe(undefined);

    clearStorage();
});


test("clear sessionStorage data", () => {
    initStorage('sessionStorage');

    const { clearData } = createPersistMiddleware({
        name: "_data",
        time: 500,
        storageType: 'sessionStorage'
    });

    clearData();

    expect(window.sessionStorage['_data/$keys']).toBe(undefined);
    expect(window.sessionStorage['_data/count']).toBe(undefined);
    expect(window.sessionStorage['_data/count2']).toBe(undefined);
    clearStorage('sessionStorage');
});


test("middleware", async () => {
    clearStorage();
    const { middleware } = createPersistMiddleware({
        name: "_data",
        time: 100,
        // storageType: 'sessionStorage'
    });
    store = initStore(middleware);
    store.dispatch('count', 'update', 2);

    expect(window.localStorage['_data/$keys']).toBe(JSON.stringify(['count']));
    expect(window.localStorage['_data/count']).toBe(undefined);
    expect(window.localStorage['_data/count2']).toBe(undefined);

    await sleep(100);

    expect(window.localStorage['_data/$keys']).toBe(JSON.stringify(['count']));
    expect(window.localStorage['_data/count']).toBe('2');
    expect(window.localStorage['_data/count2']).toBe(undefined);

    store.dispatch('count2', 'update', 3);
    expect(window.localStorage['_data/$keys']).toBe(JSON.stringify(['count', 'count2']));
    expect(window.localStorage['_data/count']).toBe('2');
    expect(window.localStorage['_data/count2']).toBe(undefined);
    await sleep(100);
    expect(window.localStorage['_data/count2']).toBe(JSON.stringify({value: 3}));

});



test("middleware sessionStorage", async () => {
    clearStorage('sessionStorage');
    const { middleware } = createPersistMiddleware({
        name: "_data",
        time: 100,
        storageType: 'sessionStorage'
    });
    store = initStore(middleware);
    store.dispatch('count', 'update', 2);

    expect(window.sessionStorage['_data/$keys']).toBe(JSON.stringify(['count']));
    expect(window.sessionStorage['_data/count']).toBe(undefined);
    expect(window.sessionStorage['_data/count2']).toBe(undefined);

    await sleep(100);

    expect(window.sessionStorage['_data/$keys']).toBe(JSON.stringify(['count']));
    expect(window.sessionStorage['_data/count']).toBe('2');
    expect(window.sessionStorage['_data/count2']).toBe(undefined);

    store.dispatch('count2', 'update', 3);
    expect(window.sessionStorage['_data/$keys']).toBe(JSON.stringify(['count', 'count2']));
    expect(window.sessionStorage['_data/count']).toBe('2');
    expect(window.sessionStorage['_data/count2']).toBe(undefined);
    await sleep(100);
    expect(window.sessionStorage['_data/count2']).toBe(JSON.stringify({value: 3}));

    clearStorage('sessionStorage');
});




test("middleware specific", async () => {
    clearStorage();
    const { middleware } = createPersistMiddleware({
        name: "_data",
        time: 100,
        specific: {
            count2: 0
        }
    });
    store = initStore(middleware);

    store.dispatch('count2', 'update', 3);
    expect(window.localStorage['_data/$keys']).toBe(JSON.stringify(['count2']));
    expect(window.localStorage['_data/count']).toBe(undefined);
    expect(window.localStorage['_data/count2']).toBe(JSON.stringify({value: 3}));
});




test("middleware include", async () => {
    clearStorage();
    const { middleware } = createPersistMiddleware({
        name: "_data",
        time: 100,
        include: ['count']
    });
    store = initStore(middleware);

    store.dispatch('count', 'update', 3);
    store.dispatch('count2', 'update', 3);
    expect(window.localStorage['_data/$keys']).toBe(JSON.stringify(['count']));
    expect(window.localStorage['_data/count']).toBe(undefined);
    expect(window.localStorage['_data/count2']).toBe(undefined);

    await sleep(100);

    expect(window.localStorage['_data/$keys']).toBe(JSON.stringify(['count']));
    expect(window.localStorage['_data/count']).toBe('3');
    expect(window.localStorage['_data/count2']).toBe(undefined);

});



test("middleware exclude", async () => {
    clearStorage();
    const { middleware } = createPersistMiddleware({
        name: "_data",
        time: 100,
        exclude: ['count2']
    });
    store = initStore(middleware);

    store.dispatch('count', 'update', 3);
    store.dispatch('count2', 'update', 3);
    expect(window.localStorage['_data/$keys']).toBe(JSON.stringify(['count']));
    expect(window.localStorage['_data/count']).toBe(undefined);
    expect(window.localStorage['_data/count2']).toBe(undefined);

    await sleep(100);

    expect(window.localStorage['_data/$keys']).toBe(JSON.stringify(['count']));
    expect(window.localStorage['_data/count']).toBe('3');
    expect(window.localStorage['_data/count2']).toBe(undefined);

});