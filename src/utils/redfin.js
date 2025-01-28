import axios from 'axios';

const REDFIN_API_KEY = '72b25b9609mshf22de8083b9ef4bp18d5b9jsn2b059ddfdc06';
const REDFIN_API_HOST = 'redfin-com-data.p.rapidapi.com';

const redfinApi = axios.create({
  baseURL: 'https://redfin-com-data.p.rapidapi.com',
  headers: {
    'x-rapidapi-key': REDFIN_API_KEY,
    'x-rapidapi-host': REDFIN_API_HOST
  }
});

export async function fetchSoldProperties(regionId = '6_2446', soldWithin = '30') {
  try {
    const response = await redfinApi.get('/properties/search-sold', {
      params: {
        regionId,
        soldWithin
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching sold properties:', error);
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
    id: property.propertyId || property.id,
    address: {
      street: property.streetAddress || '',
      city: property.city || '',
      state: property.state || 'HI',
      zipcode: property.zipcode || '',
      full: `${property.streetAddress}, ${property.city}, ${property.state} ${property.zipcode}`
    },
    price: {
      current: property.price || 0,
      original: property.originalPrice || property.price || 0,
      sold: property.soldPrice || null
    },
    details: {
      beds: property.beds || 0,
      baths: property.baths || 0,
      sqft: property.sqft || 0,
      lotSize: property.lotSize || '',
      yearBuilt: property.yearBuilt || '',
      propertyType: property.propertyType || ''
    },
    images: property.photos || [],
    description: property.description || '',
    features: property.features || [],
    location: {
      lat: property.latitude || null,
      lng: property.longitude || null
    },
    status: property.status || 'active',
    daysOnMarket: property.daysOnMarket || 0,
    lastSold: property.lastSoldDate || null
  };
}
