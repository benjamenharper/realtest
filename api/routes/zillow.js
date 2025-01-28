import express from 'express';
import axios from 'axios';
import dotenv from 'dotenv';
import { exportPropertiesToCsv, generatePropertySlug } from '../utils/csvExport.js';
import fs from 'fs';
import path from 'path';

dotenv.config();

const router = express.Router();
const ZILLOW_API_KEY = process.env.ZILLOW_API_KEY;
const ZILLOW_API_HOST = process.env.ZILLOW_API_HOST;

// Ensure data directory exists
const dataDir = path.join(process.cwd(), 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir);
}

// Configure axios for Zillow API
const zillowApi = axios.create({
  baseURL: 'https://zillow69.p.rapidapi.com',
  headers: {
    'X-RapidAPI-Key': ZILLOW_API_KEY,
    'X-RapidAPI-Host': ZILLOW_API_HOST,
  },
});

// Test endpoint
router.get('/test', async (req, res) => {
  try {
    res.json({
      message: 'Zillow API route is working',
      apiKey: ZILLOW_API_KEY ? 'Present' : 'Missing',
      apiHost: ZILLOW_API_HOST ? 'Present' : 'Missing',
    });
  } catch (error) {
    console.error('Test endpoint error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error.message,
    });
  }
});

// Get property images
router.get('/property/:zpid/images', async (req, res) => {
  try {
    console.log('Getting property images:', req.params);

    const { zpid } = req.params;
    if (!zpid) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Property ID (zpid) is required',
      });
    }

    const response = await zillowApi.get('/images', {
      params: { zpid },
    });

    console.log('Zillow API images response:', response.data);

    res.json({
      images: response.data.images || [],
      totalImages: response.data.images?.length || 0,
    });

  } catch (error) {
    console.error('Property images error:', error.response?.data || error);
    res.status(error.response?.status || 500).json({
      error: 'Failed to fetch property images',
      message: error.response?.data?.message || error.message,
    });
  }
});

// Search properties
router.get('/search', async (req, res) => {
  try {
    console.log('Search request:', req.query);

    const { location, status = 'forSale', ...filters } = req.query;
    if (!location) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Location is required',
      });
    }

    // Map our status values to Zillow API values
    const statusMap = {
      'for_sale': 'forSale',
      'for_rent': 'forRent',
      'recently_sold': 'recentlySold',
      'forSale': 'forSale',
      'forRent': 'forRent',
      'recentlySold': 'recentlySold',
    };

    // Map our filters to Zillow API parameters
    const params = {
      location,
      status: statusMap[status] || 'forSale',
      propertyType: filters.propertyType === 'all' ? undefined : filters.propertyType,
      page: filters.page || '1',
      sort: filters.sort || 'price_desc',
      minPrice: filters.minPrice,
      maxPrice: filters.maxPrice,
      minBeds: filters.minBeds,
      maxBeds: filters.maxBeds,
      minBaths: filters.minBaths,
      maxBaths: filters.maxBaths,
      minSquareFeet: filters.minSquareFeet,
      maxSquareFeet: filters.maxSquareFeet,
    };

    // Clean undefined values
    Object.keys(params).forEach(key => params[key] === undefined && delete params[key]);

    console.log('Zillow API request params:', params);

    const response = await zillowApi.get('/propertyExtendedSearch', { params });
    console.log('Zillow API response:', response.data);

    // Map Zillow response to our format and filter by property type if specified
    const properties = response.data.props
      .filter(prop => {
        // If no property type filter or it's 'all', include all properties
        if (!filters.propertyType || filters.propertyType === 'all') return true;
        
        // Normalize property types for comparison
        const normalizedRequestType = filters.propertyType.toUpperCase();
        const normalizedPropType = prop.propertyType?.toUpperCase();
        
        console.log('Property type comparison:', {
          requested: normalizedRequestType,
          actual: normalizedPropType,
          propertyId: prop.zpid,
          address: prop.streetAddress
        });
        
        return normalizedPropType === normalizedRequestType;
      })
      .map(prop => ({
        id: prop.zpid,
        address: {
          streetAddress: prop.streetAddress,
          city: prop.city,
          state: prop.state,
          zipcode: prop.zipcode,
        },
        price: prop.price,
        bedrooms: prop.bedrooms,
        bathrooms: prop.bathrooms,
        squareFootage: prop.livingArea,
        propertyType: prop.propertyType,
        yearBuilt: prop.yearBuilt,
        description: prop.description,
        photos: prop.hasImage ? [prop.imgSrc] : [],
        listingStatus: prop.listingStatus,
        zestimate: prop.zestimate,
        rentZestimate: prop.rentZestimate,
        daysOnZillow: prop.daysOnZillow,
        latitude: prop.latitude,
        longitude: prop.longitude,
        slug: generatePropertySlug({
          address: {
            streetAddress: prop.streetAddress,
            city: prop.city,
            state: prop.state
          },
          price: prop.price,
          bedrooms: prop.bedrooms,
          bathrooms: prop.bathrooms
        })
      }));

    // Export properties to CSV
    await exportPropertiesToCsv(properties);

    res.json({
      properties,
      totalResults: properties.length,
      currentPage: parseInt(params.page),
      resultsPerPage: properties.length,
    });

  } catch (error) {
    console.error('Property search error:', error.response?.data || error);
    res.status(error.response?.status || 500).json({
      error: 'Search failed',
      message: error.response?.data?.message || error.message,
    });
  }
});

// Get property details
router.get('/property/:zpid', async (req, res) => {
  try {
    console.log('Property details request:', req.params);

    const { zpid } = req.params;
    if (!zpid) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Property ID (zpid) is required',
      });
    }

    const [propertyResponse, imagesResponse] = await Promise.all([
      zillowApi.get('/property', { params: { zpid } }),
      zillowApi.get('/images', { params: { zpid } }),
    ]);

    console.log('Zillow API property response:', propertyResponse.data);
    console.log('Zillow API images response:', imagesResponse.data);

    // Map Zillow response to our format
    const property = {
      id: propertyResponse.data.zpid,
      address: {
        streetAddress: propertyResponse.data.streetAddress,
        city: propertyResponse.data.city,
        state: propertyResponse.data.state,
        zipcode: propertyResponse.data.zipcode,
      },
      price: propertyResponse.data.price,
      bedrooms: propertyResponse.data.bedrooms,
      bathrooms: propertyResponse.data.bathrooms,
      squareFootage: propertyResponse.data.livingArea,
      propertyType: propertyResponse.data.propertyType,
      yearBuilt: propertyResponse.data.yearBuilt,
      description: propertyResponse.data.description,
      photos: imagesResponse.data.images || [propertyResponse.data.imgSrc],
      listingStatus: propertyResponse.data.listingStatus,
      zestimate: propertyResponse.data.zestimate,
      rentZestimate: propertyResponse.data.rentZestimate,
      daysOnZillow: propertyResponse.data.daysOnZillow,
      latitude: propertyResponse.data.latitude,
      longitude: propertyResponse.data.longitude,
      // Additional details
      lotSize: propertyResponse.data.lotSize,
      parkingSpaces: propertyResponse.data.parkingSpaces,
      homeType: propertyResponse.data.homeType,
      homeStatus: propertyResponse.data.homeStatus,
      taxAssessedValue: propertyResponse.data.taxAssessedValue,
      features: propertyResponse.data.features || [],
      schools: propertyResponse.data.schools || [],
      nearbyHomes: propertyResponse.data.nearbyHomes || [],
    };

    res.json(property);

  } catch (error) {
    console.error('Property details error:', error.response?.data || error);
    res.status(error.response?.status || 500).json({
      error: 'Failed to fetch property details',
      message: error.response?.data?.message || error.message,
    });
  }
});

// Helper function to sort properties
function sortProperties(properties, sort) {
  switch (sort) {
    case 'price_asc':
      return properties.sort((a, b) => a.price - b.price);
    case 'price_desc':
      return properties.sort((a, b) => b.price - a.price);
    case 'bedrooms_asc':
      return properties.sort((a, b) => a.bedrooms - b.bedrooms);
    case 'bedrooms_desc':
      return properties.sort((a, b) => b.bedrooms - a.bedrooms);
    case 'bathrooms_asc':
      return properties.sort((a, b) => a.bathrooms - b.bathrooms);
    case 'bathrooms_desc':
      return properties.sort((a, b) => b.bathrooms - a.bathrooms);
    case 'squareFeet_asc':
      return properties.sort((a, b) => a.squareFootage - b.squareFootage);
    case 'squareFeet_desc':
      return properties.sort((a, b) => b.squareFootage - a.squareFootage);
    default:
      return properties;
  }
}

export default router;
