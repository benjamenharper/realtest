import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import SwiperCore from "swiper";
import { FaArrowAltCircleRight } from "react-icons/fa";
import "swiper/css/bundle";
import ListingItem from "../components/ListingItem";
import RecentlySold from '../components/RecentlySold';
import PropertiesForSale from '../components/PropertiesForSale';

export default function Home() {
  // States for different types of listings
  const [offerListings, setOfferListings] = useState([]);
  const [saleListings, setSaleListings] = useState([]);
  const [rentListings, setRentListings] = useState([]);
  // Initialize Swiper navigation module
  SwiperCore.use([Navigation]);

  // Initial fetch for offer listings
  useEffect(() => {
    const fetchOfferListings = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/listing/get?offer=true&limit=6`
        );
        const data = await res.json();
        setOfferListings(data);
        // Initial fetch for offer listings
        fetchRentListings();
      } catch (error) {
        console.log(error.message);
      }
    };
    const fetchRentListings = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/listing/get?type=rent&limit=6`
        );
        const data = await res.json();
        setRentListings(data);
        fetchSaleListings();
      } catch (error) {
        console.log(error.message);
      }
    };

    const fetchSaleListings = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/listing/get?type=sale&limit=6`
        );
        const data = await res.json();
        setSaleListings(data);
      } catch (error) {
        console.log(error.message);
      }
    };
    fetchOfferListings();
  }, []);

  return (
    <div className="min-h-[80vh]">
      <div className="flex flex-col gap-6 p-28 px-3 max-w-6xl mx-auto">
        <h1 className="text-slate-700 font-bold text-3xl lg:text-6xl">
          Find Your <span className="text-blue-500">Hawaii</span> Home <span className="text-orange-500">in A Breeze</span>
        </h1>
        <div className="text-gray-400 text-xs sm:text-sm">
          Experience the essence of island living with Hawaii Elite Real Estate.
          <br />
          Your dream home in paradise awaits.
        </div>
        <Link
          to={"/search"}
          className="text-xs sm:text-sm text-blue-500 font-bold hover:underline"
        >
          Start your journey home...
        </Link>
      </div>
      {/* swiper */}
      <Swiper navigation className=" max-w-6xl rounded-md">
        {offerListings &&
          offerListings.length > 0 &&
          offerListings.map((listing) => (
            <SwiperSlide key={listing._id}>
              <div
                style={{
                  background: `url(${listing.imageUrls[0]}) center no-repeat`,
                  backgroundSize: "cover",
                }}
                className="h-[500px]"
                key={listing._id}
              ></div>
            </SwiperSlide>
          ))}
      </Swiper>

      {/* Properties For Sale Section */}
      <PropertiesForSale />

      {/* listing results for offer, sale and rent */}

      <div className="max-w-6xl mx-auto p-3 flex flex-col gap-8 my-10">
        {offerListings && offerListings.length > 0 && (
          <div className="">
            <div className="my-3">
              <h2 className="text-2xl font-semibold text-slate-600">
                Recent offers
              </h2>
              <Link
                to={"/search?offer=true"}
                className="text-xs sm:text-sm flex justify-left items-center gap-2 my-2"
              >
                <FaArrowAltCircleRight className="text-blue-700 hover:font-bold" />
                <span className=" text-blue-700 hover:underline duration-300 font-bold ">
                  Show more offers
                </span>
              </Link>
            </div>
            <div className="flex flex-wrap gap-6 ">
              {offerListings.map((listing) => (
                <ListingItem listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}
        {rentListings && rentListings.length > 0 && (
          <div className="">
            <div className="my-3">
              <h2 className="text-2xl font-semibold text-slate-600">
                Recent places for rent
              </h2>
              <Link
                to={"/search?type=rent"}
                className="text-xs sm:text-sm flex justify-left items-center gap-2 my-2"
              >
                <FaArrowAltCircleRight className="text-blue-700 hover:font-bold" />
                <span className=" text-blue-700 hover:underline duration-300 font-bold ">
                  Show more places for rent
                </span>
              </Link>
            </div>
            <div className="flex flex-wrap gap-6">
              {rentListings.map((listing) => (
                <ListingItem listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}
        {saleListings && saleListings.length > 0 && (
          <div className="">
            <div className="my-3">
              <h2 className="text-2xl font-semibold text-slate-600">
                Recent places for sale
              </h2>
              <Link
                to={"/search?type=sale"}
                className="text-xs sm:text-sm flex justify-left items-center gap-2 my-2"
              >
                <FaArrowAltCircleRight className="text-blue-700 hover:font-bold" />
                <span className=" text-blue-700 hover:underline duration-300 font-bold ">
                  Show more places for sale
                </span>
              </Link>
            </div>
            <div className="flex flex-wrap gap-6">
              {saleListings.map((listing) => (
                <ListingItem listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Recently Sold Section */}
      <RecentlySold />
    </div>
  );
}
