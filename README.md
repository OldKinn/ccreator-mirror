# Mirror

## 安装

```bash
# 安装库
yarn add @ccreator/mirror
# 安装库的types声明
yarn add @types/ccreator__mirror -D
```

## 定义模型

说明：模型装载时，会自动添加set、reset和get方法，请不要给模型增加这些方法，否则会被覆盖
 
```js
// src/models/demo.js
import { actions } from '@ccreator/mirror';

export default {
    // 模型名称
    name: 'demo',
    // 模型的状态
    state: { books: [] },
    // 同步的方法
    reducers: {
        // 调用方式：actions.demo.addBook({ name: '孙子兵法', author: '孙武' });
        addBook(state, params) {
            const { books } = state;
            state.push(params);
            return { ...state, books };
        }
    },
    // 异步的方法
    effects: {
        // 调用方式：actions.demo.fetchList({ author: '孙武' });
        async fetchList(params, getState) {
            // getState()获取所有全部状态数据
            // console.log(getState());
            const books = await fetch(`/books?author=${params.author}`).then((resp) => resp.json);
            actions.demo.set({ books });
        }
    },
}
```

## 初始化状态存储(Store)

```js
// store.js
import mirror from '@ccreator/mirror';
import app from './models/app';
import demo from './models/demo';

// 1.加载模型
mirror.model(app);
mirror.model(demo);

// 2.创建数据存储
const store = mirror.createStore();

export defalut store;
```

## 注入状态存储(Store)

```js
// index.js
import React from 'react'
import ReactDOM from 'react-dom/client'
import mirror, { Provider } from '@ccreator/mirror';
import App from './App'
import store from './store';

// Action执行的回调钩子
mirror.hook(console.log)

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <Provider store={store}>
            <App />
        </Provider>
    </React.StrictMode>,
)

```

## 动态加载模型

注意：使用mirror.model()加载模型后才能使用模型的方法

```js
import React from 'react';
import mirror, { actions, connect } from '@ccreator/mirror';
import demo from '../models/demo';

// 动态加载模型
mirror.model({
    name: 'test',
    state: { value: 'xxx' },
});
// 动态加载模型
mirror.model(demo);

const Test = ({ name, value }) => {
    React.useEffect(() => {
        // 2. 调用模型的方法
        console.log(actions.test.get('value')); // eslint-disable-line
    }, []);
    const handleClick = () => {
        actions.app.set({ name: new Date().valueOf() });
        actions.test.set({ value: new Date().valueOf() });
    };
    return (
        <>
            <div>{name}</div>
            <div>{value}</div>
            <button type="button" onClick={handleClick}>测试</button>
        </>
    );
};

const dispatchStore = ({ app, test }) => ({ name: app.name, value: test.value });

export default connect(dispatchStore)(Test);

```

## 更新内容

**2023-01-17**  
1. 移除react-router-dom依赖
2. 修改初始化方式，支持React18.x
3. 删除路由相关代码，代码结构优化


**2021-12-09**  
1. 升级react-router-dom
2. 移除react-router-redux
3. 增加Router(HashRouter)、BrowserRouter、MemoryRouter等组件的导出声明
4. 路由跳转改为actions.route.push()和actions.route.replace()
5. 模型（model）增加默认的set、reset和get方法
6. 允许模型的重载，针对按需加载模式时，模型需要重新载入
7. 模型（model）初始化状态值使用state
