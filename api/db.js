const Database = require('better-sqlite3');
const path = require('path');

// For Vercel, we need to handle the database differently
let db;

function initDb() {
  if (db) return db;
  
  try {
    // In Vercel, we need to create the database in /tmp
    const dbPath = process.env.VERCEL 
      ? '/tmp/data.db' 
      : path.join(__dirname, '../server/data.db');
    
    db = new Database(dbPath);
    
    // Create tables
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
        id TEXT PRIMARY KEY,
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

    // Seed data if empty
    const row = db.prepare('SELECT COUNT(*) as cnt FROM canteens').get();
    if (!row || row.cnt === 0) {
      seedData();
    }

    return db;
  } catch (error) {
    console.error('Database initialization failed:', error);
    throw error;
  }
}

function seedData() {
  const canteens = [
    { id: '1', name: 'North canteen', slug: 'north-canteen', description: 'Quick bites, street food, and regional specialties.', image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=60', rating: 4.2, preparation_time: '10-15 min', is_open: 1, total_orders: 1800 },
    { id: '2', name: 'South canteen', slug: 'south-canteen', description: 'Popular meals, snacks, and beverages.', image: 'https://images.unsplash.com/photo-1567521464027-f127ff144326?w=800&auto=format&fit=crop&q=60', rating: 4.5, preparation_time: '15-20 min', is_open: 1, total_orders: 2500 },
    { id: '3', name: "KN's", slug: 'kns', description: 'Fresh salads, smoothies, and healthy alternatives.', image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&auto=format&fit=crop&q=60', rating: 4.7, preparation_time: '8-12 min', is_open: 1, total_orders: 1200 },
    { id: '4', name: 'Mingos', slug: 'mingos', description: 'Pizza, burgers, Asian dishes, and more.', image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&auto=format&fit=crop&q=60', rating: 4.3, preparation_time: '20-25 min', is_open: 1, total_orders: 950 },
    { id: '5', name: 'Nandhini', slug: 'nandhini', description: 'Premium coffee, pastries, and desserts.', image: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800&auto=format&fit=crop&q=60', rating: 4.6, preparation_time: '5-10 min', is_open: 1, total_orders: 3200 },
    { id: '6', name: 'Lake view', slug: 'lake-view', description: 'Open late for night owls. Comfort food and quick meals.', image: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=800&auto=format&fit=crop&q=60', rating: 4.1, preparation_time: '12-18 min', is_open: 1, total_orders: 1650 },
  ];

  const insertCanteen = db.prepare(`INSERT OR IGNORE INTO canteens (id, name, slug, description, image, rating, preparation_time, is_open, total_orders) VALUES (@id, @name, @slug, @description, @image, @rating, @preparation_time, @is_open, @total_orders)`);
  const insertMenu = db.prepare(`INSERT OR IGNORE INTO menu_items (id, canteen_id, name, description, price, image) VALUES (@id, @canteen_id, @name, @description, @price, @image)`);

  const menus = {
    '1': [
      { id: '1-1', name: 'Pav Bhaji', description: 'Spicy vegetable curry served with buttered bread rolls', price: 45, image: 'https://images.unsplash.com/photo-1626132647523-66520e67b72d?w=300&auto=format&fit=crop&q=60' },
      { id: '1-2', name: 'Vada Pav', description: 'Spiced potato fritter in a bun', price: 25, image: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=300&auto=format&fit=crop&q=60' }
    ],
    '2': [
      { id: '2-1', name: 'Chicken Biryani', description: 'Aromatic basmati rice with chicken', price: 120, image: 'https://images.unsplash.com/photo-1563379091339-03246963d25d?w=300&auto=format&fit=crop&q=60' },
      { id: '2-2', name: 'Veg Thali', description: 'Dal, sabzi, roti, rice, and sweet', price: 80, image: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=300&auto=format&fit=crop&q=60' }
    ],
    '3': [{ id: '3-1', name: 'Green Salad Bowl', description: 'Crisp greens with light dressing', price: 70, image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=300&auto=format&fit=crop&q=60' }],
    '4': [{ id: '4-1', name: 'Margherita Pizza', description: 'Fresh mozzarella and basil', price: 150, image: 'https://images.unsplash.com/photo-1548365328-9f547fb0953a?w=300&auto=format&fit=crop&q=60' }],
    '5': [{ id: '5-1', name: 'Cappuccino', description: 'Espresso with steamed milk and foam', price: 60, image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=300&auto=format&fit=crop&q=60' }],
    '6': [{ id: '6-1', name: 'Grilled Sandwich', description: 'Veggies and cheese', price: 50, image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=300&auto=format&fit=crop&q=60' }],
  };

  const insertData = db.transaction(() => {
    for (const c of canteens) insertCanteen.run(c);
    for (const cid of Object.keys(menus)) {
      for (const m of menus[cid]) insertMenu.run({ ...m, canteen_id: cid });
    }
  });

  insertData();
}

module.exports = { initDb };