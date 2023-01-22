import db from "@/db.ts";
import { Handler } from "@/models/handler.ts";
import { Item } from "@/models/item.ts";
import { List } from "../models/list.ts";

type Payload = Item & {
  listId: List["id"];
};

export const updateItemHandler: Handler<Payload> = ({ payload }) => {
  const { id, listId, name, completed_at } = payload;
  db.query(
    "update items set name = :name, completed_at = :completed_at where id = :id and list = :listId",
    {
      id,
      listId,
      name,
      completed_at,
    },
  );
  const resultQuery = db.prepareQuery(
    "select id, name, completed_at from items where id = :id",
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
