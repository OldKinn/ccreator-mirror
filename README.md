# Mirror

## 安装

```bash
# 安装库
yarn add @ccreator/mirror
```

## 使用

### 1. 定义模型

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
        addBook(state, payload) {
            const { books } = state;
            books.push(payload);
            return { ...state, books: [...books] };
        }
    },
    // 异步的方法
    effects: {
        // 调用方式：actions.demo.fetchList({ author: '孙武' });
        async fetchList(payload, getState) {
            // getState()获取所有全部状态数据
            // console.log(getState());
            const resp = await fetch(`/books?author=${payload.author}`);
            const books = await resp.json();
            actions.demo.set({ books });
        }
    },
}
```

### 2. 初始化状态存储(Store)

```js
// store.js
import mirror from '@ccreator/mirror';
import app from './models/app';
import demo from './models/demo';

// 1.加载模型
mirror.model(app);
mirror.model(demo);
// 尽量拆分模型到独立文件
mirror.model({
    name: 'loading',
    state: 0,
    reducers: {... ...}
});

// 2.创建数据存储
const store = mirror.createStore();

export defalut store;
```

### 3. 注入状态存储(Store)

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

### 4. 子组件连接状态存储

```js
const App = ({ author, price, xxx }) => {
    ... ...
}

function dispatch({ book, xxx }) {
    return {
        author: book.author,
        price: book.price,
        xxx,
    };
}

export default connect(dispatch)(App);
```

## 动态加载模型
**注意事项：需要先加载，然后才能调用模型指令，否则actions.{model}.{action}空值异常**  
**注意事项：需要先加载，然后才能调用模型指令，否则actions.{model}.{action}空值异常**  
**注意事项：需要先加载，然后才能调用模型指令，否则actions.{model}.{action}空值异常**

```js
import React from 'react';
import mirror, { actions, connect } from '@ccreator/mirror';
import model from './user';
import get from 'lodash/get';

const Main = ({ page, dataSource }) => {

    React.useEffect(() => {
        // 动态加载模型
        mirror.model(model);
        const temp = actions.user.get('page');
        console.log(temp);
        actions.user.set({ page: { index: 100, size: 1024 } });
    }, []);

    return <>{JSON.stringify({ page, dataSource })}</>;
};

function dispatch({ user }) {
    // 注意user模型未加载时，user为undefined，可以使用lodash.get防止空值异常
    return {
        page: {
            index: get(user, 'page.index', 1),
            size: get(user, 'page.size', 10)
        },
        dataSource: user?.dataSource,
    };
}

export default connect(dispatch)(Main);
```

## 更新内容

**2024-07-20**
1. 实现动态加载模型，方便代码拆分
2. 升级依赖

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
