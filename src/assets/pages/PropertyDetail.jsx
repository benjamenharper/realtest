import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore from 'swiper';
import { Navigation } from 'swiper/modules';
import 'swiper/css/bundle';
import { FaBed, FaBath, FaRuler, FaParking, FaMapMarkerAlt, FaCalendar } from 'react-icons/fa';
import { processPropertyData } from '../../utils/redfin';

export default function PropertyDetail() {
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { propertyId } = useParams();

  SwiperCore.use([Navigation]);

  useEffect(() => {
    const fetchPropertyDetail = async () => {
      try {
        setLoading(true);
        // For now, we'll use mock data since the API doesn't have a detail endpoint
        const mockDetail = {
          propertyId,
          streetAddress: '92-1020 Aliinui Drive',
          city: 'Kapolei',
          state: 'HI',
          zipCode: '96707',
          price: 1250000,
          beds: 5,
          baths: 4,
          sqFt: 2800,
          lotSize: '8,000 sqft',
          yearBuilt: '2023',
          propertyType: 'Single Family',
          mainImageUrl: 'https://ssl.cdn-redfin.com/photo/169/mbphoto/376/genMid.PW23015376_0.jpg',
          photos: [
            'https://ssl.cdn-redfin.com/photo/169/mbphoto/376/genMid.PW23015376_0.jpg',
            'https://ssl.cdn-redfin.com/photo/169/mbphoto/376/genMid.PW23015376_1.jpg',
            'https://ssl.cdn-redfin.com/photo/169/mbphoto/376/genMid.PW23015376_2.jpg'
          ],
          description: 'Luxury home in Ko Olina with stunning ocean and golf course views. This beautiful property features an open concept living area, gourmet kitchen with high-end appliances, spacious primary suite, and a private pool.',
          features: [
            'Central AC',
            'Triple Garage',
            'Solar Panels',
            'Pool',
            'Golf Course View',
            'Ocean View',
            'High Ceilings',
            'Gourmet Kitchen',
            'Walk-in Closets',
            'Smart Home Features'
          ],
          latitude: 21.3420,
          longitude: -158.0540,
          status: 'FOR_SALE',
          daysOnMarket: 15
        };

        const processed = processPropertyData(mockDetail);
        setProperty(processed);
      } catch (err) {
        console.error('Error fetching property details:', err);
        setError('Failed to load property details');
      } finally {
        setLoading(false);
      }
    };

    fetchPropertyDetail();
  }, [propertyId]);

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

  if (!property) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="text-center text-gray-600">
          Property not found
        </div>
      </div>
    );
  }

  return (
    <main className="max-w-6xl mx-auto p-6">
      <Swiper navigation>
        {property.images.map((url, index) => (
          <SwiperSlide key={index}>
            <div className="relative h-[550px]">
              <img
                src={url}
                alt={`Property image ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      <div className="mt-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              ${property.price.current.toLocaleString()}
            </h1>
            <div className="flex items-center text-gray-600 mt-2">
              <FaMapMarkerAlt className="mr-2" />
              <p className="text-lg">
                {property.address.full}
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="inline-block bg-green-600 text-white px-3 py-1 rounded-lg text-sm">
              For Sale
            </div>
            <div className="flex items-center text-gray-600 mt-2 justify-end">
              <FaCalendar className="mr-1" />
              <span className="text-sm">{property.daysOnMarket} days on market</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center text-gray-600">
              <FaBed className="mr-2" />
              <span>{property.details.beds} Beds</span>
            </div>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center text-gray-600">
              <FaBath className="mr-2" />
              <span>{property.details.baths} Baths</span>
            </div>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center text-gray-600">
              <FaRuler className="mr-2" />
              <span>{property.details.sqft.toLocaleString()} sqft</span>
            </div>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center text-gray-600">
              <FaParking className="mr-2" />
              <span>Lot: {property.details.lotSize}</span>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">Description</h2>
          <p className="text-gray-600 leading-relaxed">
            {property.description}
          </p>
        </div>

        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">Features</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {property.features.map((feature, index) => (
              <div 
                key={index}
                className="bg-gray-50 p-3 rounded-lg text-gray-600 text-sm"
              >
                {feature}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">Property Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <p className="flex justify-between text-gray-600">
                <span>Property Type:</span>
                <span className="font-medium">{property.details.propertyType}</span>
              </p>
              <p className="flex justify-between text-gray-600">
                <span>Year Built:</span>
                <span className="font-medium">{property.details.yearBuilt}</span>
              </p>
              <p className="flex justify-between text-gray-600">
                <span>Square Footage:</span>
                <span className="font-medium">{property.details.sqft.toLocaleString()} sqft</span>
              </p>
            </div>
            <div className="space-y-2">
              <p className="flex justify-between text-gray-600">
                <span>Lot Size:</span>
                <span className="font-medium">{property.details.lotSize}</span>
              </p>
              <p className="flex justify-between text-gray-600">
                <span>Bedrooms:</span>
                <span className="font-medium">{property.details.beds}</span>
              </p>
              <p className="flex justify-between text-gray-600">
                <span>Bathrooms:</span>
                <span className="font-medium">{property.details.baths}</span>
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 p-6 bg-gray-50 rounded-lg">
          <h2 className="text-2xl font-semibold mb-4">Contact Agent</h2>
          <p className="text-gray-600 mb-4">
            Interested in this property? Contact our agent for more information or to schedule a viewing.
          </p>
          <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
            Contact Agent
          </button>
        </div>
      </div>
    </main>
  );
}
