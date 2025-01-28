import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { searchProperties } from '../../utils/zillow';
import ListingItem from '../components/ListingItem';

const islandLocations = {
  'oahu': 'Honolulu, HI',
  'maui': 'Kahului, HI',
  'big-island': 'Hilo, HI',
  'kauai': 'Lihue, HI'
};

const islandNames = {
  'oahu': 'Oahu',
  'maui': 'Maui',
  'big-island': 'Big Island',
  'kauai': 'Kauai'
};

const propertyTypes = [
  { value: 'all', label: 'All Properties' },
  { value: 'HOUSE', label: 'Houses' },
  { value: 'APARTMENT', label: 'Condos' },
  { value: 'TOWNHOUSE', label: 'Townhouses' },
  { value: 'MANUFACTURED', label: 'Manufactured' },
  { value: 'LOT', label: 'Land' }
];

const sortOptions = [
  { value: 'price_desc', label: 'Price (High to Low)' },
  { value: 'price_asc', label: 'Price (Low to High)' },
  { value: 'beds_desc', label: 'Most Beds' },
  { value: 'beds_asc', label: 'Least Beds' },
  { value: 'sqft_desc', label: 'Largest' },
  { value: 'sqft_asc', label: 'Smallest' },
];

export default function IslandProperties() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const { islandSlug } = useParams();

  // Get filters from URL or use defaults
  const propertyType = searchParams.get('propertyType') || 'all';
  const sortBy = searchParams.get('sort') || 'price_desc';

  const updateFilters = (newFilters) => {
    const currentParams = Object.fromEntries(searchParams.entries());
    setSearchParams({ ...currentParams, ...newFilters });
  };

  useEffect(() => {
    const fetchListings = async () => {
      if (!islandLocations[islandSlug]) {
        setError('Invalid island selected');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        // Get all current filters from URL
        const filters = {
          propertyType,
          sort: sortBy,
          status: 'forSale',
          page: '1'
        };

        console.log('Fetching with filters:', filters);

        const data = await searchProperties(islandLocations[islandSlug], filters);
        setListings(data.properties || []);
      } catch (error) {
        console.error('Error fetching listings:', error);
        setError('Failed to load properties. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, [islandSlug, propertyType, sortBy]);

  const handlePropertyTypeChange = (type) => {
    updateFilters({ propertyType: type });
  };

  const handleSortChange = (sort) => {
    updateFilters({ sort });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="text-center text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold mb-6">
          Properties for Sale in {islandNames[islandSlug]}
        </h1>

        {/* Filters Row */}
        <div className="flex flex-wrap gap-4 items-center justify-between mb-4">
          {/* Property Type Filter */}
          <div className="flex flex-wrap gap-3">
            {propertyTypes.map(type => (
              <button
                key={type.value}
                onClick={() => handlePropertyTypeChange(type.value)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  propertyType === type.value
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {type.label}
              </button>
            ))}
          </div>

          {/* Sort Dropdown */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => handleSortChange(e.target.value)}
              className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 appearance-none cursor-pointer pr-8"
            >
              {sortOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Results Count */}
        <div className="text-gray-600 mb-6">
          {listings.length} properties found
        </div>
      </div>

      {listings.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {listings.map((listing) => (
            <ListingItem key={listing.zpid || listing.id} listing={listing} />
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-500 py-8">
          No properties found in {islandNames[islandSlug]}.
        </div>
      )}
    </div>
  );
}
