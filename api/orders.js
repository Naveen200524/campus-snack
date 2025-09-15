const { initDb } = require('./db');

module.exports = function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const db = initDb();
    const { items, total } = req.body;

    if (!items || !total) {
      res.status(400).json({ error: 'Items and total are required' });
      return;
    }

    const orderId = `CE-${new Date().toISOString().slice(0, 10).replace(/-/g, "")}-${Math.floor(1000 + Math.random() * 9000)}`;
    const estimatedTime = Math.floor(Math.random() * (25 - 10 + 1)) + 10;
    
    const insertOrder = db.prepare('INSERT INTO orders (id, created_at, total, status, canteen_name) VALUES (?, ?, ?, ?, ?)');
    const insertItem = db.prepare('INSERT INTO order_items (id, order_id, item_id, name, quantity, price, image, canteen_name) VALUES (?, ?, ?, ?, ?, ?, ?, ?)');

    db.transaction(() => {
      insertOrder.run(orderId, new Date().toISOString(), total, 'completed', items[0].canteenName || 'Campus Canteen');
      for (const item of items) {
        insertItem.run(`${orderId}-${item.id}`, orderId, item.id, item.name, item.quantity, item.price, item.image, item.canteenName);
      }
    })();

    res.status(200).json({ orderId, estimatedTime });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ error: 'Failed to create order' });
  }
}