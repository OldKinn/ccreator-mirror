import { middleware } from './middleware';
import { options } from './defaults';

const SEP = '/';

export const actions = {};

function actionCreator(modelName, actionName) {
    return (data) => (
        middleware.dispatch({
            type: `${modelName}${SEP}${actionName}`,
            data,
        })
    );
}

function each(obj, callback) {
    Object.keys(obj).forEach(callback);
}

export function addActions(modelName, reducers = {}, effects = {}) {
    if (Object.keys(reducers).length || Object.keys(effects).length) {
        actions[modelName] = actions[modelName] || {};
    }
    each(reducers, (actionName) => {
        actions[modelName][actionName] = actionCreator(modelName, actionName);
    });
    each(effects, (effectName) => {
        options.addEffect(`${modelName}${SEP}${effectName}`, effects[effectName]);
        actions[modelName][effectName] = actionCreator(modelName, effectName);
        actions[modelName][effectName].isEffect = true;
    });
}

export function resolveReducers(modelName, reducers = {}) {
    return Object.keys(reducers).reduce((acc, cur) => {
        acc[`${modelName}${SEP}${cur}`] = reducers[cur];
        return acc;
    }, {});
}
