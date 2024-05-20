import { Handler } from "@/models/handler.ts";

export const pingHandler: Handler = () => ({
  action: {
    action: "pong",
    payload: undefined,
  },
});
