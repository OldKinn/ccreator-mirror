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