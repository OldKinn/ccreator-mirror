import { createStore, applyMiddleware, combineReducers, compose } from 'redux';
import createMiddleware from './middleware';

export const store = {};

function createReducer(models, reducers) {
    const modelReducers = models.reduce((acc, cur) => {
        acc[cur.name] = cur.reducer;
        return acc;
    }, {});
    return combineReducers({ ...reducers, ...modelReducers });
}

export function initStore(models, reducers, initialState, middlewares = []) {
    const middleware = applyMiddleware(
        ...middlewares,
        createMiddleware(),
    );
    const enhancers = [middleware];
    const composeEnhancers = compose;
    const reducer = createReducer(models, reducers);
    const enhancer = composeEnhancers(...enhancers);
    store.data = createStore(reducer, initialState, enhancer);
    return store;
}

export function replaceReducer(store2, models, reducers) {
    const reducer = createReducer(models, reducers);
    store2.replaceReducer(reducer);
}
