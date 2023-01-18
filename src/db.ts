import { DB } from "sqlite/mod.ts";

const db = new DB("db.sqlite");
db.execute(`
    CREATE TABLE IF NOT EXISTS lists (
        id UUID PRIMARY KEY,
        name TEXT NON NULL
    )
`);

db.execute(`
    CREATE TABLE IF NOT EXISTS items (
        id UUID PRIMARY KEY,
        list UUID NON NULL,
        name TEXT NON NULL,
        completed_at INT,
        FOREIGN KEY(list) REFERENCES lists(id) ON UPDATE CASCADE ON DELETE CASCADE
    )
`);

export default db;
