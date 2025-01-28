import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore from 'swiper';
import { Navigation, Pagination, EffectFade } from 'swiper/modules';
import 'swiper/css/bundle';
import 'swiper/css/effect-fade';
import { FaBed, FaBath, FaParking, FaRuler, FaMapMarkerAlt, FaCalendarAlt } from 'react-icons/fa';
import { getPropertyDetails, getPropertyImages } from '../../utils/zillow';
import Contact from '../components/Contact';

export default function PropertyDetail() {
  SwiperCore.use([Navigation, Pagination, EffectFade]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [property, setProperty] = useState(null);
  const [propertyImages, setPropertyImages] = useState([]);
  const [contact, setContact] = useState(false);
  const { propertyId } = useParams();

  useEffect(() => {
    const fetchPropertyData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch property details and images in parallel
        const [propertyData, imagesData] = await Promise.all([
          getPropertyDetails(propertyId),
          getPropertyImages(propertyId),
        ]);

        setProperty(propertyData);
        setPropertyImages(imagesData?.images || []);
      } catch (error) {
        console.error('Error fetching property:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (propertyId) {
      fetchPropertyData();
    }
  }, [propertyId]);

  const formatPrice = (price) => {
    if (!price) return 'Price not available';
    return price.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    });
  };

  const getDisplayImages = () => {
    const images = [];

    // Try propertyImages first
    if (Array.isArray(propertyImages) && propertyImages.length > 0) {
      images.push(...propertyImages);
    }

    // Then try property.photos
    if (property?.photos && Array.isArray(property.photos) && property.photos.length > 0) {
      images.push(...property.photos);
    }

    // Then try property.imgSrc
    if (property?.imgSrc && !images.includes(property.imgSrc)) {
      images.push(property.imgSrc);
    }

    // Return placeholder if no images found
    return images.length > 0 ? images : ['https://via.placeholder.com/800x600?text=No+Image+Available'];
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
      <div className="text-center my-8 text-red-500">
        Error: {error}
      </div>
    );
  }

  if (!property) {
    return (
      <div className="text-center my-8">
        Property not found
      </div>
    );
  }

  const images = getDisplayImages();

  return (
    <main className="max-w-6xl mx-auto px-4 py-6">
      <div className="mb-6">
        <Swiper
          navigation
          pagination={{ clickable: true }}
          effect="fade"
          loop={images.length > 1}
          className="h-[550px] rounded-lg overflow-hidden"
        >
          {images.map((photo, index) => (
            <SwiperSlide key={index}>
              <img
                src={photo}
                alt={`Property image ${index + 1}`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  console.log('Image failed to load:', photo);
                  e.target.src = 'https://via.placeholder.com/800x600?text=No+Image+Available';
                }}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="mb-6">
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-3xl font-bold text-slate-800 mb-2">
                    {property.address?.streetAddress}
                  </h1>
                  <div className="flex items-center gap-2 text-gray-600">
                    <FaMapMarkerAlt />
                    <p>
                      {property.address?.city}, {property.address?.state} {property.address?.zipcode}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <h2 className="text-3xl font-bold text-slate-800">
                    {formatPrice(property.price)}
                    {property.listingStatus === 'forRent' && (
                      <span className="text-xl font-normal text-gray-600"> / month</span>
                    )}
                  </h2>
                  {property.zestimate && (
                    <p className="text-sm text-gray-600 mt-1">
                      Zestimate: {formatPrice(property.zestimate)}
                    </p>
                  )}
                  {property.daysOnZillow && (
                    <div className="flex items-center gap-2 mt-2 text-sm text-gray-600 justify-end">
                      <FaCalendarAlt />
                      <span>Listed {property.daysOnZillow} days ago</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="flex items-center gap-2">
                <FaBed className="text-xl text-gray-600" />
                <span>{property.bedrooms || 'N/A'} beds</span>
              </div>
              <div className="flex items-center gap-2">
                <FaBath className="text-xl text-gray-600" />
                <span>{property.bathrooms || 'N/A'} baths</span>
              </div>
              <div className="flex items-center gap-2">
                <FaRuler className="text-xl text-gray-600" />
                <span>{property.squareFootage?.toLocaleString() || 'N/A'} sqft</span>
              </div>
              <div className="flex items-center gap-2">
                <FaParking className="text-xl text-gray-600" />
                <span>{property.parkingSpaces || 'N/A'} parking</span>
              </div>
            </div>

            <div className="mb-6">
              <h2 className="text-2xl font-semibold mb-4">Description</h2>
              <p className="text-gray-700 whitespace-pre-line">
                {property.description || 'No description available.'}
              </p>
            </div>

            {property.features && property.features.length > 0 && (
              <div className="mb-6">
                <h2 className="text-2xl font-semibold mb-4">Features</h2>
                <ul className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {property.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {property.schools && property.schools.length > 0 && (
              <div className="mb-6">
                <h2 className="text-2xl font-semibold mb-4">Nearby Schools</h2>
                <div className="grid gap-4">
                  {property.schools.map((school, index) => (
                    <div key={index} className="border-b pb-2">
                      <h3 className="font-semibold">{school.name}</h3>
                      <p className="text-sm text-gray-600">{school.type} • {school.distance} miles</p>
                      <p className="text-sm text-gray-600">Rating: {school.rating || 'N/A'}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-4">Contact Agent</h2>
              <div className="text-gray-600 space-y-3 mb-6">
                <p>
                  Interested in this {property.propertyType?.toLowerCase() || 'property'}? Get in touch with a local agent who can help you:
                </p>
                <ul className="list-disc list-inside ml-2 text-sm">
                  <li>Schedule a viewing</li>
                  <li>Get detailed property information</li>
                  <li>Discuss pricing and market value</li>
                  <li>Learn about the neighborhood</li>
                  <li>Start your purchase journey</li>
                </ul>
              </div>
            </div>

            <button
              onClick={() => setContact(true)}
              className="w-full bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition font-semibold"
            >
              Contact Agent Now
            </button>

            <div className="mt-4 text-center text-sm text-gray-500">
              Quick response guaranteed • No obligation
            </div>

            {contact && <Contact property={property} onClose={() => setContact(false)} />}
          </div>
        </div>
      </div>
    </main>
  );
}
