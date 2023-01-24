import { Handler } from "@/models/handler.ts";
import * as logger from "deno/log/mod.ts";

type Middleware = (next: Handler) => Handler;

const catchAll: Middleware = (next) => (action) => {
  try {
    return next(action);
  } catch (error) {
    return {
      actions: [{
        action: "error",
        payload: error instanceof Error ? error.message : error,
      }],
      broadcast: false,
    };
  }
};

const logErrors: Middleware = (next) => (action) => {
  const response = next(action);
  if (response.actions.some((action) => action.action === "error")) {
    logger.error({ request: action, response });
  }
  return response;
};

const compose = (...middlewares: Middleware[]): Middleware => (next) =>
  middlewares.reduce((acc, cur) => cur(acc), next);

const middlewares = compose(
  catchAll,
  logErrors,
);

export default middlewares;
