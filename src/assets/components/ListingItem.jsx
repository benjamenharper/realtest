/* eslint-disable react/prop-types */
import { Link } from 'react-router-dom';
import { FaBed, FaBath, FaRuler, FaHome } from 'react-icons/fa';
import { useState } from 'react';

export default function ListingItem({ listing }) {
  const [imageError, setImageError] = useState(false);

  const formatPrice = (price) => {
    if (!price) return 'Price not available';
    return price.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    });
  };

  const formatSquareFeet = (sqft) => {
    if (!sqft) return 'N/A';
    return sqft.toLocaleString();
  };

  const formatPropertyType = (type) => {
    if (!type) return 'Property';
    // Convert SINGLE_FAMILY to "Single Family Home", etc.
    return type
      .split('_')
      .map(word => word.charAt(0) + word.slice(1).toLowerCase())
      .join(' ');
  };

  const getMainImage = () => {
    if (imageError) {
      return 'https://via.placeholder.com/800x600?text=No+Image+Available';
    }
    if (listing.photos && listing.photos.length > 0) {
      return listing.photos[0];
    }
    if (listing.imgSrc) {
      return listing.imgSrc;
    }
    return 'https://via.placeholder.com/800x600?text=No+Image+Available';
  };

  const handleImageError = () => {
    console.log('Image failed to load:', getMainImage());
    setImageError(true);
  };

  return (
    <div className='bg-white shadow-md hover:shadow-lg transition-shadow overflow-hidden rounded-lg w-full'>
      <Link to={`/property/${listing.slug || listing.id}`}>
        <div className="relative">
          <img
            src={getMainImage()}
            alt="Property"
            className='h-[240px] w-full object-cover hover:scale-105 transition-scale duration-300'
            onError={handleImageError}
          />
          {listing.listingStatus && (
            <div className="absolute top-2 right-2 bg-blue-500 text-white px-2 py-1 rounded-md text-sm">
              {listing.listingStatus}
            </div>
          )}
        </div>
        <div className='p-4 flex flex-col gap-3'>
          <div className='flex items-center gap-2 text-sm text-gray-600'>
            <FaHome className='text-lg' />
            <span>{formatPropertyType(listing.propertyType)}</span>
          </div>
          <p className='text-xl font-semibold text-slate-700'>
            {formatPrice(listing.price)}
            {listing.listingStatus === 'forRent' && <span className="text-sm font-normal"> / month</span>}
          </p>
          <div className='flex gap-6 items-center'>
            <div className='flex items-center gap-1'>
              <FaBed className='text-lg' />
              <p className='text-sm'>
                {listing.bedrooms || 'N/A'} {listing.bedrooms === 1 ? 'bed' : 'beds'}
              </p>
            </div>
            <div className='flex items-center gap-1'>
              <FaBath className='text-lg' />
              <p className='text-sm'>
                {listing.bathrooms || 'N/A'} {listing.bathrooms === 1 ? 'bath' : 'baths'}
              </p>
            </div>
            <div className='flex items-center gap-1'>
              <FaRuler className='text-lg' />
              <p className='text-sm'>
                {formatSquareFeet(listing.squareFootage)} sqft
              </p>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
