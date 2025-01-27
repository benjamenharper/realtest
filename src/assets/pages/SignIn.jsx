import { useState } from "react";
import { FaArrowAltCircleRight } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

// Redux actions
import {
  signInStart,
  signInSuccess,
  signInFailure,
} from "../../redux/user/userSlice";

// OAuth component
import Oath from "../components/Oath";

export default function SignIn() {
  // State variables
  const [formData, setFormData] = useState({});
  const { loading, error } = useSelector((state) => state.user);
  const navigate = useNavigate();

  // Function to handle form input change
  const dispatch = useDispatch();
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(signInStart());
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/auth/signIn`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );
      const data = await res.json();

      if (data.success === false) {
        dispatch(signInFailure(data.message));
        return;
      }
      dispatch(signInSuccess(data));
      navigate("/");
    } catch (error) {
      dispatch(signInFailure(error.message));
    }
  };

  return (
    <div className="p-3 max-w-lg mx-auto min-h-[80vh]">
      <h1 className="text-3xl text-center font-bold my-7 ">Sign In</h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="email"
          className="border p-3 rounded-lg focus:outline-none "
          id="email"
          onChange={handleChange}
        />
        <input
          type="password"
          placeholder="password"
          className="border p-3 rounded-lg focus:outline-none"
          id="password"
          autoComplete="on"
          onChange={handleChange}
        />
        <button
          disabled={loading}
          className=" bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-90 disabled:opacity-80"
        >
          {loading ? "Loading..." : "sign In"}
        </button>
        <Oath />
      </form>
      <div className="flex gap-2 mt-5">
        <p>{`Don't have an account?`}</p>
        <Link to="/sign-up" className="flex justify-center items-center gap-2">
          <FaArrowAltCircleRight className="text-blue-700 hover:font-bold" />
          <span className=" text-blue-700 hover:font-bold ">Sing up</span>
        </Link>
      </div>
      {error && <p className=" text-red-500 mt-500">Incorrect Credentials</p>}
    </div>
  );
}
