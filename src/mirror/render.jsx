// eslint-disable-next-line
import React from 'react';
// eslint-disable-next-line
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import { options } from './defaults';
import { models } from './model';
import { store, createStore, replaceReducer } from './store';

let started = false;
let Root;

export default function render(component, container, callback) {
    const { initialState, middlewares, reducers } = options;
    if (started) {
        replaceReducer(store.data, models, reducers);
        if (arguments.length === 0) {
            return Root;
        }
    } else {
        createStore(models, reducers, initialState, middlewares);
    }
    Root = () => (
        <Provider store={store.data}>
            {component}
        </Provider>
    );
    started = true;
    if (global.document) {
        ReactDOM.render(<Root />, container, callback);
    }
    return Root;
}
