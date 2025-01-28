import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchPropertiesForSale, processPropertyData } from '../../utils/redfin';
import { FaBed, FaBath, FaRuler, FaMapMarkerAlt } from 'react-icons/fa';

export default function PropertiesForSale() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadProperties = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchPropertiesForSale();
        console.log('Fetched data:', data);
        
        if (!data || !data.properties) {
          throw new Error('No properties data received');
        }
        
        const processedData = data.properties.map(processPropertyData);
        console.log('Processed data:', processedData);
        setProperties(processedData);
      } catch (err) {
        console.error('Error loading properties for sale:', err);
        setError(err.message || 'Failed to load properties for sale');
      } finally {
        setLoading(false);
      }
    };

    loadProperties();
  }, []);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <h2 className="text-2xl font-semibold mb-6">Properties For Sale</h2>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <h2 className="text-2xl font-semibold mb-6">Properties For Sale</h2>
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
        <h2 className="text-2xl font-semibold mb-6">Properties For Sale</h2>
        <div className="text-center text-gray-600">
          No properties found in this area.
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Properties For Sale</h2>
        <Link 
          to="/properties?status=sale" 
          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
        >
          View all properties →
        </Link>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {properties.slice(0, 3).map((property) => (
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
              <div className="absolute top-2 right-2 bg-green-600 text-white px-2 py-1 rounded text-sm">
                For Sale
              </div>
            </div>

            <div className="p-4">
              <div className="mb-2">
                <h3 className="text-xl font-semibold text-gray-900">
                  ${property.price.current.toLocaleString()}
                </h3>
                <div className="flex items-center text-gray-600 text-sm mt-1">
                  <FaMapMarkerAlt className="mr-1" />
                  <p>
                    {property.address.street}
                  </p>
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
    </div>
  );
}
