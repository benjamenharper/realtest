import axios from 'axios';

const REDFIN_API_KEY = import.meta.env.VITE_RAPIDAPI_KEY;
const REDFIN_API_HOST = import.meta.env.VITE_RAPIDAPI_HOST;

// Mock data for development
const mockProperties = [
  {
    propertyId: '1',
    streetAddress: '91-1000 Kamaaha Avenue',
    city: 'Kapolei',
    state: 'HI',
    zipCode: '96707',
    price: 750000,
    beds: 3,
    baths: 2,
    sqFt: 1500,
    lotSize: '5,000 sqft',
    yearBuilt: '2020',
    propertyType: 'Single Family',
    mainImageUrl: 'https://ssl.cdn-redfin.com/photo/169/mbphoto/373/genMid.PW23015373_0.jpg',
    description: 'Beautiful single family home in Kapolei',
    features: ['Central AC', 'Garage', 'Lanai'],
    latitude: 21.3469,
    longitude: -158.0500,
    status: 'SOLD',
    soldDate: '2024-12-15',
    soldPrice: 745000
  },
  {
    propertyId: '2',
    streetAddress: '92-1234 Olani Street',
    city: 'Kapolei',
    state: 'HI',
    zipCode: '96707',
    price: 850000,
    beds: 4,
    baths: 3,
    sqFt: 1800,
    lotSize: '6,000 sqft',
    yearBuilt: '2021',
    mainImageUrl: 'https://ssl.cdn-redfin.com/photo/169/mbphoto/374/genMid.PW23015374_0.jpg',
    description: 'Spacious family home with mountain views',
    features: ['Split AC', 'Double Garage', 'Solar Panels'],
    latitude: 21.3400,
    longitude: -158.0520,
    status: 'SOLD',
    soldDate: '2024-12-20',
    soldPrice: 840000
  }
];

const redfinApi = axios.create({
  baseURL: 'https://redfin-com-data.p.rapidapi.com',
  headers: {
    'X-RapidAPI-Key': REDFIN_API_KEY,
    'X-RapidAPI-Host': REDFIN_API_HOST
  }
});

export async function fetchSoldProperties(regionId = '6_2446', soldWithin = '30') {
  // Use mock data in development or if API key is not available
  if (import.meta.env.DEV || !REDFIN_API_KEY) {
    console.log('Using mock data for development');
    return { properties: mockProperties };
  }

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
    
    if (error.response?.status === 403) {
      // Fallback to mock data if API access is denied
      console.log('API access denied, using mock data');
      return { properties: mockProperties };
    }
    
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
            property.mainImageUrl ? [property.mainImageUrl] : 
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
