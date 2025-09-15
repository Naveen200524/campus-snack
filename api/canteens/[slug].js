const canteens = [
  { "id": "1", "name": "North canteen", "slug": "north-canteen", "description": "Quick bites, street food, and regional specialties.", "image": "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=60", "rating": 4.2, "preparation_time": "10-15 min", "is_open": 1, "total_orders": 1800 },
  { "id": "2", "name": "South canteen", "slug": "south-canteen", "description": "Popular meals, snacks, and beverages.", "image": "https://images.unsplash.com/photo-1567521464027-f127ff144326?w=800&auto=format&fit=crop&q=60", "rating": 4.5, "preparation_time": "15-20 min", "is_open": 1, "total_orders": 2500 },
  { "id": "3", "name": "KN's", "slug": "kns", "description": "Fresh salads, smoothies, and healthy alternatives.", "image": "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&auto=format&fit=crop&q=60", "rating": 4.7, "preparation_time": "8-12 min", "is_open": 1, "total_orders": 1200 },
  { "id": "4", "name": "Mingos", "slug": "mingos", "description": "Pizza, burgers, Asian dishes, and more.", "image": "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&auto=format&fit=crop&q=60", "rating": 4.3, "preparation_time": "20-25 min", "is_open": 1, "total_orders": 950 },
  { "id": "5", "name": "Nandhini", "slug": "nandhini", "description": "Premium coffee, pastries, and desserts.", "image": "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800&auto=format&fit=crop&q=60", "rating": 4.6, "preparation_time": "5-10 min", "is_open": 1, "total_orders": 3200 },
  { "id": "6", "name": "Lake view", "slug": "lake-view", "description": "Open late for night owls. Comfort food and quick meals.", "image": "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=800&auto=format&fit=crop&q=60", "rating": 4.1, "preparation_time": "12-18 min", "is_open": 1, "total_orders": 1650 }
];

const menus = {
  "1": [
    { "id": "1-1", "name": "Pav Bhaji", "description": "Spicy vegetable curry served with buttered bread rolls", "price": 45, "image": "https://images.unsplash.com/photo-1626132647523-66520e67b72d?w=300&auto=format&fit=crop&q=60" },
    { "id": "1-2", "name": "Vada Pav", "description": "Spiced potato fritter in a bun", "price": 25, "image": "https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=300&auto=format&fit=crop&q=60" }
  ],
  "2": [
    { "id": "2-1", "name": "Chicken Biryani", "description": "Aromatic basmati rice with chicken", "price": 120, "image": "https://images.unsplash.com/photo-1563379091339-03246963d25d?w=300&auto=format&fit=crop&q=60" },
    { "id": "2-2", "name": "Veg Thali", "description": "Dal, sabzi, roti, rice, and sweet", "price": 80, "image": "https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=300&auto=format&fit=crop&q=60" }
  ],
  "3": [{ "id": "3-1", "name": "Green Salad Bowl", "description": "Crisp greens with light dressing", "price": 70, "image": "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=300&auto=format&fit=crop&q=60" }],
  "4": [{ "id": "4-1", "name": "Margherita Pizza", "description": "Fresh mozzarella and basil", "price": 150, "image": "https://images.unsplash.com/photo-1548365328-9f547fb0953a?w=300&auto=format&fit=crop&q=60" }],
  "5": [{ "id": "5-1", "name": "Cappuccino", "description": "Espresso with steamed milk and foam", "price": 60, "image": "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=300&auto=format&fit=crop&q=60" }],
  "6": [{ "id": "6-1", "name": "Grilled Sandwich", "description": "Veggies and cheese", "price": 50, "image": "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=300&auto=format&fit=crop&q=60" }]
};

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
    const { slug } = req.query;

    if (!slug) {
      res.status(400).json({ error: 'Slug parameter required' });
      return;
    }

    const canteen = canteens.find((c) => c.slug === slug);
    if (!canteen) {
      res.status(404).json({ error: 'Canteen not found' });
      return;
    }

    const menu = menus[canteen.id] || [];

    const data = {
      canteen: {
        id: canteen.id,
        name: canteen.name,
        slug: canteen.slug,
        description: canteen.description,
        image: canteen.image,
        rating: canteen.rating,
        preparationTime: canteen.preparation_time,
        isOpen: toBool(canteen.is_open),
        totalOrders: canteen.total_orders,
      },
      menu: menu.map(item => ({
        id: item.id,
        name: item.name,
        description: item.description,
        price: item.price,
        image: item.image,
        canteenId: canteen.id,
        canteenName: canteen.name,
      })),
    };

    res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching canteen:', error);
    res.status(500).json({ error: 'Failed to fetch canteen' });
  }
}