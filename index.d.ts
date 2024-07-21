import { Provider, connect } from "react-redux";
declare let actions: any;
declare const debug: (content: any, type?: string, color?: string) => void;
declare const hook: (callback: any) => void;
declare const createStore: () => any;
declare const model: (source: any) => void;
declare const dynamicModel: (source: any) => void;
declare const getState: () => any;
declare const mirror: Readonly<{
    __proto__: any;
    readonly actions: any;
    createStore: () => any;
    debug: (content: any, type?: string, color?: string) => void;
    dynamicModel: (source: any) => void;
    getState: () => any;
    hook: (callback: any) => void;
    model: (source: any) => void;
}>;
export { Provider, actions, connect, createStore, debug, mirror as default, dynamicModel, getState, hook, model };
