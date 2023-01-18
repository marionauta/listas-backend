import { Item } from "@/models/item.ts";
import db from "@/db.ts";

export function listAction(payload: { list: string }): Item[] {
  const itemsQuery = db.prepareQuery(
    "select id, name, completed_at from items where list = :listid",
  );
  const items = itemsQuery.allEntries({
    listid: payload.list,
  }) as unknown as Item[];
  return items;
}
