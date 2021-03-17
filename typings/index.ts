import Koa from 'koa';
import Router from '@koa/router';
import { Logger as WinstonLogger, LeveledLogMethod } from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import { Files } from 'formidable';

import { Options as BodyParserOpts } from '../src/middleware/body-parser';
import { ConfigServe } from '../src/middleware/serve';
import { Validate } from '../src/middleware/router/middleware/validator';

export interface Logger extends WinstonLogger {
  fatal: LeveledLogMethod;
  trace: LeveledLogMethod;
  child(options: Object): Logger;
}

export type ConfigRoute<TState = DefaultState, TCustom = DefaultCustom> = {
  controller: Middleware<TState, TCustom> | Middleware<TState, TCustom>[];
  policies?: Middleware<TState, TCustom>[] | boolean;
  bodyParser?: boolean | Partial<BodyParserOpts>;
  validate?: Validate;
  timeout?: number;
  cors?: CorsOptions | boolean;
  xframes?: XFrameOptions | true;
  csp?: CSPOptions | true;
};

export type ConfigRoutes<TState = DefaultState, TCustom = DefaultCustom> = {
  [routeOrPrefix: string]: ConfigRoute<TState, TCustom> | ConfigRoutes<TState, TCustom>;
};

export type ConfigCustom = {
  [key: string]: any;
};

export type CorsOptions = { allRoutes?: boolean } & {
  allowOrigins: string[] | string;
  allowMethods?: string[] | string;
  allowHeaders?: string[] | string;
  exposeHeaders?: string[] | string;
  allowCredentials?: boolean;
  maxAge?: number;
};

export type CSPOptions = {
  policy: { [key: string]: string };
  reportOnly?: boolean;
  reportUri?: string;
};

export type XFrameOptions = 'DENY' | 'SAMEORIGIN';

export type ConfigSecurity = {
  cors?: CorsOptions;
  xframes?: XFrameOptions;
  csp?: CSPOptions;
};

export type Response = (this: Context, ...args: any) => void;

type DefaultErrorResponse = (this: Context, err: Error) => void;

export type ConfigResponses = {
  onError?: DefaultErrorResponse;
  onBodyParserError?: DefaultErrorResponse;
  onValidateError?: DefaultErrorResponse;
  onNotFound?: (this: Context) => void;
} & {
  [key: string]: Response;
};

export type Helper = (this: NicoContext<DefaultState, any>, ...args: any) => any;

export type ConfigHelpers = {
  [key: string]: Helper;
};

export type LoggerLevel = 'fatal' | 'error' | 'warn' | 'info' | 'debug' | 'trace';

export type FileLevel = LoggerLevel | DailyRotateFile.DailyRotateFileTransportOptions;

export interface ConfigLogger {
  fileLevel?: FileLevel | FileLevel[] | 'none';
  consoleLevel?: LoggerLevel | 'none';
}

export type CustomMiddlewares = {
  [key: string]: Middleware;
};

export type InputConfig<TState = DefaultState, TCustom = DefaultCustom> = {
  routes?: ConfigRoutes<TState, TCustom>;
  custom?: ConfigCustom;
  security?: ConfigSecurity;
  serve?: ConfigServe | ConfigServe[];
  responses?: ConfigResponses;
  helpers?: ConfigHelpers;
  advancedConfigs?: {
    routerOptions?: Router.RouterOptions;
    forceExitTime?: number;
  };
  logger?: ConfigLogger;
};

export type Config<TState = DefaultState, TCustom = DefaultCustom> = Required<
  InputConfig<TState, TCustom>
>;

export type HttpMethod = 'post' | 'get' | 'delete' | 'put' | 'patch';

export interface DefaultState extends Koa.DefaultState {
  query?: any;
  params?: any;
  body?: any;
  files?: Files;
  requestStartTime?: [number, number];
}

export type DefaultHelper = {
  getExecuteTime: () => number;
};

export interface DefaultCustom extends Koa.DefaultContext {
  config: Config;
  logger: Logger;
  helper: {
    [key: string]: Helper;
  } & DefaultHelper;
}

export type Context<
  TState = Koa.DefaultState,
  TCustom = Koa.DefaultContext
> = Koa.ParameterizedContext<TState, TCustom>;

export type Next = Koa.Next;

export type Middleware<TState = Koa.DefaultState, TCustom = Koa.DefaultContext> = Koa.Middleware<
  TState,
  TCustom
>;

export type NicoContext<TState = DefaultState, TCustom = DefaultCustom> = Koa.ParameterizedContext<
  TState,
  TCustom
>;

export type NicoNext = Next;

export type NicoMiddleware<TState = DefaultState, TCustom = DefaultCustom> = Koa.Middleware<
  TState,
  TCustom
>;
