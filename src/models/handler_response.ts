import { Action } from "@/models/action.ts";

export interface HandlerResponse {
  actions: Action[];
  broadcast: boolean;
}
