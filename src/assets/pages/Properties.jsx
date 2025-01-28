import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { FaBed, FaBath, FaRuler, FaMapMarkerAlt, FaFilter } from 'react-icons/fa';
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
  const [showFilters, setShowFilters] = useState(false);

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
          if (filters.minPrice && property.price.current < parseInt(filters.minPrice)) return false;
          if (filters.maxPrice && property.price.current > parseInt(filters.maxPrice)) return false;
          if (filters.beds && property.details.beds < parseInt(filters.beds)) return false;
          if (filters.baths && property.details.baths < parseInt(filters.baths)) return false;
          if (filters.propertyType && property.details.propertyType !== filters.propertyType) return false;
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

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="text-center text-red-600 bg-red-50 p-4 rounded-lg">
          <p>{error}</p>
          <p className="text-sm mt-2">Please try again later</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-semibold">
          {filters.status === 'sold' ? 'Recently Sold Properties' : 'Properties For Sale'}
        </h1>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <FaFilter />
          Filters
        </button>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="bg-gray-50 p-6 rounded-lg mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="w-full p-2 border rounded-md"
              >
                <option value="sale">For Sale</option>
                <option value="sold">Recently Sold</option>
              </select>
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
                className="w-full p-2 border rounded-md"
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
              <select
                value={filters.beds}
                onChange={(e) => handleFilterChange('beds', e.target.value)}
                className="w-full p-2 border rounded-md"
              >
                <option value="">Any</option>
                {[1, 2, 3, 4, 5].map((num) => (
                  <option key={num} value={num}>{num}+ beds</option>
                ))}
              </select>
            </div>

            {/* Baths */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Minimum Baths</label>
              <select
                value={filters.baths}
                onChange={(e) => handleFilterChange('baths', e.target.value)}
                className="w-full p-2 border rounded-md"
              >
                <option value="">Any</option>
                {[1, 2, 3, 4, 5].map((num) => (
                  <option key={num} value={num}>{num}+ baths</option>
                ))}
              </select>
            </div>

            {/* Property Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Property Type</label>
              <select
                value={filters.propertyType}
                onChange={(e) => handleFilterChange('propertyType', e.target.value)}
                className="w-full p-2 border rounded-md"
              >
                <option value="">Any</option>
                {propertyTypes.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Properties Grid */}
      {properties.length === 0 ? (
        <div className="text-center text-gray-600 py-12">
          No properties found matching your criteria
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property) => (
            <Link
              to={`/property/${property.id}`}
              key={property.id}
              className="block bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow duration-300"
            >
              <div className="relative h-48">
                <img
                  src={property.images[0]}
                  alt={property.address.full}
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
                    ${property.price.current.toLocaleString()}
                  </h3>
                  <div className="flex items-center text-gray-600 text-sm mt-1">
                    <FaMapMarkerAlt className="mr-1" />
                    <p>{property.address.street}</p>
                  </div>
                  <p className="text-gray-500 text-sm">
                    {property.address.city}, {property.address.state} {property.address.zipcode}
                  </p>
                </div>

                <div className="flex items-center gap-4 text-gray-600 text-sm mt-4">
                  {property.details.beds > 0 && (
                    <div className="flex items-center gap-1">
                      <FaBed className="text-gray-400" />
                      <span>{property.details.beds}</span>
                    </div>
                  )}
                  {property.details.baths > 0 && (
                    <div className="flex items-center gap-1">
                      <FaBath className="text-gray-400" />
                      <span>{property.details.baths}</span>
                    </div>
                  )}
                  {property.details.sqft > 0 && (
                    <div className="flex items-center gap-1">
                      <FaRuler className="text-gray-400" />
                      <span>{property.details.sqft.toLocaleString()} sqft</span>
                    </div>
                  )}
                </div>

                {property.details.yearBuilt && (
                  <p className="text-gray-500 text-sm mt-2">
                    Built in {property.details.yearBuilt}
                  </p>
                )}

                {property.features.length > 0 && (
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
  );
}
