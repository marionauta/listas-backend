import db from "@/db.ts";
import { Handler } from "@/models/handler.ts";
import { Item } from "@/models/item.ts";
import { List } from "../models/list.ts";

type Payload = Item & {
  listId: List["id"];
};

export const updateItemHandler: Handler<Payload> = ({ payload }) => {
  const { id, listId, name, completedAt } = payload;
  db.query(
    "update items set name = :name, completedAt = :completedAt where id = :id and listId = :listId",
    {
      id,
      listId,
      name,
      completedAt,
    },
  );
  const resultQuery = db.prepareQuery(
    "select id, name, completedAt from items where id = :id",
  );
  const result = resultQuery.firstEntry({ id });
  return {
    actions: [{
      action: "item-updated",
      payload: result,
    }],
    broadcast: true,
  };
};
