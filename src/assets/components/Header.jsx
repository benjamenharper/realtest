import { FaPhone, FaHome } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import IslandsDropdown from './IslandsDropdown';

export default function Header() {
  const { currentUser } = useSelector((state) => state.user);

  return (
    <header className="bg-white border-b border-gray-100">
      <div className="flex justify-between items-center max-w-6xl mx-auto p-3">
        <div className="flex items-center gap-8">
          <Link to="/">
            <h1 className="font-bold text-sm sm:text-xl flex flex-wrap items-center">
              <span className="text-gray-800">Hawaii Elite</span>
              <FaHome className="mx-2 text-gray-800" />
              <span className="text-gray-800">Real Estate</span>
            </h1>
          </Link>
          <div className="hidden lg:flex items-center text-slate-500 gap-2">
            <FaPhone className="text-sm" />
            <span className="text-sm">808-866-6593</span>
          </div>
        </div>

        <div className="flex gap-6 items-center">
          <IslandsDropdown />
          <Link to="/properties" className="hidden sm:inline text-slate-600 hover:text-gray-800">
            Properties
          </Link>
          <Link to="/services" className="hidden sm:inline text-slate-600 hover:text-gray-800">
            Services
          </Link>
          <Link to="/blog" className="hidden sm:inline text-slate-600 hover:text-gray-800">
            News
          </Link>
          {currentUser && (
            <Link to="/profile">
              <img
                className="rounded-full h-7 w-7 object-cover"
                src={currentUser.avatar}
                alt="profile"
              />
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
