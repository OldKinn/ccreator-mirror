import * as mirror from './mirror';

export * from './mirror';

mirror.model({
    name: 'route',
    state: {
        routePush: '',
        routeReplace: '',
    },
    reducers: {
        push(state, data) {
            return { ...state, routePush: data };
        },
        replace(state, data) {
            return { ...state, routeReplace: data };
        },
    },
});

export default mirror;
