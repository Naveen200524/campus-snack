// Simple test script to verify API is working
const http = require('http');

const testAPI = () => {
  const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/api/canteens',
    method: 'GET'
  };

  const req = http.request(options, (res) => {
    console.log(`Status: ${res.statusCode}`);
    console.log(`Headers:`, res.headers);

    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });

    res.on('end', () => {
      try {
        const canteens = JSON.parse(data);
        console.log(`✅ API working! Found ${canteens.length} canteens`);
        console.log('Sample canteen:', canteens[0]);
      } catch (e) {
        console.log('❌ Error parsing JSON:', e.message);
        console.log('Raw response:', data);
      }
    });
  });

  req.on('error', (e) => {
    console.error(`❌ API test failed: ${e.message}`);
  });

  req.end();
};

// Run test after a short delay to ensure server is ready
setTimeout(testAPI, 1000);