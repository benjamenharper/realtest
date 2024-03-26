import { FaSearch } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";

export default function Header() {
  const { currentUser } = useSelector((state) => state.user);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set("searchTerm", searchTerm);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get("searchTerm");
    if (searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl);
    }
  }, [location.search]);

  return (
    <header className="bg-slate-200 shadow-md  shadow-slate-500">
      <div className="flex justify-between items-center max-w-6xl mx-auto p-6">
        <Link to="/">
          <h1 className="font-bold text-sm sm:text-xl flex flex-wrap ">
            <span className="text-slate-700">Elite&nbsp;Estate&nbsp;</span>
            <span className="text-blue-600">Solutions</span>
          </h1>
        </Link>

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
          <button className="bg-blue-50">
            <FaSearch className="text-slate-600  " />
          </button>
        </form>
        <ul className="flex gap-1 md:gap-4 ">
          <Link to="/">
            <li className="hidden sm:inline rounded-full bg-slate-700 duration-200 hover:bg-blue-600 px-3 py-1 text-white cursor-pointer">
              Home
            </li>
          </Link>
          <Link to="/about">
            <li className="hidden sm:inline rounded-full bg-slate-700 duration-200 hover:bg-blue-600 px-3 py-1 text-white cursor-pointer">
              About
            </li>
          </Link>
          <Link to="/profile">
            {currentUser ? (
              <img
                className=" rounded-full ml-6 h-8 w-8 object-cover"
                src={currentUser.avatar}
                alt="avatar"
              />
            ) : (
              <li className="text-[12px] w-[60px] sm:text-[16px] sm:inline rounded-full bg-slate-700 duration-200 hover:bg-blue-600 px-3 py-1 text-white cursor-pointer">
                Sign In
              </li>
            )}
          </Link>
        </ul>
      </div>
    </header>
  );
}
