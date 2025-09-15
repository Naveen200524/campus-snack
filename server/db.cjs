const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, 'data.db');
const db = new Database(dbPath);

envInit();

function envInit() {
  db.exec(`
  CREATE TABLE IF NOT EXISTS canteens (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    image TEXT,
    rating REAL,
    preparation_time TEXT,
    is_open INTEGER,
    total_orders INTEGER
  );

  CREATE TABLE IF NOT EXISTS menu_items (
    id TEXT PRIMARY KEY,
    canteen_id TEXT NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    price REAL NOT NULL,
    image TEXT,
    FOREIGN KEY(canteen_id) REFERENCES canteens(id)
  );

  CREATE TABLE IF NOT EXISTS orders (
    id TEXT PRIMARY KEY,           -- order token
    created_at TEXT NOT NULL,
    total REAL NOT NULL,
    status TEXT NOT NULL,
    canteen_name TEXT
  );

  CREATE TABLE IF NOT EXISTS order_items (
    id TEXT PRIMARY KEY,
    order_id TEXT NOT NULL,
    item_id TEXT,
    name TEXT NOT NULL,
    quantity INTEGER NOT NULL,
    price REAL NOT NULL,
    image TEXT,
    canteen_name TEXT,
    FOREIGN KEY(order_id) REFERENCES orders(id)
  );
  `);
}

module.exports = db;
