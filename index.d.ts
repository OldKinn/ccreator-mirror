import type * as React from 'react'

declare interface Model {
  name: string
  state: object
  reducers?: object
  effects?: object
}

declare interface ProviderProps {
  children: React.ReactElement
  store: any
}

export function Provider({ children, store }: ProviderProps): React.ReactElement

export const actions: any

export function connect(P: (state: any) => object): React.ReactElement

export function hook(P: (data: object, disp: any) => void): void

export function createStore(): any

export function model(P: Model): void
