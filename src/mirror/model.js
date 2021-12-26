/* eslint-disable default-param-last */
import set from 'lodash/set';
import get from 'lodash/get';
import forEach from 'lodash/forEach';
import remove from 'lodash/remove';
import cloneDeep from 'lodash/cloneDeep';
import { resolveReducers, addActions } from './actions';

const isObject = (target) => Object.prototype.toString.call(target) === '[object Object]';

export const models = [];

function filterReducers(reducers) {
    if (!reducers) {
        return reducers;
    }
    return Object.keys(reducers).reduce((acc, action) => {
        if (typeof reducers[action] === 'function') {
            acc[action] = reducers[action];
        }
        return acc;
    }, {});
}

function validateModel(m = {}) {
    const { name, state, reducers, effects } = m;
    if (!name || typeof name !== 'string') {
        throw new Error('Model name must be a valid string!');
    }
    if (models.find((item) => item.name === name)) {
        remove(models, (item) => item.name === name);
    }
    if (state === undefined || !isObject(state)) {
        throw new Error('模型的状态（state）必须是对象类型');
    }
    if (reducers !== undefined && !isObject(reducers)) {
        throw new Error('Model reducers must be a valid object!');
    }
    if (effects !== undefined && !isObject(effects)) {
        throw new Error('Model effects must be a valid object!');
    }
    set(m, 'reducers', filterReducers(reducers));
    set(m, 'effects', filterReducers(effects));
    return m;
}

// If initialState is not specified, then set it to null
function getReducer(reducers, initialState = null) {
    return (state = initialState, action) => {
        if (typeof reducers[action.type] === 'function') {
            return reducers[action.type](state, action.data);
        }
        return state;
    };
}

export default function model(base) {
    const defaultState = cloneDeep(base.state);
    set(base, 'reducers.set', (state, data) => {
        if (typeof data !== 'object') throw new Error(`actions.${base.name}.set() 参数必须为Object类型！`);
        forEach(data, (value, key) => {
            if (defaultState[key] === undefined) throw new Error(`属性未定义【${key}】，请在模型【state】中定义此属性`);
        });
        return { ...state, ...data };
    });
    set(base, 'reducers.reset', () => ({ ...defaultState }));
    set(base, 'effects.get', (key, getState) => {
        const data = getState()[base.name];
        if (!key) return data;
        return get(data, key);
    });
    const { name, reducers, state, effects } = validateModel(base);
    const reducer = getReducer(resolveReducers(name, reducers), state);
    const toAdd = { name, reducer };
    models.push(toAdd);
    addActions(name, reducers, effects);
    return toAdd;
}
