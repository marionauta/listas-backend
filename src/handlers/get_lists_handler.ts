import db, { ListRow } from "@/db.ts";
import { Handler } from "@/models/handler.ts";
import { List } from "@/models/list.ts";

const getListsQuery = db.prepareQuery<ListRow, List>(
  "select id, name from lists",
);

export const getListsHandler: Handler = () => {
  const lists = getListsQuery.allEntries();
  return {
    actions: lists.map((list) => ({
      action: "list-updated",
      payload: list,
    })),
  };
};
