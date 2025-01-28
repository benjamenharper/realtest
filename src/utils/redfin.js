import axios from 'axios';

const REDFIN_API_KEY = '72b25b9609mshf22de8083b9ef4bp18d5b9jsn2b059ddfdc06';
const REDFIN_API_HOST = 'redfin-com-data.p.rapidapi.com';

const redfinApi = axios.create({
  baseURL: 'https://redfin-com-data.p.rapidapi.com',
  headers: {
    'X-RapidAPI-Key': REDFIN_API_KEY,
    'X-RapidAPI-Host': REDFIN_API_HOST
  }
});

export async function fetchSoldProperties(regionId = '6_2446', soldWithin = '30') {
  try {
    console.log('Fetching sold properties...');
    const response = await redfinApi.get('/properties/search-sold', {
      params: {
        regionId,
        soldWithin
      }
    });
    
    console.log('API Response:', response.data);
    
    if (!response.data || !Array.isArray(response.data.properties)) {
      console.error('Invalid response format:', response.data);
      throw new Error('Invalid response format from Redfin API');
    }
    
    return {
      properties: response.data.properties.map(property => ({
        propertyId: property.id || property.propertyId,
        streetAddress: property.address || '',
        city: property.city || '',
        state: property.state || 'HI',
        zipcode: property.zipCode || '',
        price: property.price || 0,
        beds: property.beds || 0,
        baths: property.baths || 0,
        sqft: property.sqFt || 0,
        lotSize: property.lotSize || '',
        yearBuilt: property.yearBuilt || '',
        propertyType: property.propertyType || '',
        photos: property.photos || [property.mainImageUrl].filter(Boolean),
        description: property.description || '',
        features: property.features || [],
        latitude: property.latitude || null,
        longitude: property.longitude || null,
        status: 'SOLD',
        lastSoldDate: property.soldDate || null,
        soldPrice: property.soldPrice || property.price || 0
      }))
    };
  } catch (error) {
    console.error('Error fetching sold properties:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
    throw error;
  }
}

export async function fetchPropertyDetails(propertyId) {
  try {
    const response = await redfinApi.get('/properties/detail', {
      params: {
        propertyId
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching property details:', error);
    throw error;
  }
}

// Process property data into a consistent format
export function processPropertyData(property) {
  return {
    id: property.propertyId || '',
    address: {
      street: property.streetAddress || '',
      city: property.city || '',
      state: property.state || 'HI',
      zipcode: property.zipcode || '',
      full: `${property.streetAddress || ''}, ${property.city || ''}, ${property.state || 'HI'} ${property.zipcode || ''}`
    },
    price: {
      current: property.price || 0,
      original: property.originalPrice || property.price || 0,
      sold: property.soldPrice || property.price || 0
    },
    details: {
      beds: property.beds || 0,
      baths: property.baths || 0,
      sqft: property.sqft || 0,
      lotSize: property.lotSize || '',
      yearBuilt: property.yearBuilt || '',
      propertyType: property.propertyType || ''
    },
    images: Array.isArray(property.photos) ? property.photos : 
            property.photos ? [property.photos] : 
            ['https://via.placeholder.com/800x600.png?text=No+Image+Available'],
    description: property.description || '',
    features: Array.isArray(property.features) ? property.features : [],
    location: {
      lat: property.latitude || null,
      lng: property.longitude || null
    },
    status: property.status || 'SOLD',
    daysOnMarket: property.daysOnMarket || 0,
    lastSold: property.lastSoldDate || null
  };
}
