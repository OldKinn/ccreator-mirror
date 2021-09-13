import * as mirror from './mirror';

export * from './mirror';

mirror.model({
    name: 'route',
    initialState: {
        routePush: '',
        routeReplace: '',
    },
    reducers: {
        set(state, data) {
            return { ...state, ...data };
        },
        push(state, data) {
            return { ...state, routePush: data };
        },
        replace(state, data) {
            return { ...state, routeReplace: data };
        },
    },
});

export default mirror;
