import db from "@/db.ts";
import { Handler } from "@/models/handler.ts";
import { List } from "@/models/list.ts";

interface Payload {
  listId: List["id"];
  name: string;
}

export const createItemHandler: Handler<Payload> = (
  { payload: { listId, name } },
) => {
  const id = crypto.randomUUID();
  db.query(
    "insert into items (id, listId, name) values (:id, :listId, :name)",
    {
      id,
      listId,
      name,
    },
  );
  const resultQuery = db.prepareQuery(
    "select id, name, completedAt from items where id = :id",
  );
  const result = resultQuery.firstEntry({ id });
  return {
    action: {
      action: "item-updated",
      payload: result,
    },
    broadcast: true,
  };
};
