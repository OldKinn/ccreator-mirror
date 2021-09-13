import { effects } from './effects';
import { hooks } from './hook';

function warning() {
    throw new Error('存储对象(store)未创建，无法调用dispatch和getState');
}

export const middleware = {
    dispatch: warning,
    getState: warning,
};

export default function createMiddleware() {
    return (middlewareAPI) => {
        middleware.dispatch = middlewareAPI.dispatch;
        middleware.getState = middlewareAPI.getState;
        return (next) => (action) => {
            let result = next(action);
            if (typeof effects[action.type] === 'function') {
                result = effects[action.type](action.data, middleware.getState);
            }
            hooks.forEach((hook) => hook(action, middleware.getState));
            return result;
        };
    };
}
