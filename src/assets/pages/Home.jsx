import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import SwiperCore from 'swiper';
import 'swiper/css/bundle';
import { searchProperties } from '../../utils/zillow';

export default function Home() {
  const [offerListings, setOfferListings] = useState([]);
  const [saleListings, setSaleListings] = useState([]);
  const [rentListings, setRentListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize Swiper navigation module
  SwiperCore.use([Navigation]);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch properties for sale in Hawaii
        const saleResponse = await searchProperties('Hawaii', {
          status: 'forSale',
          limit: 8
        });
        setSaleListings(saleResponse?.properties || []);

        // Fetch rental properties in Hawaii
        const rentResponse = await searchProperties('Hawaii', {
          status: 'forRent',
          limit: 8
        });
        setRentListings(rentResponse?.properties || []);

        // Fetch recently reduced properties
        const offerResponse = await searchProperties('Hawaii', {
          status: 'recentlySold',
          limit: 8
        });
        setOfferListings(offerResponse?.properties || []);

      } catch (error) {
        console.error('Error fetching listings:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 p-4">
        Error: {error}
      </div>
    );
  }

  const formatPrice = (price) => {
    if (!price) return 'Price not available';
    return price.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    });
  };

  return (
    <div>
      {/* Banner section */}
      <div className="relative">
        <div className="h-[500px] w-full">
          <img
            src="/banner.jpg"
            alt="Hawaii coastline"
            className="w-full h-full object-cover brightness-75"
          />
        </div>
        <div className="absolute inset-0 flex flex-col justify-center items-center text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-2">
            Find Your Hawaii Home
          </h1>
          <h2 className="text-2xl md:text-4xl font-light text-white">
            In A Breeze
          </h2>
        </div>
      </div>

      <div className="min-h-[80vh]">
        <div className="flex flex-col gap-6 p-28 px-6 max-w-6xl mx-auto">
          <h1 className="text-slate-700 font-bold text-3xl lg:text-6xl">
            Find Your <span className="text-orange-500">Hawaii</span> Home
          </h1>
          <div className="text-gray-400 text-xs sm:text-sm">
            Welcome to your premier real estate destination in Hawaii.
            <br />
            We have a wide selection of luxury homes, beachfront properties, and more.
          </div>
          <Link
            to="/search"
            className="text-xs sm:text-sm text-blue-800 font-bold hover:underline"
          >
            Let's get started...
          </Link>
        </div>

        {/* Listings sections */}
        <div className="max-w-6xl mx-auto p-3 flex flex-col gap-8 my-10">
          {saleListings.length > 0 && (
            <div className="">
              <h2 className="text-2xl font-semibold text-slate-600">Recent properties for Sale</h2>
              <Link className="text-sm text-blue-800 hover:underline" to="/search?type=sale">
                Show more properties for sale
              </Link>
              <div className="p-4 flex flex-wrap gap-4">
                <Swiper navigation>
                  {saleListings.map((listing) => (
                    <SwiperSlide key={listing.id}>
                      <div className="bg-white shadow-md hover:shadow-lg transition-shadow overflow-hidden rounded-lg w-full sm:w-[330px]">
                        <Link to={`/listing/${listing.id}`}>
                          <img
                            src={listing.photos[0]}
                            alt={`${listing.address.streetAddress}`}
                            className="h-[320px] sm:h-[220px] w-full object-cover hover:scale-105 transition-scale duration-300"
                          />
                          <div className="p-3 flex flex-col gap-2 w-full">
                            <p className="truncate text-lg font-semibold text-slate-700">
                              {listing.address.streetAddress}
                            </p>
                            <p className="text-sm text-gray-600 line-clamp-2">
                              {listing.address.city}, {listing.address.state} {listing.address.zipcode}
                            </p>
                            <p className="text-slate-500 mt-2 font-semibold">
                              {formatPrice(listing.price)}
                            </p>
                            <div className="text-slate-700 flex gap-4">
                              <div className="font-bold text-xs">
                                {listing.bedrooms} {listing.bedrooms > 1 ? 'beds' : 'bed'}
                              </div>
                              <div className="font-bold text-xs">
                                {listing.bathrooms} {listing.bathrooms > 1 ? 'baths' : 'bath'}
                              </div>
                              <div className="font-bold text-xs">
                                {listing.squareFootage?.toLocaleString() || 'N/A'} sqft
                              </div>
                            </div>
                          </div>
                        </Link>
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
            </div>
          )}

          {rentListings.length > 0 && (
            <div className="">
              <h2 className="text-2xl font-semibold text-slate-600">Recent properties for Rent</h2>
              <Link className="text-sm text-blue-800 hover:underline" to="/search?type=rent">
                Show more properties for rent
              </Link>
              <div className="p-4 flex flex-wrap gap-4">
                <Swiper navigation>
                  {rentListings.map((listing) => (
                    <SwiperSlide key={listing.id}>
                      <div className="bg-white shadow-md hover:shadow-lg transition-shadow overflow-hidden rounded-lg w-full sm:w-[330px]">
                        <Link to={`/listing/${listing.id}`}>
                          <img
                            src={listing.photos[0]}
                            alt={`${listing.address.streetAddress}`}
                            className="h-[320px] sm:h-[220px] w-full object-cover hover:scale-105 transition-scale duration-300"
                          />
                          <div className="p-3 flex flex-col gap-2 w-full">
                            <p className="truncate text-lg font-semibold text-slate-700">
                              {listing.address.streetAddress}
                            </p>
                            <p className="text-sm text-gray-600 line-clamp-2">
                              {listing.address.city}, {listing.address.state} {listing.address.zipcode}
                            </p>
                            <p className="text-slate-500 mt-2 font-semibold">
                              {formatPrice(listing.price)}
                              <span className="text-sm font-normal"> / month</span>
                            </p>
                            <div className="text-slate-700 flex gap-4">
                              <div className="font-bold text-xs">
                                {listing.bedrooms} {listing.bedrooms > 1 ? 'beds' : 'bed'}
                              </div>
                              <div className="font-bold text-xs">
                                {listing.bathrooms} {listing.bathrooms > 1 ? 'baths' : 'bath'}
                              </div>
                              <div className="font-bold text-xs">
                                {listing.squareFootage?.toLocaleString() || 'N/A'} sqft
                              </div>
                            </div>
                          </div>
                        </Link>
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
            </div>
          )}

          {offerListings.length > 0 && (
            <div className="">
              <h2 className="text-2xl font-semibold text-slate-600">Recent Sales</h2>
              <Link className="text-sm text-blue-800 hover:underline" to="/search?type=offer">
                Show more recent sales
              </Link>
              <div className="p-4 flex flex-wrap gap-4">
                <Swiper navigation>
                  {offerListings.map((listing) => (
                    <SwiperSlide key={listing.id}>
                      <div className="bg-white shadow-md hover:shadow-lg transition-shadow overflow-hidden rounded-lg w-full sm:w-[330px]">
                        <Link to={`/listing/${listing.id}`}>
                          <img
                            src={listing.photos[0]}
                            alt={`${listing.address.streetAddress}`}
                            className="h-[320px] sm:h-[220px] w-full object-cover hover:scale-105 transition-scale duration-300"
                          />
                          <div className="p-3 flex flex-col gap-2 w-full">
                            <p className="truncate text-lg font-semibold text-slate-700">
                              {listing.address.streetAddress}
                            </p>
                            <p className="text-sm text-gray-600 line-clamp-2">
                              {listing.address.city}, {listing.address.state} {listing.address.zipcode}
                            </p>
                            <p className="text-slate-500 mt-2 font-semibold">
                              {formatPrice(listing.price)}
                            </p>
                            <div className="text-slate-700 flex gap-4">
                              <div className="font-bold text-xs">
                                {listing.bedrooms} {listing.bedrooms > 1 ? 'beds' : 'bed'}
                              </div>
                              <div className="font-bold text-xs">
                                {listing.bathrooms} {listing.bathrooms > 1 ? 'baths' : 'bath'}
                              </div>
                              <div className="font-bold text-xs">
                                {listing.squareFootage?.toLocaleString() || 'N/A'} sqft
                              </div>
                            </div>
                          </div>
                        </Link>
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
