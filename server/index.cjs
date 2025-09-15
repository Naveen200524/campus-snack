const express = require('express');
const cors = require('cors');
const db = require('./db.cjs');

const app = express();
app.use(cors());
app.use(express.json());

const toBool = (n) => (n ? true : false);

function seed() {
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
    '3': [ { id: '3-1', name: 'Green Salad Bowl', description: 'Crisp greens with light dressing', price: 70, image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=300&auto=format&fit=crop&q=60' } ],
    '4': [ { id: '4-1', name: 'Margherita Pizza', description: 'Fresh mozzarella and basil', price: 150, image: 'https://images.unsplash.com/photo-1548365328-9f547fb0953a?w=300&auto=format&fit=crop&q=60' } ],
    '5': [ { id: '5-1', name: 'Cappuccino', description: 'Espresso with steamed milk and foam', price: 60, image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=300&auto=format&fit=crop&q=60' } ],
    '6': [ { id: '6-1', name: 'Grilled Sandwich', description: 'Veggies and cheese', price: 50, image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=300&auto=format&fit=crop&q=60' } ],
  };

  const insertData = db.transaction(() => {
    for (const c of canteens) insertCanteen.run(c);
    for (const cid of Object.keys(menus)) {
      for (const m of menus[cid]) insertMenu.run({ ...m, canteen_id: cid });
    }
  });

  insertData();
}

// Auto-seed if empty
try {
  const row = db.prepare('SELECT COUNT(*) as cnt FROM canteens').get();
  if (!row || row.cnt === 0) {
    console.log('Seeding database with initial data...');
    seed();
  }
} catch (e) {
  console.error('Failed to check/seed database', e);
}

// Optional manual seed route
app.post('/api/seed', (req, res) => {
  seed();
  res.json({ ok: true });
});

app.get('/api/canteens', (req, res) => {
  const rows = db.prepare('SELECT * FROM canteens').all();
  const data = rows.map(r => ({
    id: r.id,
    name: r.name,
    slug: r.slug,
    description: r.description,
    image: r.image,
    rating: r.rating,
    preparationTime: r.preparation_time,
    isOpen: toBool(r.is_open),
    totalOrders: r.total_orders,
  }));
  res.json(data);
});

app.get('/api/canteens/:slug', (req, res) => {
  const c = db.prepare('SELECT * FROM canteens WHERE slug = ?').get(req.params.slug);
  if (!c) return res.status(404).json({ error: 'Not found' });
  const menu = db.prepare('SELECT * FROM menu_items WHERE canteen_id = ?').all(c.id).map(m => ({
    id: m.id,
    name: m.name,
    description: m.description,
    price: m.price,
    image: m.image,
    canteenId: c.id,
    canteenName: c.name,
  }));
  const canteen = {
    id: c.id,
    name: c.name,
    slug: c.slug,
    description: c.description,
    image: c.image,
    rating: c.rating,
    preparationTime: c.preparation_time,
    isOpen: toBool(c.is_open),
    totalOrders: c.total_orders,
  };
  res.json({ canteen, menu });
});

app.post('/api/orders', (req, res) => {
  const { items, total } = req.body;
  const order = db.createOrder({ items, total });
  res.json(order);
});

// Create order
app.post('/api/orders', (req, res) => {
  try {
    const { items } = req.body || {};
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'No items provided' });
    }
    const token = `CE-${new Date().toISOString().slice(0,10).replace(/-/g,'')}-${Math.floor(Math.random()*10000).toString().padStart(4,'0')}`;
    const createdAt = new Date().toISOString();
    const total = items.reduce((sum, it) => sum + (Number(it.price) * Number(it.quantity || 1)), 0);
    const canteenName = items[0]?.canteenName || 'Campus Canteen';

    const insertOrder = db.prepare('INSERT INTO orders (id, created_at, total, status, canteen_name) VALUES (?, ?, ?, ?, ?)');
    const insertItem = db.prepare('INSERT INTO order_items (id, order_id, item_id, name, quantity, price, image, canteen_name) VALUES (?, ?, ?, ?, ?, ?, ?, ?)');

    db.transaction(() => {
      insertOrder.run(token, createdAt, total, 'completed', canteenName);
      for (const it of items) {
        insertItem.run(
          `${token}-${it.id}`,
          token,
          it.id,
          it.name,
          it.quantity || 1,
          it.price,
          it.image || null,
          it.canteenName || null
        );
      }
    })();

    res.json({ orderId: token, total });
  } catch (e) {
    console.error('Failed to create order', e);
    res.status(500).json({ error: 'Failed to create order' });
  }
});

const PORT = process.env.PORT || 5174;
app.listen(PORT, () => {
  console.log(`API server running on http://localhost:${PORT}`);
});
