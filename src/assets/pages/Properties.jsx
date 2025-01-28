import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { FaBed, FaBath, FaRuler, FaMapMarkerAlt, FaChevronUp, FaChevronDown } from 'react-icons/fa';
import { searchProperties } from '../../utils/zillow';

export default function Properties() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    island: '',
    propertyType: '',
    minPrice: '',
    maxPrice: '',
    beds: '',
    baths: '',
    status: 'for_sale', // Default to for sale
  });
  const [showMoreFilters, setShowMoreFilters] = useState(false);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        setError(null);

        // Convert island to city for Zillow API
        const locationMap = {
          'oahu': 'Honolulu, Hawaii',
          'maui': 'Kahului, Hawaii',
          'big_island': 'Hilo, Hawaii',
          'kauai': 'Lihue, Hawaii',
        };
        
        const location = filters.island ? locationMap[filters.island] : 'Honolulu, Hawaii';
        console.log('Searching in location:', location);
        
        const data = await searchProperties(location, filters);
        setProperties(data?.properties || []); // Ensure properties is always an array
      } catch (err) {
        console.error('Error fetching properties:', err);
        setError(err.message || 'Failed to load properties');
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, [filters]);

  const handleFilterChange = (name, value) => {
    const newFilters = { ...filters, [name]: value };
    setFilters(newFilters);
    
    // Update URL params
    const params = new URLSearchParams();
    Object.entries(newFilters).forEach(([key, val]) => {
      if (val) params.set(key, val);
    });
    setSearchParams(params);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Primary Filters */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Island Selection */}
          <div>
            <label htmlFor="island" className="block text-sm font-medium text-gray-700 mb-1">
              Island
            </label>
            <select
              id="island"
              name="island"
              value={filters.island}
              onChange={(e) => handleFilterChange('island', e.target.value)}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="">All Islands</option>
              <option value="oahu">Oahu</option>
              <option value="maui">Maui</option>
              <option value="big_island">Big Island</option>
              <option value="kauai">Kauai</option>
            </select>
          </div>

          {/* Property Type */}
          <div>
            <label htmlFor="propertyType" className="block text-sm font-medium text-gray-700 mb-1">
              Property Type
            </label>
            <select
              id="propertyType"
              name="propertyType"
              value={filters.propertyType}
              onChange={(e) => handleFilterChange('propertyType', e.target.value)}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="">All Types</option>
              <option value="SINGLE_FAMILY">Single Family</option>
              <option value="CONDO">Condo</option>
              <option value="TOWNHOUSE">Townhouse</option>
              <option value="MULTI_FAMILY">Multi-Family</option>
              <option value="LAND">Land</option>
            </select>
          </div>

          {/* Price Range */}
          <div>
            <label htmlFor="minPrice" className="block text-sm font-medium text-gray-700 mb-1">
              Min Price
            </label>
            <select
              id="minPrice"
              name="minPrice"
              value={filters.minPrice}
              onChange={(e) => handleFilterChange('minPrice', e.target.value)}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="">No Min</option>
              <option value="500000">$500k</option>
              <option value="750000">$750k</option>
              <option value="1000000">$1M</option>
              <option value="1500000">$1.5M</option>
              <option value="2000000">$2M</option>
              <option value="3000000">$3M+</option>
            </select>
          </div>

          <div>
            <label htmlFor="maxPrice" className="block text-sm font-medium text-gray-700 mb-1">
              Max Price
            </label>
            <select
              id="maxPrice"
              name="maxPrice"
              value={filters.maxPrice}
              onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="">No Max</option>
              <option value="750000">$750k</option>
              <option value="1000000">$1M</option>
              <option value="1500000">$1.5M</option>
              <option value="2000000">$2M</option>
              <option value="3000000">$3M</option>
              <option value="5000000">$5M+</option>
            </select>
          </div>
        </div>

        {/* More Filters Button */}
        <div className="mt-4 flex items-center justify-between">
          <button
            type="button"
            onClick={() => setShowMoreFilters(!showMoreFilters)}
            className="text-sm text-blue-600 hover:text-blue-500 flex items-center"
          >
            {showMoreFilters ? (
              <>
                <FaChevronUp className="h-5 w-5 mr-1" />
                Less Filters
              </>
            ) : (
              <>
                <FaChevronDown className="h-5 w-5 mr-1" />
                More Filters
              </>
            )}
          </button>

          {/* Secondary Filter for Sold Properties */}
          <div className="flex items-center space-x-2">
            <label className="text-sm text-gray-500">Include Sold Properties</label>
            <button
              type="button"
              onClick={() => setFilters(prev => ({
                ...prev,
                status: prev.status === 'for_sale' ? 'sold' : 'for_sale'
              }))}
              className={`
                relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent 
                transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                ${filters.status === 'sold' ? 'bg-gray-400' : 'bg-gray-200'}
              `}
            >
              <span className="sr-only">Include sold properties</span>
              <span
                className={`
                  pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 
                  transition duration-200 ease-in-out
                  ${filters.status === 'sold' ? 'translate-x-5' : 'translate-x-0'}
                `}
              />
            </button>
          </div>
        </div>

        {/* Additional Filters */}
        {showMoreFilters && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4 pt-4 border-t border-gray-200">
            {/* Beds */}
            <div>
              <label htmlFor="beds" className="block text-sm font-medium text-gray-700 mb-1">
                Minimum Beds
              </label>
              <select
                id="beds"
                name="beds"
                value={filters.beds}
                onChange={(e) => handleFilterChange('beds', e.target.value)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="">Any</option>
                <option value="1">1+</option>
                <option value="2">2+</option>
                <option value="3">3+</option>
                <option value="4">4+</option>
                <option value="5">5+</option>
              </select>
            </div>

            {/* Baths */}
            <div>
              <label htmlFor="baths" className="block text-sm font-medium text-gray-700 mb-1">
                Minimum Baths
              </label>
              <select
                id="baths"
                name="baths"
                value={filters.baths}
                onChange={(e) => handleFilterChange('baths', e.target.value)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="">Any</option>
                <option value="1">1+</option>
                <option value="2">2+</option>
                <option value="3">3+</option>
                <option value="4">4+</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Properties Grid */}
      {loading ? (
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : error ? (
        <div className="text-center py-8">
          <div className="text-red-600 mb-2">{error}</div>
          <div className="text-gray-600 text-sm">
            Please try adjusting your search criteria or try again later
          </div>
        </div>
      ) : properties.length === 0 ? (
        <div className="text-center text-gray-600 py-8">
          No properties found matching your criteria
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property) => (
            <Link
              key={property.id}
              to={`/property/${property.id}`}
              className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
            >
              <div className="relative h-48 md:h-56">
                <img
                  src={property.mainImageUrl || 'https://via.placeholder.com/800x600.png?text=No+Image+Available'}
                  alt={property.address?.full || 'Property Image'}
                  className="w-full h-full object-cover rounded-t-lg"
                />
                <div className="absolute top-2 right-2 bg-blue-600 text-white px-2 py-1 rounded text-sm font-medium">
                  {filters.status === 'sold' ? 'Sold' : 'For Sale'}
                </div>
              </div>
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">
                    ${(property.price || 0).toLocaleString()}
                  </h3>
                </div>
                <p className="text-gray-600 mb-3">
                  {property.address?.street}, {property.address?.city}
                </p>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  {property.details?.beds > 0 && (
                    <span className="flex items-center gap-1">
                      <FaBed /> {property.details.beds}
                    </span>
                  )}
                  {property.details?.baths > 0 && (
                    <span className="flex items-center gap-1">
                      <FaBath /> {property.details.baths}
                    </span>
                  )}
                  {property.details?.sqft > 0 && (
                    <span className="flex items-center gap-1">
                      <FaRuler /> {property.details.sqft.toLocaleString()} sqft
                    </span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
