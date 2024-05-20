import { Handler } from "@/models/handler.ts";
import * as logger from "deno/log/mod.ts";
import { actions } from "@/models/handler_response.ts";

type Middleware = (next: Handler) => Handler;

const catchAll: Middleware = (next) => (action) => {
  try {
    return next(action);
  } catch (error) {
    return {
      action: {
        action: "error",
        payload: error instanceof Error ? error.message : error,
      },
    };
  }
};

const logErrors: Middleware = (next) => (action) => {
  const response = next(action);
  if (actions(response).some((action) => action.action === "error")) {
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
