import { FaHome, FaPhone } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

export default function Header() {
  // Extracting currentUser from Redux store state
  const { currentUser } = useSelector((state) => state.user);

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
