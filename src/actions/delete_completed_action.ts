import { Row } from "sqlite/mod.ts";
import db from "@/db.ts";
import { Item } from "@/models/item.ts";

type Result = Pick<Item, "id">;

export function deleteCompletedAction(payload: { list: string }): Result[] {
  const { list } = payload;
  const deleteQuery = db.prepareQuery<Row, Result>(
    "delete from items where list = :list and completed_at is not null returning id",
  );
  const deletedItemIds = deleteQuery.allEntries({ list });
  return deletedItemIds;
}
