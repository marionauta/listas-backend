import db from "@/db.ts";
import { Item } from "@/models/item.ts";

export function updateAction(payload: Item & { list: string }): Item {
  const { id, list, name, completed_at } = payload;
  db.query(
    "update items set name = :name, completed_at = :completed_at where id = :id and list = :list",
    {
      id,
      list,
      name,
      completed_at,
    },
  );
  const resultQuery = db.prepareQuery(
    "select id, name, completed_at from items where id = :id",
  );
  const result = resultQuery.firstEntry({ id });
  return result as unknown as Item;
}
