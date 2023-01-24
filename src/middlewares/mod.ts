import { Handler } from "@/models/handler.ts";

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

const compose = (...middlewares: Middleware[]): Middleware => (next) =>
  middlewares.reduce((acc, cur) => cur(acc), next);

const middlewares = compose(
  catchAll,
);

export default middlewares;
