import { Action } from "@/models/action.ts";
import { HandlerResponse } from "@/models/handler_response.ts";

export type Handler<Payload = any> = (
  action: Action<Payload>,
) => HandlerResponse;
