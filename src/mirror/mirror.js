import { Provider, connect } from 'react-redux';
import model, { models } from './model';
import { actions } from './actions';
import hook from './hook';
import defaults, { options } from './defaults';
import toReducers from './toReducers';
import { store, createStore } from './store';

const initStore = () => {
    const { reducers, initialState, middlewares } = options;
    createStore(models, reducers, initialState, middlewares);
    return store;
};

export {
    Provider,
    connect,
    model,
    actions,
    hook,
    defaults,
    toReducers,
    initStore,
};
