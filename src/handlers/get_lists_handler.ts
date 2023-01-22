import db from "@/db.ts";
import { Handler } from "@/models/handler.ts";

export const getListsHandler: Handler = () => {
  const listsQuery = db.prepareQuery("select id, name from lists");
  const lists = listsQuery.allEntries();
  return {
    actions: lists.map((list) => ({
      action: "list-updated",
      payload: list,
    })),
    broadcast: false,
  };
};
