# Mirror

**[基于mirrorx修改版本](https://github.com/mirrorjs/mirror)**

## 更新内容

1. 升级react-router-dom
2. 移除react-router-redux
3. 增加Router(HashRouter)、BrowserRouter、MemoryRouter等组件的导出声明
4. 路由跳转改为actions.route.push()和actions.route.replace()
5. 模型（model）增加默认的set、reset和get方法
6. 允许模型的重载，针对按需加载模式时，模型需要重新载入
7. 模型（model）初始化状态值使用state

## 调整后的model

src/models/app.js
```
export default {
    name: 'app',
    state: { name: 'leon' },
};
```

模型默认有增加set、reset、get方法
```
actions.app.set({ name: 'mango' });
console.log(actions.app.get('name'));
// output mango
actions.app.reset();
console.log(actions.app.get('name'));
// output leon
```

## History组件使用

放置于Router、BrowserRouter、MemoryRouter内部，使用actions.route.push()和actions.route.replace()控制路由跳转

```
<Router>
    ...
    <History/>
</Router>
```