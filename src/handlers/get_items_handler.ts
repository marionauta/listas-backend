import { Item } from "@/models/item.ts";
import { List } from "@/models/list.ts";
import { Handler } from "@/models/handler.ts";
import db, { ItemRow } from "@/db.ts";

interface Payload {
  listId: List["id"];
}

const getItemsQuery = db.prepareQuery<ItemRow, Item, { listId: string }>(
  "select id, listId, name, completedAt from items where listId = :listId",
);

export const getItemsHandler: Handler<Payload> = ({ payload: { listId } }) => {
  const items = getItemsQuery.allEntries({ listId });
  return {
    actions: items.map((item) => ({ action: "item-updated", payload: item })),
  };
};
