import { DB } from "sqlite/mod.ts";

const db = new DB("db.sqlite");

db.execute("PRAGMA foreign_keys = ON;");

db.execute(`
    CREATE TABLE IF NOT EXISTS lists (
        id UUID PRIMARY KEY,
        name TEXT NOT NULL
    );
`);

db.execute(`
    CREATE TABLE IF NOT EXISTS items (
        id UUID PRIMARY KEY,
        listId UUID NOT NULL,
        name TEXT NOT NULL,
        completedAt INT,
        FOREIGN KEY(listId) REFERENCES lists(id) ON UPDATE CASCADE ON DELETE CASCADE
    );
`);

export default db;
