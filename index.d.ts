import { Provider, connect } from "react-redux";

export const actions: {};

export function createStore(): any;

declare const mirror: Readonly<{
  __proto__: any;
  actions: {};
  createStore: () => any;
  defaults: typeof defaults;
  hook: typeof hook;
  model: typeof model;
  toReducers: typeof toReducers;
}>;

export function defaults(opts?: {}): void;

export function hook(subscriber: any): () => void;

declare interface Model {
  name: string
  state: object
  reducers?: object
  effects?: object
}

export function model(base: Model): void;

export function toReducers(): any;

export { Provider, connect, mirror as default };
