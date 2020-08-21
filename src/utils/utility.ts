import deepmerge from './deepmerge';

import { DefaultState, DefaultCustom, InputConfig } from '../../typings';

export function mergeConfigs<TState = DefaultState, TCustom = DefaultCustom>(
  ...configs: InputConfig<TState, TCustom>[]
): InputConfig<TState, TCustom> {
  if (!Array.isArray(configs)) return configs;

  const config = configs.reduce((result, current, index) => {
    if (index === 0) return current;
    return deepmerge(result, current);
  }, configs[0]);

  return config as InputConfig<TState, TCustom>;
}

export function createUid() {
  let dt = new Date().getTime();
  const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (dt + Math.random() * 16) % 16 | 0;
    dt = Math.floor(dt / 16);
    return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
  });
  return uuid;
}
