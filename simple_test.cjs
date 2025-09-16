// Simple test using fetch (if available) or just check if server is responding
const testServer = async () => {
  try {
    // Try using fetch if available (Node 18+)
    if (typeof fetch !== 'undefined') {
      console.log('🌐 Testing API with fetch...');
      const response = await fetch('http://localhost:3000/api/canteens');
      const data = await response.json();
      console.log(`✅ API working! Found ${data.length} canteens`);
      console.log('Sample canteen:', JSON.stringify(data[0], null, 2));
    } else {
      console.log('❌ Fetch not available in this Node version');
    }
  } catch (error) {
    console.log('❌ API test failed:', error.message);
  }
};

testServer();