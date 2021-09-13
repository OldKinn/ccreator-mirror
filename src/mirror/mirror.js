import {
    HashRouter as Router,
    BrowserRouter,
    MemoryRouter,
    Route,
    Link,
    NavLink,
    Redirect,
    Switch,
    withRouter,
    useHistory,
    matchPath,
} from 'react-router-dom';
import { connect } from 'react-redux';
import model from './model';
import { actions } from './actions';
import render from './render';
import hook from './hook';
import defaults from './defaults';
import toReducers from './toReducers';
import History from './History';

export {
    Router,
    BrowserRouter,
    MemoryRouter,
    Route,
    Link,
    NavLink,
    Redirect,
    Switch,
    withRouter,
    matchPath,
    useHistory,
    connect,
    model,
    actions,
    hook,
    defaults,
    render,
    toReducers,
    History,
};
