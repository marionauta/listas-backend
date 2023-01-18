import db from "@/db.ts";
import { Item } from "@/models/item.ts";
import { ItemCreatePayload } from "@/models/item_create_payload.ts";

export function addAction(payload: ItemCreatePayload): Item {
  const { list, name } = payload;
  const id = crypto.randomUUID();
  db.query("insert into items (id, list, name) values (:id, :list, :name)", {
    id,
    list,
    name,
  });
  const resultQuery = db.prepareQuery(
    "select id, name, completed_at from items where id = :id",
  );
  const result = resultQuery.firstEntry({ id });
  return result as unknown as Item;
}
