import axios from 'axios';

const API_BASE_URL = 'http://localhost:3003/api/zillow';

// Create axios instance with default config
const zillowApi = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 second timeout
});

// Add request interceptor for logging
zillowApi.interceptors.request.use(
  (config) => {
    console.log('Making request to:', config.url);
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for better error handling
zillowApi.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.code === 'ECONNREFUSED') {
      console.error('Server connection refused. Please ensure the server is running.');
      throw new Error('Unable to connect to the server. Please ensure it is running and try again.');
    }
    
    if (!error.response) {
      console.error('Network error:', error);
      throw new Error('Network error. Please check your connection and try again.');
    }

    console.error('API error:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    });

    throw new Error(
      error.response?.data?.message || 
      error.response?.data?.error || 
      error.message || 
      'An unexpected error occurred. Please try again.'
    );
  }
);

// Property type mapping
const propertyTypeMap = {
  'SINGLE_FAMILY': 'House',
  'MULTI_FAMILY': 'Multi-Family',
  'TOWNHOUSE': 'Townhouse',
  'CONDO': 'Condo',
  'APARTMENT': 'Apartment',
  'MOBILE': 'Mobile Home',
  'LAND': 'Land',
  'OTHER': 'Other',
};

// Search properties in a location
export const searchProperties = async (location, filters = {}) => {
  try {
    // Convert our filter names to Zillow API parameter names
    const params = {
      location,
      status: filters.status || 'forSale',
      propertyType: filters.propertyType === 'all' ? undefined : filters.propertyType,
      sort: filters.sort || 'price_desc',
      page: filters.page || '1',
      minPrice: filters.minPrice,
      maxPrice: filters.maxPrice,
      minBeds: filters.minBeds,
      maxBeds: filters.maxBeds,
      minBaths: filters.minBaths,
      maxBaths: filters.maxBaths,
      minSquareFeet: filters.minSquareFeet,
      maxSquareFeet: filters.maxSquareFeet,
    };

    // Remove undefined values
    Object.keys(params).forEach(key => params[key] === undefined && delete params[key]);

    // Build query string
    const queryString = new URLSearchParams(params).toString();
    
    const response = await zillowApi.get(`/search?${queryString}`);
    
    if (!response.data || !response.data.properties) {
      throw new Error('Invalid response format from API');
    }

    // Map the Zillow API response to our format
    const properties = response.data.properties.map(property => {
      // Handle image data
      let photos = [];
      if (property.photos && Array.isArray(property.photos)) {
        photos = property.photos;
      } else if (property.imgSrc) {
        photos = [property.imgSrc];
      }

      return {
        id: property.id,
        address: property.address || {
          streetAddress: property.streetAddress,
          city: property.city,
          state: property.state,
          zipcode: property.zipcode,
        },
        price: property.price,
        bedrooms: property.bedrooms,
        bathrooms: property.bathrooms,
        squareFootage: property.squareFootage || property.livingArea,
        propertyType: propertyTypeMap[property.propertyType] || 'Other',
        yearBuilt: property.yearBuilt,
        description: property.description,
        photos: photos,
        listingStatus: property.listingStatus,
        zestimate: property.zestimate,
        rentZestimate: property.rentZestimate,
        daysOnZillow: property.daysOnZillow,
        latitude: property.latitude,
        longitude: property.longitude,
        parkingSpaces: property.parkingSpaces,
      };
    });

    return {
      properties,
      totalResults: response.data.totalResults || response.data.totalResultCount,
      pagination: {
        currentPage: response.data.currentPage || 1,
        totalPages: Math.ceil((response.data.totalResults || response.data.totalResultCount) / properties.length) || 1,
      },
    };
  } catch (error) {
    console.error('Property search error:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
    });

    throw error; // Let the interceptor handle the error
  }
};

// Get property images
export const getPropertyImages = async (zpid) => {
  try {
    console.log('Getting property images:', zpid);
    const response = await zillowApi.get(`/property/${zpid}/images`);

    if (!response.data) {
      throw new Error('Invalid response format from API');
    }

    return {
      images: response.data.images || [],
      totalImages: response.data.totalImages || 0,
    };
  } catch (error) {
    console.error('Property images error:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
    });

    throw error; // Let the interceptor handle the error
  }
};

// Get property details
export const getPropertyDetails = async (zpid) => {
  try {
    console.log('Getting property details:', zpid);
    const response = await zillowApi.get(`/property/${zpid}`);

    if (!response.data) {
      throw new Error('Invalid response format from API');
    }

    // Handle image data
    let photos = [];
    if (response.data.photos && Array.isArray(response.data.photos)) {
      photos = response.data.photos;
    } else if (response.data.imgSrc) {
      photos = [response.data.imgSrc];
    }

    return {
      ...response.data,
      photos: photos,
      squareFootage: response.data.squareFootage || response.data.livingArea,
    };
  } catch (error) {
    console.error('Property details error:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
    });

    throw error; // Let the interceptor handle the error
  }
};

// Search properties by coordinates (useful for map view)
export const searchPropertiesByCoordinates = async (latitude, longitude, filters = {}) => {
  try {
    console.log('Searching properties by coordinates:', { latitude, longitude, filters });
    const response = await zillowApi.get('/searchByCoordinates', {
      params: {
        latitude,
        longitude,
        ...filters,
      },
    });

    if (!response.data || !response.data.properties) {
      throw new Error('Invalid response format from API');
    }

    return response.data;
  } catch (error) {
    console.error('Property search by coordinates error:', error);
    throw error; // Let the interceptor handle the error
  }
};

// Get similar properties
export const getSimilarProperties = async (zpid) => {
  try {
    console.log('Getting similar properties:', zpid);
    const response = await zillowApi.get(`/property/${zpid}/similar`);

    if (!response.data || !response.data.properties) {
      throw new Error('Invalid response format from API');
    }

    return response.data;
  } catch (error) {
    console.error('Similar properties error:', error);
    throw error; // Let the interceptor handle the error
  }
};
