/* eslint-disable no-param-reassign, import/no-mutable-exports, import/no-extraneous-dependencies */
import { init } from '@rematch/core';

/**
 * React状态管理
 *
 * @module mirror
 *
 */

// 模型集合
const modelList = [];

// 指令集合
let actions = null;

// 存储对象
let store = null;

// 回调集合
const hooks = [];

/**
 * 添加回调钩子
 *
 * @param {Function} callback 回调钩子
 * @example <caption>使用示例</caption>
 * mirror.hook((actions) => {
 *     Logger.debug(actions, '调用模型的指令');
 * });
 */
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

/**
 * 创建状态存储
 * @returns state 状态存储
 * @example <caption>使用示例</caption>
 * const store = mirror.createStore();
 * <Provider store={store}>
 *     <App />
 * </Provider>
 */
const createStore = () => {
    const models = {};
    modelList.forEach((item) => {
        models[item.name] = item;
    });
    store = init({ models, redux: { middlewares: [createMiddleware] } });
    actions = store.dispatch;
    return store;
};

// 转换模型
const transformModel = (source) => {
    if (!source.name) throw new Error('模型名称未配置！');
    const defaultState = { ...source.state };
    if (!source.reducers) source.reducers = {};
    source.reducers.set = (state, payload) => {
        if (typeof state !== 'object') return payload;
        Object.keys(payload).forEach((key) => {
            if (defaultState[key] === undefined) throw new Error(`模型${source.name}.state.${key}未定义`);
        });
        return { ...state, ...payload };
    };
    source.reducers.reset = () => ({ ...defaultState });
    if (!source.effects) source.effects = {};
    source.effects.get = (payload, getState) => {
        const state = getState()[source.name];
        if (!payload) return state;
        return state[payload];
    };
    return source;
};

/**
 * 加载模型
 *
 * @param {Object} model 模型，属性如下
 * @param {String} model.name 模型名称，必填
 * @param {*} model.state 模型状态，必填
 * @param {Object} model.reducers 模型的指令方法，同步类型，非必填
 * @param {Object} model.effects 模型的指令方法，异步类型，非必填
 *
 * @example <caption>使用示例</caption>
 * import user from '../models/user';
 * mirror.model(user);
 * // 或者使用对象
 * mirror.model({
 *     name: 'book',
 *     state: {
 *         name: '孙子兵法',
 *         author: '孙膑'
 *     },
 *     reducers: {
 *         rename(state, name) {
 *             return {...state, name};
 *         }
 *     },
 *     effects: {
 *         async fetchList() {
 *             const resp = await fetch(...);
 *             return resp.json();
 *         }
 *     }
 * })
 */
const model = (source) => {
    const target = transformModel(source);
    if (store) {
        store.addModel(target);
    } else {
        modelList.push(target);
    }
};

// 动态加载模型
const dynamicModel = (source) => {
    if (!store) throw new Error('存储对象未创建');
    const target = transformModel(source);
    store.addModel(target);
};

/**
 * 获取所有模型状态
 * @returns state 所有模型状态
 * @example <caption>使用示例</caption>
 * const all = mirror.getState();
 * console.log(all);
 */
const getState = () => store.getState();

export {
    model,
    dynamicModel,
    actions,
    createStore,
    hook,
    getState,
};
