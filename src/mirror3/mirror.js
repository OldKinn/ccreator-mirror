/* eslint-disable no-param-reassign, import/no-mutable-exports, import/no-extraneous-dependencies, no-console */
import { init } from '@rematch/core';

/**
 * React状态管理
 *
 * @module mirror
 *
 */

// 所有模型集合
const models = {};

/**
 * 模型指令集合
 * @example <caption>使用示例</caption>
 * import { actions } from '@ccreator/mirror';
 *
 * actions.user.get();
 * actions.user.set({ mobile: '10086' });
 * actions.user.get('mobile');
 * await actions.user.fetchList();
 */
let actions = null;

// 存储对象
let store = null;

// 回调集合
const hooks = [];

const debug = (content, type = '', color = 'teal') => {
    console.log(`%c---------------->${type}`, `color:${color};font-weight:bolder;`);
    console.log(content);
    console.log('%c<----------------', `color:${color};font-weight:bolder;`);
};

/**
 * 添加回调钩子
 *
 * @param {Function} callback 回调钩子
 * @example <caption>使用示例</caption>
 * import mirror from '@ccreator/mirror';
 * // 或者
 * import { hook } from '@ccreator/mirror';
 *
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
 * import mirror from '@ccreator/mirror';
 * // 或者
 * import { createStore } from '@ccreator/mirror';
 *
 * const store = mirror.createStore();
 * <Provider store={store}>
 *     <App />
 * </Provider>
 */
const createStore = () => {
    store = init({ models, redux: { middlewares: [createMiddleware] } });
    actions = store.dispatch;
    return store;
};

// 转换模型
const transformModel = (source) => {
    if (!source.name) throw new Error('模型名称未配置！');
    if (!source.reducers) source.reducers = {};
    if (typeof source.state === 'object') {
        const defaultState = { ...source.state };
        source.reducers.set = (state, payload) => {
            Object.keys(payload).forEach((key) => {
                if (defaultState[key] === undefined) throw new Error(`模型${source.name}.state.${key}未定义`);
            });
            return { ...state, ...payload };
        };
        source.reducers.reset = () => ({ ...defaultState });
    } else {
        const defaultState = source.state;
        source.reducers.set = (state, payload) => payload;
        source.reducers.reset = () => defaultState;
    }
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
 * import mirror from '@ccreator/mirror';
 * // 或者
 * import { model } from '@ccreator/mirror';
 *
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
    models[target.name] = target;
    if (store) store.addModel(target);
};

/**
 * 获取所有模型状态
 * @returns state 所有模型状态
 * @example <caption>使用示例</caption>
 * import mirror from '@ccreator/mirror';
 * // 或者
 * import { getState } from '@ccreator/mirror';
 *
 * const state = mirror.getState();
 * console.log(state);
 */
const getState = () => store.getState();

export {
    debug,
    model,
    actions,
    createStore,
    hook,
    getState,
};
