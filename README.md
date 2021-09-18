# Mirror

**[基于mirrorx修改版本](https://github.com/mirrorjs/mirror)**

## 更新内容

1. 升级react-router-dom
2. 移除react-router-redux
3. 增加Router(HashRouter)、BrowserRouter、MemoryRouter等组件的导出声明
4. 路由跳转改为actions.route.push()和actions.route.replace()
5. 模型（model）增加默认的set和get方法
6. 允许模型的重载，针对按需加载模式时，模型需要重新载入
7. 模型（model）初始化状态值增加state，优先使用state（2021-09-17）

## 调整后的model

src/models/app.js
```
export default {
    name: 'app',
    state: { name: 'leon' },
};
```

此模型默认有两个方法set、get
```
actions.app.set({ name: 'mango' });
console.log(actions.app.get('name'));
// output mango
```

## History组件使用

放置于Router、BrowserRouter、MemoryRouter内部，使用actions.route.push()和actions.route.replace控制路由跳转

```
<Router>
    ...
    <History/>
</Router>
```