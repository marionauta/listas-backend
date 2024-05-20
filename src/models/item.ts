import { List } from "./list.ts";

export type Item = {
  id: string;
  listId: List["id"];
  name: string;
  completedAt: number | null;
};
