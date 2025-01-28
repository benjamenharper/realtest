import { FaSearch, FaHome, FaPhone } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";

export default function Header() {
  // Extracting currentUser from Redux store state
  const { currentUser } = useSelector((state) => state.user);
  // State for search term
  const [searchTerm, setSearchTerm] = useState("");
  // Hook for navigation
  const navigate = useNavigate();

  // Function to handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    // Constructing search query parameters
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
    <header className="bg-gray-50 border-b border-gray-200">
      <div className="flex justify-between items-center max-w-6xl mx-auto p-6">
        <div className="flex items-center gap-8">
          <Link to="/">
            <h1 className="font-bold text-sm sm:text-xl flex flex-wrap items-center">
              <span className="text-slate-700">Hawaii Elite </span>
              <FaHome className="mx-1 text-blue-600" />
              <span className="text-blue-600"> Real Estate</span>
            </h1>
          </Link>
          <div className="hidden lg:flex items-center text-blue-600 gap-2">
            <FaPhone className="text-sm" />
            <span className="text-sm font-medium">808-866-6593</span>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-slate-100 p-2 rounded-lg flex items-center"
        >
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent focus:outline-none w-32 md:w-64 lg:w-80"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button>
            <FaSearch className="text-slate-600" />
          </button>
        </form>

        <ul className="flex gap-4">
          <Link to="/search">
            <li className="hidden sm:inline text-slate-700 hover:text-blue-600 duration-200 font-medium">
              Properties
            </li>
          </Link>
          <Link to="/services">
            <li className="hidden sm:inline text-slate-700 hover:text-blue-600 duration-200 font-medium">
              Services
            </li>
          </Link>
          <Link to="/blog">
            <li className="hidden sm:inline text-slate-700 hover:text-blue-600 duration-200 font-medium">
              News
            </li>
          </Link>
          {currentUser && (
            <Link to="/profile">
              <li className="text-slate-700 hover:text-blue-600 duration-200 font-medium">
                {currentUser.avatar ? (
                  <img
                    className="rounded-full h-7 w-7 object-cover"
                    src={currentUser.avatar}
                    alt="profile"
                  />
                ) : (
                  "Profile"
                )}
              </li>
            </Link>
          )}
        </ul>
      </div>
    </header>
  );
}
