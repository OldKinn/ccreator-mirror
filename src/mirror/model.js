import set from 'lodash/set';
import get from 'lodash/get';
import forEach from 'lodash/forEach';
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
    const { name, reducers, effects } = m;
    if (!name || typeof name !== 'string') {
        throw new Error('Model name must be a valid string!');
    }
    if (name === 'routing') {
        throw new Error('Model name can not be "routing"!');
    }
    if (models.find((item) => item.name === name)) {
        throw new Error(`Model "${name}" has been created, please select another name!`);
    }
    if (reducers !== undefined && !isObject(reducers)) {
        throw new Error('Model reducers must be a valid object!');
    }
    if (effects !== undefined && !isObject(effects)) {
        throw new Error('Model effects must be a valid object!');
    }
    // eslint-disable-next-line
    m.reducers = filterReducers(reducers);
    // eslint-disable-next-line
    m.effects = filterReducers(effects);
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

export default function model(m) {
    // Set Method
    set(m, 'reducers.set', (state, data) => {
        forEach(data, (value, key) => {
            if (state[key] === undefined) {
                throw new Error(`属性未定义：${key} is undefined，请初始化此属性`);
            }
        });
        return { ...state, ...data };
    });
    // Get Method
    set(m, 'effects.get', (key, getState) => {
        const data = getState()[m.name];
        return get(data, key);
    });
    const { name, reducers, initialState, effects } = validateModel(m);
    const reducer = getReducer(resolveReducers(name, reducers), initialState);
    const toAdd = { name, reducer };
    models.push(toAdd);
    addActions(name, reducers, effects);
    return toAdd;
}
