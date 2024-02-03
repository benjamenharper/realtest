import { ImFacebook2 } from "react-icons/im";
import { SiInstagram } from "react-icons/si";
import { FaYoutube } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

export default function Footer() {
  const { currentUser } = useSelector((state) => state.user);

  console.log(currentUser);

  return (
    <footer className="bg-slate-200 shadow-md ">
      <div className="flex justify-between items-center max-w-6xl mx-auto p-6">
        <Link to="/">
          <h1 className="font-bold text-sm sm:text-xl flex flex-wrap ">
            <span className="text-slate-700">Elite&nbsp;Estate&nbsp;</span>
            <span className="text-blue-600">Solutions</span>
          </h1>
        </Link>
        <ul className="flex gap-4 flex-col">
          <Link to="/">
            <li className="  text-slate-700 hover:text-blue-500  duration-200 font-bold cursor-pointer">
              Home
            </li>
          </Link>
          <Link to="/about">
            <li className=" text-slate-700 duration-200 hover:text-blue-500 font-bold cursor-pointer">
              About
            </li>
          </Link>
          <Link to="/profile">
            {currentUser ? (
              <li className="sm:inline text-slate-700 duration-200 hover:text-blue-500 font-bold cursor-pointer">
                Profile
              </li>
            ) : (
              <li className="sm:inline text-slate-700 duration-200 hover:text-blue-500 font-bold cursor-pointer">
                Sign In
              </li>
            )}
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
