import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchSoldProperties, processPropertyData } from '../../utils/redfin';
import { FaBed, FaBath, FaRuler } from 'react-icons/fa';

export default function RecentlySold() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadProperties = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchSoldProperties();
        console.log('Fetched data:', data);
        
        if (!data || !data.properties) {
          throw new Error('No properties data received');
        }
        
        const processedData = data.properties.map(processPropertyData);
        console.log('Processed data:', processedData);
        setProperties(processedData);
      } catch (err) {
        console.error('Error loading sold properties:', err);
        setError(err.message || 'Failed to load recently sold properties');
      } finally {
        setLoading(false);
      }
    };

    loadProperties();
  }, []);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <h2 className="text-2xl font-semibold mb-6">Recently Sold Properties</h2>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <h2 className="text-2xl font-semibold mb-6">Recently Sold Properties</h2>
        <div className="text-center text-red-600 bg-red-50 p-4 rounded-lg">
          <p>{error}</p>
          <p className="text-sm mt-2">Please try again later</p>
        </div>
      </div>
    );
  }

  if (!properties.length) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <h2 className="text-2xl font-semibold mb-6">Recently Sold Properties</h2>
        <div className="text-center text-gray-600">
          No recently sold properties found in this area.
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Recently Sold</h2>
        <Link 
          to="/search?status=sold" 
          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
        >
          View all sold properties →
        </Link>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {properties.slice(0, 3).map((property) => (
          <div
            key={property.id}
            className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow duration-300"
          >
            <div className="relative h-48">
              <img
                src={property.images[0]}
                alt={property.address.full}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2 right-2 bg-blue-600 text-white px-2 py-1 rounded text-sm">
                Sold
              </div>
            </div>

            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    ${property.price.sold.toLocaleString()}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {property.address.street}
                  </p>
                  <p className="text-gray-500 text-sm">
                    {property.address.city}, {property.address.state} {property.address.zipcode}
                  </p>
                </div>
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

              {property.lastSold && (
                <p className="text-gray-500 text-sm mt-2">
                  Sold on {new Date(property.lastSold).toLocaleDateString()}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
