import { ImFacebook2 } from "react-icons/im";
import { SiInstagram } from "react-icons/si";
import { FaYoutube } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

export default function Footer() {
  // Extracting currentUser from Redux store state
  const { currentUser } = useSelector((state) => state.user);

  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="max-w-6xl mx-auto py-8 px-6">
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
                <Link to="/" className="text-gray-600 hover:text-blue-600 text-sm">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-600 hover:text-blue-600 text-sm">
                  About
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
          <p>&copy; {new Date().getFullYear()} Hawaii Elite Real Estate. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
