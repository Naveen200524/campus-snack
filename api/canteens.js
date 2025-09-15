const { initDb } = require('./db');

const toBool = (n) => (n ? true : false);

module.exports = function handler(req, res) {
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

    res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching canteens:', error);
    res.status(500).json({ error: 'Failed to fetch canteens' });
  }
}