import {
    createStore as _createStore,
    applyMiddleware,
    combineReducers,
    compose,
} from 'redux';
import createMiddleware from './middleware';

export const store = {};

function createReducer(models, reducers) {
    const modelReducers = models.reduce((acc, cur) => {
        acc[cur.name] = cur.reducer;
        return acc;
    }, {});
    return combineReducers({
        ...reducers,
        ...modelReducers,
    });
}

export function createStore(models, reducers, initialState, middlewares = []) {
    const middleware = applyMiddleware(
        ...middlewares,
        createMiddleware(),
    );
    const enhancers = [middleware];
    let composeEnhancers = compose;
    if (process.env.NODE_ENV !== 'production') {
        if (global.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) {
            composeEnhancers = global.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__;
        }
    }
    const reducer = createReducer(models, reducers);
    const enhancer = composeEnhancers(...enhancers);
    store.data = _createStore(reducer, initialState, enhancer);
    return store;
}

export function replaceReducer(store2, models, reducers) {
    const reducer = createReducer(models, reducers);
    store2.replaceReducer(reducer);
}
