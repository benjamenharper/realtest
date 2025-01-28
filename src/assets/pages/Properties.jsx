import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { FaBed, FaBath, FaRuler, FaMapMarkerAlt, FaFilter, FaTimes } from 'react-icons/fa';
import { fetchPropertiesForSale, fetchRecentlySold, processPropertyData } from '../../utils/redfin';

export default function Properties() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    status: searchParams.get('status') || 'sale',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    beds: searchParams.get('beds') || '',
    baths: searchParams.get('baths') || '',
    propertyType: searchParams.get('propertyType') || '',
  });
  const [showFiltersMobile, setShowFiltersMobile] = useState(false);

  useEffect(() => {
    const loadProperties = async () => {
      try {
        setLoading(true);
        setError(null);
        
        let data;
        if (filters.status === 'sold') {
          data = await fetchRecentlySold();
        } else {
          data = await fetchPropertiesForSale();
        }
        
        if (!data || !data.properties) {
          throw new Error('No properties data received');
        }
        
        let processedData = data.properties.map(processPropertyData);
        
        // Apply filters
        processedData = processedData.filter(property => {
          const currentPrice = property.price?.current || property.price || 0;
          const beds = property.details?.beds || property.beds || 0;
          const baths = property.details?.baths || property.baths || 0;
          const propertyType = property.details?.propertyType || property.propertyType || '';

          if (filters.minPrice && currentPrice < parseInt(filters.minPrice)) return false;
          if (filters.maxPrice && currentPrice > parseInt(filters.maxPrice)) return false;
          if (filters.beds && beds < parseInt(filters.beds)) return false;
          if (filters.baths && baths < parseInt(filters.baths)) return false;
          if (filters.propertyType && propertyType !== filters.propertyType) return false;
          return true;
        });

        setProperties(processedData);
      } catch (err) {
        console.error('Error loading properties:', err);
        setError(err.message || 'Failed to load properties');
      } finally {
        setLoading(false);
      }
    };

    loadProperties();
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

  const propertyTypes = ['Single Family', 'Condo', 'Townhouse', 'Multi-Family'];
  const priceRanges = [
    { min: '', max: '', label: 'Any Price' },
    { min: '0', max: '500000', label: 'Under $500k' },
    { min: '500000', max: '750000', label: '$500k - $750k' },
    { min: '750000', max: '1000000', label: '$750k - $1M' },
    { min: '1000000', max: '1500000', label: '$1M - $1.5M' },
    { min: '1500000', max: '', label: '$1.5M+' },
  ];

  const FilterPanel = () => (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <div className="space-y-4">
        {/* Status */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handleFilterChange('status', 'sale')}
              className={`px-4 py-2 text-sm font-medium rounded-md ${
                filters.status === 'sale'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              For Sale
            </button>
            <button
              onClick={() => handleFilterChange('status', 'sold')}
              className={`px-4 py-2 text-sm font-medium rounded-md ${
                filters.status === 'sold'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Recently Sold
            </button>
          </div>
        </div>

        {/* Price Range */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Price Range</label>
          <select
            value={`${filters.minPrice}-${filters.maxPrice}`}
            onChange={(e) => {
              const [min, max] = e.target.value.split('-');
              handleFilterChange('minPrice', min);
              handleFilterChange('maxPrice', max);
            }}
            className="w-full p-2 border rounded-md bg-white"
          >
            {priceRanges.map((range, index) => (
              <option 
                key={index} 
                value={`${range.min}-${range.max}`}
              >
                {range.label}
              </option>
            ))}
          </select>
        </div>

        {/* Beds */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Minimum Beds</label>
          <div className="grid grid-cols-3 gap-2">
            {[0, 1, 2, 3, 4, '5+'].map((num) => (
              <button
                key={num}
                onClick={() => handleFilterChange('beds', num === '5+' ? '5' : num.toString())}
                className={`px-3 py-2 text-sm font-medium rounded-md ${
                  filters.beds === (num === '5+' ? '5' : num.toString())
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {num}
              </button>
            ))}
          </div>
        </div>

        {/* Baths */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Minimum Baths</label>
          <div className="grid grid-cols-3 gap-2">
            {[0, 1, 2, 3, 4, '5+'].map((num) => (
              <button
                key={num}
                onClick={() => handleFilterChange('baths', num === '5+' ? '5' : num.toString())}
                className={`px-3 py-2 text-sm font-medium rounded-md ${
                  filters.baths === (num === '5+' ? '5' : num.toString())
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {num}
              </button>
            ))}
          </div>
        </div>

        {/* Property Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Property Type</label>
          <div className="space-y-2">
            <button
              onClick={() => handleFilterChange('propertyType', '')}
              className={`w-full px-3 py-2 text-sm font-medium rounded-md ${
                filters.propertyType === ''
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Any
            </button>
            {propertyTypes.map((type) => (
              <button
                key={type}
                onClick={() => handleFilterChange('propertyType', type)}
                className={`w-full px-3 py-2 text-sm font-medium rounded-md ${
                  filters.propertyType === type
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center text-red-600 bg-red-50 p-4 rounded-lg">
          <p>{error}</p>
          <p className="text-sm mt-2">Please try again later</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Mobile Filter Button */}
      <div className="lg:hidden mb-4">
        <button
          onClick={() => setShowFiltersMobile(true)}
          className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <FaFilter />
          Show Filters
        </button>
      </div>

      {/* Mobile Filter Sidebar */}
      {showFiltersMobile && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setShowFiltersMobile(false)} />
          <div className="absolute inset-y-0 right-0 w-full max-w-xs bg-white shadow-xl">
            <div className="h-full flex flex-col">
              <div className="flex items-center justify-between p-4 border-b">
                <h2 className="text-lg font-semibold">Filters</h2>
                <button
                  onClick={() => setShowFiltersMobile(false)}
                  className="p-2 text-gray-500 hover:text-gray-700"
                >
                  <FaTimes className="w-5 h-5" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-4">
                <FilterPanel />
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block w-64 flex-shrink-0">
          <div className="sticky top-8">
            <FilterPanel />
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-semibold">
              {filters.status === 'sold' ? 'Recently Sold Properties' : 'Properties For Sale'}
            </h1>
            <p className="text-gray-600">
              {properties.length} {properties.length === 1 ? 'property' : 'properties'} found
            </p>
          </div>

          {properties.length === 0 ? (
            <div className="text-center text-gray-600 py-12 bg-gray-50 rounded-lg">
              <p className="text-lg">No properties found matching your criteria</p>
              <p className="text-sm mt-2">Try adjusting your filters to see more results</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {properties.map((property) => (
                <Link
                  to={`/property/${property.id}`}
                  key={property.id}
                  className="block bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="relative h-48">
                    <img
                      src={property.images?.[0] || property.mainImageUrl || 'https://via.placeholder.com/800x600.png?text=No+Image+Available'}
                      alt={property.address?.full || `${property.streetAddress}, ${property.city}, ${property.state}`}
                      className="w-full h-full object-cover"
                    />
                    <div className={`absolute top-2 right-2 ${
                      filters.status === 'sold' ? 'bg-gray-600' : 'bg-green-600'
                    } text-white px-2 py-1 rounded text-sm`}>
                      {filters.status === 'sold' ? 'Sold' : 'For Sale'}
                    </div>
                  </div>

                  <div className="p-4">
                    <div className="mb-2">
                      <h3 className="text-xl font-semibold text-gray-900">
                        ${(property.price?.current || property.price || 0).toLocaleString()}
                      </h3>
                      <div className="flex items-center text-gray-600 text-sm mt-1">
                        <FaMapMarkerAlt className="mr-1" />
                        <p>{property.address?.street || property.streetAddress}</p>
                      </div>
                      <p className="text-gray-500 text-sm">
                        {property.address?.city || property.city}, {property.address?.state || property.state} {property.address?.zipcode || property.zipCode}
                      </p>
                    </div>

                    <div className="flex items-center gap-4 text-gray-600 text-sm mt-4">
                      {(property.details?.beds || property.beds) > 0 && (
                        <div className="flex items-center gap-1">
                          <FaBed className="text-gray-400" />
                          <span>{property.details?.beds || property.beds}</span>
                        </div>
                      )}
                      {(property.details?.baths || property.baths) > 0 && (
                        <div className="flex items-center gap-1">
                          <FaBath className="text-gray-400" />
                          <span>{property.details?.baths || property.baths}</span>
                        </div>
                      )}
                      {(property.details?.sqft || property.sqft) > 0 && (
                        <div className="flex items-center gap-1">
                          <FaRuler className="text-gray-400" />
                          <span>{(property.details?.sqft || property.sqft).toLocaleString()} sqft</span>
                        </div>
                      )}
                    </div>

                    {(property.details?.yearBuilt || property.yearBuilt) && (
                      <p className="text-gray-500 text-sm mt-2">
                        Built in {property.details?.yearBuilt || property.yearBuilt}
                      </p>
                    )}

                    {property.features?.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {property.features.slice(0, 3).map((feature, index) => (
                          <span 
                            key={index}
                            className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded"
                          >
                            {feature}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
