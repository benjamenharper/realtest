import { FaHome, FaSearchDollar, FaHandshake } from 'react-icons/fa';
import { BsFillHouseGearFill } from 'react-icons/bs';

export default function Services() {
  const services = [
    {
      icon: <FaHome className="w-12 h-12 text-blue-600 mb-4" />,
      title: "Property Sales",
      description: "Expert guidance through the entire home buying and selling process in Hawaii's unique market."
    },
    {
      icon: <BsFillHouseGearFill className="w-12 h-12 text-blue-600 mb-4" />,
      title: "Property Management",
      description: "Comprehensive property management services for homeowners and investors."
    },
    {
      icon: <FaSearchDollar className="w-12 h-12 text-blue-600 mb-4" />,
      title: "Investment Consulting",
      description: "Strategic advice for real estate investments in Hawaii's dynamic market."
    },
    {
      icon: <FaHandshake className="w-12 h-12 text-blue-600 mb-4" />,
      title: "Vacation Rentals",
      description: "Professional management of your vacation rental property to maximize returns."
    }
  ];

  return (
    <div className="max-w-6xl mx-auto py-12 px-6">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Our Services</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Hawaii Elite Real Estate provides comprehensive real estate services
          tailored to meet your unique needs in the Hawaiian market.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {services.map((service, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300"
          >
            <div className="flex flex-col items-center text-center">
              {service.icon}
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {service.title}
              </h3>
              <p className="text-gray-600">
                {service.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-16 bg-blue-50 rounded-lg p-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Why Choose Hawaii Elite?
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            With years of experience in the Hawaiian real estate market, we provide
            personalized service and expert guidance for all your real estate needs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Local Expertise
            </h3>
            <p className="text-gray-600">
              Deep understanding of Hawaii's unique real estate market and communities.
            </p>
          </div>
          <div className="text-center">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Professional Service
            </h3>
            <p className="text-gray-600">
              Dedicated team of experienced agents providing personalized attention.
            </p>
          </div>
          <div className="text-center">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Results Driven
            </h3>
            <p className="text-gray-600">
              Proven track record of successful transactions and satisfied clients.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
