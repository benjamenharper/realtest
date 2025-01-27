import { ImFacebook2 } from "react-icons/im";
import { SiInstagram } from "react-icons/si";
import { FaYoutube } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

export default function Footer() {
  // Extracting currentUser from Redux store state
  const { currentUser } = useSelector((state) => state.user);

  return (
    <footer className="bg-gray-50">
      <div className="flex justify-between items-center max-w-6xl mx-auto p-6">
        <Link to="/">
          <h1 className="font-bold text-sm sm:text-xl flex flex-wrap items-center">
            <span className="text-slate-700">Hawaii Elite </span>
            <span className="text-blue-600"> Real Estate</span>
          </h1>
        </Link>
        <ul className="flex gap-4 flex-col">
          <Link to="/">
            <li className="text-slate-700 hover:text-blue-600 duration-200 font-medium cursor-pointer">
              Home
            </li>
          </Link>
          <Link to="/about">
            <li className="text-slate-700 hover:text-blue-600 duration-200 font-medium cursor-pointer">
              About
            </li>
          </Link>
          <Link to="/profile">
            <li className="text-slate-700 hover:text-blue-600 duration-200 font-medium cursor-pointer">
              {currentUser ? 'Profile' : 'Sign in'}
            </li>
          </Link>
        </ul>
        <ul className="flex gap-4 flex-col">
          <li className="flex justify-center gap-2 items-center font-bold cursor-pointer ">
            <ImFacebook2 />
            <span>Facebook</span>
          </li>
          <li className="flex justify-center gap-2 items-center font-bold cursor-pointer ">
            <SiInstagram />
            <span>Instagram</span>
          </li>
          <li className="flex justify-center gap-2 items-center font-bold cursor-pointer ">
            <FaYoutube />
            <span>Instagram</span>
          </li>
        </ul>
      </div>
    </footer>
  );
}
