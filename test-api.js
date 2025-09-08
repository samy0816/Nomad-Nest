const axios = require('axios');

async function testItineraryAPI() {
    try {
        console.log('Testing API endpoint...');
    const response = await axios.post('https://nomad-nest-dzm5.onrender.com/api/generate-itinerary', {
            location: 'Paris',
            country: 'France',
            budget: 'moderate',
            days: '3',
            preferences: ['culture', 'food'],
            listingTitle: 'Beautiful Paris Apartment'
        }, {
            timeout: 10000
        });

        console.log('API Response Status:', response.status);
        console.log('API Response:', JSON.stringify(response.data, null, 2));
    } catch (error) {
        console.error('Test failed with error:', error.message);
        if (error.code) {
            console.error('Error code:', error.code);
        }
        if (error.response) {
            console.error('Response status:', error.response.status);
            console.error('Response data:', JSON.stringify(error.response.data, null, 2));
        } else if (error.request) {
            console.error('No response received. Request details:', error.request.path);
        }
    }
}

testItineraryAPI();
