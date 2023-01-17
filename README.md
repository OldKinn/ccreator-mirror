# Mirror

**[基于mirrorx修改版本](https://github.com/mirrorjs/mirror)**

## 更新内容（2023-01-17）

1. 移除react-router-dom
2. 移除react-router-redux
3. 模型（model）增加默认的set、reset和get方法
4. 允许模型的重载，针对按需加载模式时，模型需要重新载入
5. 模型（model）初始化状态值使用state
6. 修改初始化方式，支持React18.x


## 初始化
```js
import React from 'react'
import ReactDOM from 'react-dom/client'
import mirror, { Provider } from '@ccreator/mirror';
import App from './App'
import app from './models/app';

mirror.hook(console.log)

// 1.加载模型
mirror.model(app);

// 2.创建数据存储
const store = mirror.createStore();

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

// 1. 动态加载模型
mirror.model({
    name: 'test',
    state: { value: 'xxx' },
});
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