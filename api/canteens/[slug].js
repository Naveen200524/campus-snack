const { initDb } = require('./db');

const toBool = (n) => (n ? true : false);

export default function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const db = initDb();
    const { slug } = req.query;

    if (!slug) {
      res.status(400).json({ error: 'Slug parameter required' });
      return;
    }

    const c = db.prepare('SELECT * FROM canteens WHERE slug = ?').get(slug);
    if (!c) {
      res.status(404).json({ error: 'Canteen not found' });
      return;
    }

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
      menu,
    };

    res.status(200).json(canteen);
  } catch (error) {
    console.error('Error fetching canteen:', error);
    res.status(500).json({ error: 'Failed to fetch canteen' });
  }
}