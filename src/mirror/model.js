import set from 'lodash/set';
import get from 'lodash/get';
import forEach from 'lodash/forEach';
import remove from 'lodash/remove';
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
    if (models.find((item) => item.name === name)) {
        // edit by leon, allow reload model
        // throw new Error(`Model "${name}" has been created, please select another name!`);
        remove(models, (item) => item.name === name);
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

export default function model(base) {
    // Set Method
    set(base, 'reducers.set', (state, data) => {
        if (typeof data !== 'object') throw new Error(`actions.${base.name}.set() 参数必须为Object类型！`);
        forEach(data, (value, key) => {
            if (state[key] === undefined) throw new Error(`属性未定义【${key}】，请在模型中定义此属性`);
        });
        return { ...state, ...data };
    });
    // Get Method
    set(base, 'effects.get', (key, getState) => {
        const data = getState()[base.name];
        if (!key) return data;
        return get(data, key);
    });
    const { name, reducers, initialState, effects } = validateModel(base);
    const reducer = getReducer(resolveReducers(name, reducers), initialState);
    const toAdd = { name, reducer };
    models.push(toAdd);
    addActions(name, reducers, effects);
    return toAdd;
}
