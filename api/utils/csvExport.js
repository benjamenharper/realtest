import { createObjectCsvWriter } from 'csv-writer';
import path from 'path';
import slugify from 'slugify';

export const generatePropertySlug = (property) => {
  const address = property.address?.streetAddress || '';
  const city = property.address?.city || '';
  const state = property.address?.state || '';
  const price = property.price ? `${property.price}` : '';
  const beds = property.bedrooms ? `${property.bedrooms}-bed` : '';
  const baths = property.bathrooms ? `${property.bathrooms}-bath` : '';

  const slugParts = [address, city, state, beds, baths, price]
    .filter(part => part)
    .join('-');

  return slugify(slugParts, {
    lower: true,
    strict: true,
    trim: true
  });
};

export const exportPropertiesToCsv = async (properties) => {
  const csvWriter = createObjectCsvWriter({
    path: path.join(process.cwd(), 'data', 'properties.csv'),
    header: [
      { id: 'id', title: 'ID' },
      { id: 'slug', title: 'Slug' },
      { id: 'price', title: 'Price' },
      { id: 'bedrooms', title: 'Bedrooms' },
      { id: 'bathrooms', title: 'Bathrooms' },
      { id: 'squareFootage', title: 'Square Footage' },
      { id: 'propertyType', title: 'Property Type' },
      { id: 'yearBuilt', title: 'Year Built' },
      { id: 'streetAddress', title: 'Street Address' },
      { id: 'city', title: 'City' },
      { id: 'state', title: 'State' },
      { id: 'zipcode', title: 'Zipcode' },
      { id: 'latitude', title: 'Latitude' },
      { id: 'longitude', title: 'Longitude' },
      { id: 'listingStatus', title: 'Listing Status' },
      { id: 'mainImage', title: 'Main Image' }
    ]
  });

  const records = properties.map(prop => ({
    id: prop.id,
    slug: generatePropertySlug(prop),
    price: prop.price,
    bedrooms: prop.bedrooms,
    bathrooms: prop.bathrooms,
    squareFootage: prop.squareFootage,
    propertyType: prop.propertyType,
    yearBuilt: prop.yearBuilt,
    streetAddress: prop.address?.streetAddress,
    city: prop.address?.city,
    state: prop.address?.state,
    zipcode: prop.address?.zipcode,
    latitude: prop.latitude,
    longitude: prop.longitude,
    listingStatus: prop.listingStatus,
    mainImage: prop.photos?.[0] || prop.imgSrc
  }));

  try {
    await csvWriter.writeRecords(records);
    console.log('CSV file written successfully');
    return records;
  } catch (error) {
    console.error('Error writing CSV:', error);
    throw error;
  }
};
