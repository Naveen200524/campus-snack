const Database = require('better-sqlite3');
const path = require('path');

// Create database
const dbPath = path.join(__dirname, 'campus_menu.db');
const db = new Database(dbPath);

// Initialize database with campus menu data
console.log('Setting up campus menu database...');

// Create canteens table
db.exec(`CREATE TABLE IF NOT EXISTS canteens (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  image TEXT,
  rating REAL,
  preparation_time TEXT,
  is_open INTEGER DEFAULT 1,
  total_orders INTEGER DEFAULT 0
)`);

// Create menu_items table
db.exec(`CREATE TABLE IF NOT EXISTS menu_items (
  id TEXT PRIMARY KEY,
  canteen_id INTEGER,
  name TEXT NOT NULL,
  description TEXT,
  price INTEGER,
  image TEXT,
  FOREIGN KEY (canteen_id) REFERENCES canteens (id)
)`);

// Insert canteen data
const canteens = [
  { id: 1, name: 'North Canteen', slug: 'north-canteen', description: 'Quick bites, street food, and regional specialties.', image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=60', rating: 4.2, preparation_time: '10-15 min', is_open: 1, total_orders: 1800 },
  { id: 2, name: 'South Canteen', slug: 'south-canteen', description: 'Popular meals, snacks, and beverages.', image: 'https://images.unsplash.com/photo-1567521464027-f127ff144326?w=800&auto=format&fit=crop&q=60', rating: 4.5, preparation_time: '15-20 min', is_open: 1, total_orders: 2500 },
  { id: 3, name: 'KN\'s', slug: 'kns', description: 'Fresh salads, smoothies, and healthy alternatives.', image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&auto=format&fit=crop&q=60', rating: 4.7, preparation_time: '8-12 min', is_open: 1, total_orders: 1200 },
  { id: 4, name: 'Mingos', slug: 'mingos', description: 'Pizza, burgers, Asian dishes, and more.', image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&auto=format&fit=crop&q=60', rating: 4.3, preparation_time: '20-25 min', is_open: 1, total_orders: 950 },
  { id: 5, name: 'Nandhini', slug: 'nandhini', description: 'Premium coffee, pastries, and desserts.', image: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800&auto=format&fit=crop&q=60', rating: 4.6, preparation_time: '5-10 min', is_open: 1, total_orders: 3200 },
  { id: 6, name: 'Lake View', slug: 'lake-view', description: 'Open late for night owls. Comfort food and quick meals.', image: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=800&auto=format&fit=crop&q=60', rating: 4.1, preparation_time: '12-18 min', is_open: 1, total_orders: 1650 }
];

const insertCanteen = db.prepare(`INSERT OR REPLACE INTO canteens (id, name, slug, description, image, rating, preparation_time, is_open, total_orders) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`);

canteens.forEach(canteen => {
  insertCanteen.run(canteen.id, canteen.name, canteen.slug, canteen.description, canteen.image, canteen.rating, canteen.preparation_time, canteen.is_open, canteen.total_orders);
});

// Insert menu items
const menuItems = [
  // North Canteen (1)
  { id: '1-1', canteen_id: 1, name: 'Pav Bhaji', description: 'Spicy vegetable curry served with buttered bread rolls', price: 45, image: 'https://images.unsplash.com/photo-1626132647523-66520e67b72d?w=300&auto=format&fit=crop&q=60' },
  { id: '1-2', canteen_id: 1, name: 'Vada Pav', description: 'Spiced potato fritter in a bun', price: 25, image: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=300&auto=format&fit=crop&q=60' },
  { id: '1-3', canteen_id: 1, name: 'Samosa', description: 'Crispy fried pastry with spiced potato filling', price: 15, image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=300&auto=format&fit=crop&q=60' },

  // South Canteen (2)
  { id: '2-1', canteen_id: 2, name: 'Chicken Biryani', description: 'Aromatic basmati rice with tender chicken', price: 120, image: 'https://images.unsplash.com/photo-1563379091339-03246963d25d?w=300&auto=format&fit=crop&q=60' },
  { id: '2-2', canteen_id: 2, name: 'Veg Thali', description: 'Complete meal with dal, sabzi, roti, rice, and sweet', price: 80, image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=300&auto=format&fit=crop&q=60' },
  { id: '2-3', canteen_id: 2, name: 'Masala Dosa', description: 'Crispy crepe filled with potato masala', price: 60, image: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=300&auto=format&fit=crop&q=60' },

  // KN's (3)
  { id: '3-1', canteen_id: 3, name: 'Green Salad Bowl', description: 'Crisp greens with light dressing', price: 70, image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=300&auto=format&fit=crop&q=60' },
  { id: '3-2', canteen_id: 3, name: 'Fruit Smoothie', description: 'Fresh blended seasonal fruits', price: 55, image: 'https://images.unsplash.com/photo-1505252585461-9044ba741705?w=300&auto=format&fit=crop&q=60' },
  { id: '3-3', canteen_id: 3, name: 'Grilled Chicken Salad', description: 'Healthy grilled chicken with fresh vegetables', price: 90, image: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=300&auto=format&fit=crop&q=60' },

  // Mingos (4)
  { id: '4-1', canteen_id: 4, name: 'Margherita Pizza', description: 'Fresh mozzarella and basil on thin crust', price: 150, image: 'https://images.unsplash.com/photo-1548365328-9f547fb0953a?w=300&auto=format&fit=crop&q=60' },
  { id: '4-2', canteen_id: 4, name: 'Chicken Burger', description: 'Juicy chicken patty with fresh vegetables', price: 85, image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300&auto=format&fit=crop&q=60' },
  { id: '4-3', canteen_id: 4, name: 'Spring Rolls', description: 'Crispy vegetable spring rolls with sweet chili sauce', price: 65, image: 'https://images.unsplash.com/photo-1541599468348-e96984315621?w=300&auto=format&fit=crop&q=60' },

  // Nandhini (5)
  { id: '5-1', canteen_id: 5, name: 'Cappuccino', description: 'Espresso with steamed milk and foam', price: 60, image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=300&auto=format&fit=crop&q=60' },
  { id: '5-2', canteen_id: 5, name: 'Chocolate Brownie', description: 'Rich chocolate brownie with vanilla ice cream', price: 75, image: 'https://images.unsplash.com/photo-1606312619070-d48b4c652a52?w=300&auto=format&fit=crop&q=60' },
  { id: '5-3', canteen_id: 5, name: 'Croissant', description: 'Buttery flaky pastry', price: 45, image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=300&auto=format&fit=crop&q=60' },

  // Lake View (6)
  { id: '6-1', canteen_id: 6, name: 'Grilled Sandwich', description: 'Veggies and cheese in toasted bread', price: 50, image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=300&auto=format&fit=crop&q=60' },
  { id: '6-2', canteen_id: 6, name: 'Chicken Noodles', description: 'Stir-fried noodles with chicken and vegetables', price: 70, image: 'https://images.unsplash.com/photo-1551892376-c73a4e34b229?w=300&auto=format&fit=crop&q=60' },
  { id: '6-3', canteen_id: 6, name: 'French Fries', description: 'Crispy golden fries with ketchup', price: 40, image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=300&auto=format&fit=crop&q=60' }
];

const insertMenuItem = db.prepare(`INSERT OR REPLACE INTO menu_items (id, canteen_id, name, description, price, image) VALUES (?, ?, ?, ?, ?, ?)`);

menuItems.forEach(item => {
  insertMenuItem.run(item.id, item.canteen_id, item.name, item.description, item.price, item.image);
});

console.log('✅ Database initialized with campus menu data!');
console.log('📊 Created tables: canteens, menu_items');
console.log('🍽️  Added 6 canteens with 18 menu items total');

db.close();