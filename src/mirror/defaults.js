import { effects, addEffect } from './effects';

export const options = {
    historyMode: 'browser',
    middlewares: [],
    reducers: {},
    addEffect: addEffect(effects),
};

export default function defaults(opts = {}) {
    const { middlewares } = opts;
    if (middlewares && !Array.isArray(middlewares)) {
        throw new Error(`middlewares "${middlewares}" is invalid, must be an Array!`);
    }
    Object.keys(opts).forEach((key) => {
        if (key === 'reducers') {
            options[key] = {
                ...options[key],
                ...opts[key],
            };
        } else {
            options[key] = opts[key];
        }
    });
}
