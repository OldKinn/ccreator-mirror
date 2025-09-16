/* eslint-disable no-param-reassign, import/no-mutable-exports, import/no-extraneous-dependencies, no-console */
import { init } from '@rematch/core';

/**
 * React State Management
 *
 * @module mirror
 *
 */

// All models collection
const models = {};

/**
 * Model actions collection
 * @example <caption>Usage example</caption>
 * import { actions } from '@ccreator/mirror';
 *
 * actions.user.get();
 * actions.user.set({ mobile: '10086' });
 * actions.user.get('mobile');
 * await actions.user.fetchList();
 */
let actions = null;

// Store object
let store = null;

// Callbacks collection
const hooks = [];

const debug = (content, type = '', color = 'teal') => {
    console.log(`%c---------------->${type}`, `color:${color};font-weight:bolder;`);
    console.log(content);
    console.log('%c<----------------', `color:${color};font-weight:bolder;`);
};

/**
 * Add callback hook
 *
 * @param {Function} callback Callback hook
 * @example <caption>Usage example</caption>
 * import mirror from '@ccreator/mirror';
 * // or
 * import { hook } from '@ccreator/mirror';
 *
 * mirror.hook((actions) => {
 *     Logger.debug(actions, 'Call model actions');
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
 * Create state store
 * @returns state State store
 * @example <caption>Usage example</caption>
 * import mirror from '@ccreator/mirror';
 * // or
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

// Transform model
const transformModel = (source) => {
    if (!source.name) throw new Error('Model name not configured!');
    if (!source.reducers) source.reducers = {};
    if (typeof source.state === 'object') {
        const defaultState = { ...source.state };
        source.reducers.set = (state, payload) => {
            Object.keys(payload).forEach((key) => {
                if (defaultState[key] === undefined) throw new Error(`Model ${source.name}.state.${key} is not defined`);
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
 * Load model
 *
 * @param {Object} model Model with the following properties
 * @param {String} model.name Model name, required
 * @param {*} model.state Model state, required
 * @param {Object} model.reducers Model action methods, synchronous type, optional
 * @param {Object} model.effects Model action methods, asynchronous type, optional
 *
 * @example <caption>Usage example</caption>
 * import mirror from '@ccreator/mirror';
 * // or
 * import { model } from '@ccreator/mirror';
 *
 * import user from '../models/user';
 * mirror.model(user);
 * // or use object
 * mirror.model({
 *     name: 'book',
 *     state: {
 *         name: 'The Art of War',
 *         author: 'Sun Tzu'
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
 * Get all model states
 * @returns state All model states
 * @example <caption>Usage example</caption>
 * import mirror from '@ccreator/mirror';
 * // or
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
