# natur-persist

## natur状态管理器的localstorage缓存中间件

- 将natur数据同步到localStorage，
- 同步操作有一定的延迟，使用防抖做同步操作

## demo

````typescript
import { createStore } from 'natur';
import createPersistMiddleware from 'natur-persist';


const { middleware, getData, clearData } = createPersistMiddleware({
  name: '_data', // localStorage命名前缀
  time: 500, // natur数据同步到localStorage的延迟
  exclude: ['module1', /^module2$/], // module1, module2不做持久化缓存
  include: ['module3', /^module4$/], // 只针对module3，module4做持久化缓存
  specific: {
    user: 0, // 用户模块的保存延迟为0，意为用户模块的数据同步到localStorage是同步的
  },
});

clearData() // 清除缓存数据

const store = createStore(
  {},
  {}
  getData(), // 获取localStorage中的缓存数据
  [
    middleware, // 使用中间件
  ],
);

````