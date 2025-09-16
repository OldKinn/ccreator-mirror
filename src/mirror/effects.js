// Registry of namespaced effects
export const effects = {};

export const addEffect = () => (name, handler) => {
    effects[name] = handler;
};
