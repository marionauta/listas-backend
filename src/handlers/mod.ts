import { Action } from "@/models/action.ts";
import { Handler } from "@/models/handler.ts";
import { createItemHandler } from "@/handlers/create_item_handler.ts";
import { deleteCompletedItemsHandler } from "@/handlers/delete_completed_items_handler.ts";
import { getItemsHandler } from "@/handlers/get_items_handler.ts";
import { getListsHandler } from "@/handlers/get_lists_handler.ts";
import { pingHandler } from "@/handlers/ping_handler.ts";
import { updateItemHandler } from "@/handlers/update_item_handler.ts";

const handlers: Record<string, Handler> = {
  "ping": pingHandler,
  "get-items": getItemsHandler,
  "create-item": createItemHandler,
  "update-item": updateItemHandler,
  "delete-completed": deleteCompletedItemsHandler,
  "get-lists": getListsHandler,
};

const handler: Handler = (action: Action) => {
  const handler = handlers[action.action];
  if (!handler) {
    console.warn(`Unrecognized command: ${action.action}`);
    return {
      actions: [{ action: "error", payload: "unrecognized command!" }],
    };
  }
  return handler(action);
};

export default handler;
