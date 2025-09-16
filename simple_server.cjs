const express = require('express');
const cors = require('cors');
const Database = require('better-sqlite3');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS for all routes
app.use(cors());
app.use(express.json());

// Connect to SQLite database
const dbPath = path.join(__dirname, 'campus_menu.db');
let db;
try {
  db = new Database(dbPath);
  console.log('✅ Database connected successfully');
} catch (error) {
  console.error('❌ Database connection failed:', error);
  process.exit(1);
}

// API Routes

// Get all canteens
app.get('/api/canteens', (req, res) => {
  console.log('📡 Received request for /api/canteens');
  try {
    const stmt = db.prepare(`
      SELECT id, name, slug, description, image, rating, preparation_time, is_open, total_orders
      FROM canteens
      ORDER BY rating DESC
    `);
    const canteens = stmt.all();
    console.log(`📊 Found ${canteens.length} canteens in database`);

    // Convert data types
    const formattedCanteens = canteens.map(canteen => ({
      id: canteen.id,
      name: canteen.name,
      slug: canteen.slug,
      description: canteen.description,
      image: canteen.image,
      rating: canteen.rating,
      preparationTime: canteen.preparation_time,
      isOpen: canteen.is_open === 1,
      totalOrders: canteen.total_orders
    }));

    console.log('✅ Sending canteens data');
    res.json(formattedCanteens);
  } catch (error) {
    console.error('❌ Error fetching canteens:', error);
    res.status(500).json({ error: 'Failed to fetch canteens', details: error.message });
  }
});

// Get specific canteen with menu
app.get('/api/canteens/:slug', (req, res) => {
  try {
    const { slug } = req.params;

    // Get canteen info
    const canteenStmt = db.prepare(`
      SELECT id, name, slug, description, image, rating, preparation_time, is_open, total_orders
      FROM canteens
      WHERE slug = ?
    `);
    const canteen = canteenStmt.get(slug);

    if (!canteen) {
      return res.status(404).json({ error: 'Canteen not found' });
    }

    // Get menu items for this canteen
    const menuStmt = db.prepare(`
      SELECT id, name, description, price, image
      FROM menu_items
      WHERE canteen_id = ?
      ORDER BY name
    `);
    const menuItems = menuStmt.all(canteen.id);

    const response = {
      canteen: {
        id: canteen.id,
        name: canteen.name,
        slug: canteen.slug,
        description: canteen.description,
        image: canteen.image,
        rating: canteen.rating,
        preparationTime: canteen.preparation_time,
        isOpen: canteen.is_open === 1,
        totalOrders: canteen.total_orders
      },
      menu: menuItems
    };

    res.json(response);
  } catch (error) {
    console.error('Error fetching canteen:', error);
    res.status(500).json({ error: 'Failed to fetch canteen' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Campus Menu API is running' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Campus Menu API server running on http://localhost:${PORT}`);
  console.log(`📊 Database: ${dbPath}`);
  console.log(`🍽️  Ready to serve campus menu data!`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('Shutting down server...');
  db.close();
  process.exit(0);
});