import { Provider, connect } from "react-redux";
declare let actions: any;
declare const hook: (callback: any) => void;
declare const createStore: () => any;
declare const model: (source: any) => void;
declare const dynamicModel: (source: any) => void;
declare const mirror: Readonly<{
    __proto__: any;
    readonly actions: any;
    createStore: () => any;
    dynamicModel: (source: any) => void;
    hook: (callback: any) => void;
    model: (source: any) => void;
}>;
export { Provider, actions, connect, createStore, mirror as default, dynamicModel, hook, model };
