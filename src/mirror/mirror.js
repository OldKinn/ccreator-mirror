import model, { models } from './model';
import { actions } from './actions';
import hook from './hook';
import defaults, { options } from './defaults';
import toReducers from './toReducers';
import { store, initStore } from './store';

const createStore = () => {
    const { reducers, initialState, middlewares } = options;
    initStore(models, reducers, initialState, middlewares);
    return store.data;
};

export {
    model,
    actions,
    hook,
    defaults,
    toReducers,
    createStore,
};
