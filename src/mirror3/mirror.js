/* eslint-disable no-param-reassign, import/no-mutable-exports */
import { init } from '@rematch/core';

// 模型集合
const modelList = [];

let actions = null;

let store = null;

const hooks = [];

// 回调
const hook = (callback) => {
    hooks.push(callback);
};

const createMiddleware = () => (next) => (action) => {
    hooks.forEach((item) => {
        if (typeof item !== 'function') return;
        item(action);
    });
    return next(action);
};

// 创建存储对象
const createStore = () => {
    const models = {};
    modelList.forEach((model) => {
        models[model.name] = model;
    });
    store = init({ models, redux: { middlewares: [createMiddleware] } });
    actions = store.dispatch;
    return store;
};

// 转换模型
const transformModel = (model) => {
    if (!model.name) throw new Error('模型名称未配置！');
    const defaultState = { ...model.state };
    if (!model.reducers) model.reducers = {};
    model.reducers.set = (state, payload) => {
        if (typeof state === 'object') return { ...state, ...payload };
        return payload;
    };
    model.reducers.reset = () => defaultState;
    if (!model.effects) model.effects = {};
    model.effects.get = (payload, rootState) => rootState[model.name];
    return model;
};

// 加载模型
const model = (source) => {
    const target = transformModel(source);
    modelList.push(target);
    if (store) store.addModel(target);
};

// 动态加载模型
const dynamicModel = (source) => {
    if (!store) throw new Error('存储对象未创建');
    const target = transformModel(source);
    store.addModel(target);
};

export {
    model,
    dynamicModel,
    actions,
    createStore,
    hook,
};
