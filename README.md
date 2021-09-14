# Mirror

**[基于mirrorx修改版本](https://github.com/mirrorjs/mirror)**

## 更新内容

1. 升级react-router-dom
2. 移除react-router-redux
3. 增加Router、BrowserRouter、MemoryRouter等组件的导出声明
4. 路由跳转改为actions.route.push()和actions.route.replace()
5. 模型（model）增加默认的set和get方法
6. 允许模型的重载，针对按需加载模式时，模型需要重新载入