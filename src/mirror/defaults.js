import { effects, addEffect } from './effects';

export const options = {
    historyMode: 'browser',
    middlewares: [],
    reducers: {},
    addEffect: addEffect(effects),
};

const historyModes = ['browser', 'hash', 'memory'];
export default function defaults(opts = {}) {
    const {
        historyMode,
        middlewares,
    } = opts;
    if (historyMode && !historyModes.includes(historyMode)) {
        throw new Error(`historyMode "${historyMode}" is invalid, must be one of ${historyModes.join(', ')}!`);
    }
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
