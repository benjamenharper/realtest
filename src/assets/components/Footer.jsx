import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa";

export default function Footer() {
  // Extracting currentUser from Redux store state
  const { currentUser } = useSelector((state) => state.user);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  // Function to handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set("searchTerm", searchTerm);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  // Effect hook to update search term from URL query parameters
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get("searchTerm");
    if (searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl);
    }
  }, [location.search]);

  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="max-w-6xl mx-auto py-8 px-6">
        {/* Search Bar */}
        <div className="mb-8">
          <form
            onSubmit={handleSubmit}
            className="max-w-xl mx-auto"
          >
            <div className="flex items-center bg-white border border-gray-200 rounded-lg p-2 shadow-sm">
              <input
                type="text"
                placeholder="Search properties..."
                className="flex-1 bg-transparent focus:outline-none px-2"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button className="bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 transition-colors">
                <FaSearch />
              </button>
            </div>
          </form>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Hawaii Elite Real Estate</h3>
            <p className="text-gray-600 text-sm">
              Your trusted partner in Hawaii real estate, providing exceptional service and expertise.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/search" className="text-gray-600 hover:text-blue-600 text-sm">
                  Properties
                </Link>
              </li>
              <li>
                <Link to="/services" className="text-gray-600 hover:text-blue-600 text-sm">
                  Services
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-gray-600 hover:text-blue-600 text-sm">
                  News
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-600 hover:text-blue-600 text-sm">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/profile" className="text-gray-600 hover:text-blue-600 text-sm">
                  {currentUser ? 'Profile' : 'Sign in'}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Contact</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>Phone: (808) 123-4567</li>
              <li>Email: info@hawaiielite.com</li>
              <li>Address: Honolulu, HI 96815</li>
            </ul>
          </div>

          {/* Account */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Account</h3>
            <ul className="space-y-2">
              {currentUser ? (
                <li>
                  <Link to="/profile" className="text-gray-600 hover:text-blue-600 text-sm">
                    My Profile
                  </Link>
                </li>
              ) : (
                <li>
                  <Link to="/sign-in" className="text-gray-600 hover:text-blue-600 text-sm">
                    Sign In
                  </Link>
                </li>
              )}
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 mt-8 pt-8 text-center text-sm text-gray-600">
          <p>&copy; 2025 Hawaii Elite Real Estate. Brokered by Real Broker, LLC. 2176 Lauwiliwili St., # 1, Kapolei, HI, 96707, United States. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
}
