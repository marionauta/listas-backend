import db from "@/db.ts";
import { Handler } from "@/models/handler.ts";
import { List } from "@/models/list.ts";

interface Payload {
  listId: List["id"];
}

const deleteQuery = db.prepareQuery(
  "delete from items where listId = :listId and completedAt is not null returning id",
);

export const deleteCompletedItemsHandler: Handler<Payload> = (
  { payload },
) => {
  const listId = payload?.listId;
  if (!listId) {
    return { actions: [] };
  }
  const deletedItemIds = deleteQuery.allEntries({ listId });
  return {
    actions: deletedItemIds.map((itemId) => ({
      action: "item-deleted",
      payload: itemId,
    })),
    broadcast: true,
  };
};
