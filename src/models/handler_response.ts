import type { Action } from "@/models/action.ts";

interface SingleActionResponse {
  action: Action;
  broadcast?: boolean;
}

interface MultiActionResponse {
  actions: Action[];
  broadcast?: boolean;
}

export type HandlerResponse = SingleActionResponse | MultiActionResponse;

export const actions = (response: HandlerResponse): Action[] => {
  if ("action" in response) {
    return [response.action];
  } else {
    return response.actions;
  }
};
