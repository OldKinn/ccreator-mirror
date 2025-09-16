/* eslint-disable no-param-reassign, import/no-mutable-exports, import/no-extraneous-dependencies, no-console */
import { init } from '@rematch/core';

/**
 * React State Management
 *
 * @module mirror
 *
 */

// All models collection - using Map for better performance
const models = new Map();

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

// Callbacks collection - using Set to prevent duplicate hooks
const hooks = new Set();

const debug = (content, type = '', color = 'teal') => {
    if (process.env.NODE_ENV === 'production') return; // Skip debug in production
    
    const style = `color:${color};font-weight:bolder;`;
    console.log(`%c---------------->${type}`, style);
    console.log(content);
    console.log('%c<----------------', style);
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
    if (typeof callback !== 'function') {
        throw new Error('Hook callback must be a function');
    }
    hooks.add(callback);
};

/**
 * Remove callback hook
 * @param {Function} callback Callback hook to remove
 */
const unhook = (callback) => {
    hooks.delete(callback);
};

const createMiddleware = () => (next) => (action) => {
    hooks.forEach((callback) => {
        try {
            callback(action);
        } catch (error) {
            console.error('Hook callback error:', error);
        }
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
    if (store) {
        console.warn('Store already exists. Returning existing store.');
        return store;
    }
    
    // Convert Map to object for rematch compatibility
    const modelsObject = Object.fromEntries(models);
    
    store = init({ 
        models: modelsObject, 
        redux: { 
            middlewares: [createMiddleware]
        } 
    });
    actions = store.dispatch;
    return store;
};

// Transform model
const transformModel = (source) => {
    if (!source || typeof source !== 'object') {
        throw new Error('Model must be an object');
    }
    
    if (!source.name || typeof source.name !== 'string') {
        throw new Error('Model name must be a non-empty string');
    }
    
    if (source.state === undefined) {
        throw new Error('Model state is required');
    }
    
    // Check for duplicate model names
    if (models.has(source.name)) {
        throw new Error(`Model with name "${source.name}" already exists`);
    }
    
    // Create a deep copy to avoid mutations
    const transformedModel = { ...source };
    
    if (!transformedModel.reducers) {
        transformedModel.reducers = {};
    }
    
    if (typeof transformedModel.state === 'object' && transformedModel.state !== null) {
        const defaultState = { ...transformedModel.state };
        
        transformedModel.reducers.set = (state, payload) => {
            if (payload === null || payload === undefined) {
                return state;
            }
            
            if (typeof payload !== 'object') {
                throw new Error(`Model ${transformedModel.name}.set() payload must be an object`);
            }
            
            // Validate payload keys against default state
            Object.keys(payload).forEach((key) => {
                if (defaultState[key] === undefined) {
                    throw new Error(`Model ${transformedModel.name}.state.${key} is not defined`);
                }
            });
            
            return { ...state, ...payload };
        };
        
        transformedModel.reducers.reset = () => ({ ...defaultState });
    } else {
        const defaultState = transformedModel.state;
        
        transformedModel.reducers.set = (state, payload) => {
            if (payload === undefined) {
                return state;
            }
            return payload;
        };
        
        transformedModel.reducers.reset = () => defaultState;
    }
    
    if (!transformedModel.effects) {
        transformedModel.effects = {};
    }
    
    transformedModel.effects.get = (payload, getState) => {
        const state = getState()[transformedModel.name];
        if (!payload) return state;
        
        if (typeof payload !== 'string') {
            throw new Error(`Model ${transformedModel.name}.get() payload must be a string`);
        }
        
        return state[payload];
    };
    
    return transformedModel;
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
    models.set(target.name, target);
    
    if (store) {
        try {
            store.addModel(target);
        } catch (error) {
            console.error(`Failed to add model "${target.name}" to store:`, error);
            throw error;
        }
    }
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
const getState = () => {
    if (!store) {
        throw new Error('Store not initialized. Call createStore() first.');
    }
    return store.getState();
};

/**
 * Get a specific model state
 * @param {string} modelName Model name
 * @returns {*} Model state
 */
const getModelState = (modelName) => {
    if (!modelName || typeof modelName !== 'string') {
        throw new Error('Model name must be a non-empty string');
    }
    
    const state = getState();
    if (!state[modelName]) {
        throw new Error(`Model "${modelName}" not found`);
    }
    
    return state[modelName];
};

/**
 * Check if a model exists
 * @param {string} modelName Model name
 * @returns {boolean} Whether the model exists
 */
const hasModel = (modelName) => {
    return models.has(modelName);
};

/**
 * Get all registered model names
 * @returns {string[]} Array of model names
 */
const getModelNames = () => {
    return Array.from(models.keys());
};

export {
    debug,
    model,
    actions,
    createStore,
    hook,
    unhook,
    getState,
    getModelState,
    hasModel,
    getModelNames,
};
