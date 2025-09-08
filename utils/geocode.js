const axios = require('axios');

// Replace with your MapTiler API key
const MAPTILER_API_KEY = process.env.MAP_API_KEY;

async function getCoordinates(location) {
    try {
        const response = await axios.get(`https://api.maptiler.com/geocoding/${encodeURIComponent(location)}.json`, {
            params: {
                key: MAPTILER_API_KEY
            }
        });

        const coordinates = response.data.features[0]?.geometry?.coordinates;
        if (coordinates) {
            return {
                lat: coordinates[1],  // Latitude
                lng: coordinates[0]   // Longitude
            };
        } else {
            throw new Error('No coordinates found');
        }
    } catch (error) {
        console.error('Geocoding error:', error);
        throw new Error('Failed to get coordinates');
    }
}

module.exports = { getCoordinates };