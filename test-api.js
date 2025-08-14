const fetch = require('node-fetch');

async function testAPI() {
  console.log('🧪 Testing ECQ Video to MP3 API...\n');

  const testUrl = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'; // Rick Roll for testing

  try {
    console.log('Testing API endpoint...');
    
    const response = await fetch('http://localhost:3000/convert', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url: testUrl,
        quality: 'lowestaudio' // Use lowest quality for faster testing
      })
    });

    const data = await response.json();

    if (response.ok) {
      console.log('✅ API test successful!');
      console.log('Response:', JSON.stringify(data, null, 2));
    } else {
      console.log('❌ API test failed!');
      console.log('Status:', response.status);
      console.log('Error:', data);
    }

  } catch (error) {
    console.log('❌ API test failed with error:', error.message);
    console.log('Make sure the server is running on http://localhost:3000');
  }
}

// Run the test
testAPI();
