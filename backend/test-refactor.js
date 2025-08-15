// Simple test script to verify the refactored backend
const axios = require('axios');

const BASE_URL = 'http://localhost:5001';

async function testBackend() {
  console.log('🧪 Testing refactored Routeshare backend...\n');

  try {
    // Test health endpoint
    console.log('1. Testing health endpoint...');
    const healthResponse = await axios.get(`${BASE_URL}/health`);
    console.log('✅ Health check passed:', healthResponse.data);

    // Test overlay templates endpoint
    console.log('\n2. Testing overlay templates endpoint...');
    const templatesResponse = await axios.get(`${BASE_URL}/api/overlay/templates`);
    console.log('✅ Templates endpoint passed:', templatesResponse.data.templates.length, 'templates found');

    console.log('\n🎉 All tests passed! The refactored backend is working correctly.');
  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
}

// Run the test
testBackend();
