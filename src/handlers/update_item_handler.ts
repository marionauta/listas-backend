import db, { ItemRow } from "@/db.ts";
import { Handler } from "@/models/handler.ts";
import { Item } from "@/models/item.ts";

const updateItemQuery = db.prepareQuery(
  "update items set name = :name, completedAt = :completedAt where id = :id and listId = :listId",
);

const getUpdatedItemQuery = db.prepareQuery<ItemRow, Item>(
  "select id, listId, name, completedAt from items where id = :id limit 1",
);

export const updateItemHandler: Handler<Item> = ({ payload }) => {
  const { id, listId, name, completedAt } = payload;
  updateItemQuery.execute({ id, listId, name, completedAt });
  const result = getUpdatedItemQuery.firstEntry({ id });
  if (!result) return { actions: [] };
  return {
    action: {
      action: "item-updated",
      payload: result,
    },
    broadcast: true,
  };
};
