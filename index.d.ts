import { Provider, connect } from "react-redux";
import { Store } from "redux";

// Basic type definitions
export type State = Record<string, any>;
export type Payload = any;

// Reducer function type
export type Reducer<S = any, P = any> = (state: S, payload: P) => S;

// Effect function type
export type Effect<P = any, S = any> = (payload: P, getState: () => S) => any;

// Model configuration interface
export interface ModelConfig<TState = any> {
  /** Model name, required */
  name: string;
  /** Model initial state, required */
  state: TState;
  /** Synchronous operation reducers, optional */
  reducers?: Record<string, Reducer<TState, any>>;
  /** Asynchronous operation effects, optional */
  effects?: Record<string, Effect<any, State>>;
}

// Model instance interface
export interface Model<TState = any> extends ModelConfig<TState> {
  reducers: Record<string, Reducer<TState, any>>;
  effects: Record<string, Effect<any, State>>;
}

// Actions type
export interface Actions {
  [modelName: string]: {
    [actionName: string]: (...args: any[]) => any;
  };
}

// Store type - fixes dispatch type conflict
export interface MirrorStore extends Omit<Store, 'dispatch'> {
  addModel: (model: Model) => void;
  dispatch: Actions;
}

// Hook callback type
export type HookCallback = (action: any) => void;

// Exported function types
export declare const debug: (content: any, type?: string, color?: string) => void;
export declare const hook: (callback: HookCallback) => void;
export declare const createStore: () => MirrorStore;
export declare const model: <TState = any>(source: ModelConfig<TState>) => void;
export declare const getState: () => State;

// Actions declaration
export declare let actions: Actions;

// Mirror main object
export interface Mirror {
  readonly actions: Actions;
  createStore: () => MirrorStore;
  debug: (content: any, type?: string, color?: string) => void;
  getState: () => State;
  hook: (callback: HookCallback) => void;
  model: <TState = any>(source: ModelConfig<TState>) => void;
}

declare const mirror: Mirror;

// Export all contents
export { Provider, connect, mirror as default };
