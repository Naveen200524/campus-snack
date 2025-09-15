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

function createOrder({ items, total }) {
  const orderId = `CE-${new Date().toISOString().slice(0, 10).replace(/-/g, "")}-${Math.floor(1000 + Math.random() * 9000)}`;
  const estimatedTime = Math.floor(Math.random() * (25 - 10 + 1)) + 10;
  
  const insertOrder = db.prepare('INSERT INTO orders (id, created_at, total, status, canteen_name) VALUES (?, ?, ?, ?, ?)');
  const insertItem = db.prepare('INSERT INTO order_items (id, order_id, item_id, name, quantity, price, image, canteen_name) VALUES (?, ?, ?, ?, ?, ?, ?, ?)');

  db.transaction(() => {
    insertOrder.run(orderId, new Date().toISOString(), total, 'completed', items[0].canteenName);
    for (const item of items) {
      insertItem.run(`${orderId}-${item.id}`, orderId, item.id, item.name, item.quantity, item.price, item.image, item.canteenName);
    }
  })();

  return { orderId, estimatedTime };
}

db.createOrder = createOrder;

module.exports = db;
