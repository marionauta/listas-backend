import { Item } from "@/models/item.ts";
import { List } from "@/models/list.ts";
import { Handler } from "@/models/handler.ts";
import db from "@/db.ts";

interface Payload {
  listId: List["id"];
}

export const getItemsHandler: Handler<Payload> = ({ payload: { listId } }) => {
  const itemsQuery = db.prepareQuery(
    "select id, name, completedAt from items where listId = :listId",
  );
  const items = itemsQuery.allEntries({ listId }) as unknown as Item[];
  return {
    actions: items.map((item) => ({ action: "item-updated", payload: item })),
    broadcast: false,
  };
};
