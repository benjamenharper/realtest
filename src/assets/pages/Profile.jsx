import { useSelector } from "react-redux";
import { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaArrowAltCircleRight } from "react-icons/fa";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import {
  updateUserFailure,
  updateUserStart,
  updateUserSuccess,
  deleteUserFailure,
  deleteUserSuccess,
  deleteUserStart,
  signOutUserStart,
  signOutUserSuccess,
  signOutUserFailure,
} from "../../redux/user/userSlice";
import { useDispatch } from "react-redux";

export default function Profile() {
  // Ref for file input
  const fileRef = useRef(null);
  // Redux state selectors
  const { currentUser, loading, error } = useSelector((state) => state.user);
  // State variables
  const [file, setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [showListingsError, setShowListingsError] = useState(false);
  const [showListing, setShowListing] = useState(false);
  const [userListings, setUserListings] = useState([]);

  // Redux dispatch
  const dispatch = useDispatch();

  // Effect for file upload
  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  // Function to handle file upload
  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePerc(Math.round(progress));
      },
      (error) => {
        setFileUploadError(true);
        console.log(error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>
          setFormData({ ...currentUser, avatar: downloadURL })
        );
      }
    );
  };

  // Function to handle form input change
  const handleChange = (e) => {
    setFormData({
      ...currentUser,
      [e.target.id]: e.target.value,
    });
  };

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/user/update/${currentUser._id}`,
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
        dispatch(updateUserFailure(data.message));
        return;
      } else {
        dispatch(updateUserSuccess(data));
        setUpdateSuccess(true);
      }
    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  };

  // Function to handle user deletion
  const handleDeleteUser = async () => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/user/delete/${currentUser._id}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      } else {
        dispatch(deleteUserSuccess(data));
      }
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };

  // Function to handle user sign out
  const handleSignOut = async () => {
    try {
      dispatch(signOutUserStart());
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/auth/signOut`
      );
      const data = await res.json();
      //console.log(data);
      if (data.success === false) {
        dispatch(signOutUserFailure(data.message));
        return;
      }
      dispatch(signOutUserSuccess(data));
    } catch (error) {
      dispatch(signOutUserFailure(error.message));
    }
  };

  // Function to handle showing user listings
  const handleShowListings = async () => {
    setShowListing(!showListing);
    try {
      setShowListingsError(false);
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/user/listings/${currentUser._id}`,
        { credentials: "include" }
      );
      const data = await res.json();
      if (data.success === false) {
        setShowListingsError(true);
        return;
      }
      setUserListings(data);
    } catch (error) {
      setShowListingsError(true);
    }
  };

  // Function to handle listing deletion
  const handleListingDelete = async (listingId) => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/listing/delete/${listingId}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );
      const data = await res.json();
      if (data.success === false) {
        console.log(data.message);
        return;
      }

      setUserListings((prev) =>
        prev.filter((listing) => listing._id !== listingId)
      );
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="p-3 max-w-lg mx-auto bg-red min-h-[80vh]">
      <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <input
          onChange={(e) => setFile(e.target.files[0])}
          type="file"
          ref={fileRef}
          hidden
          accept="image/*"
        />
        <img
          onClick={() => fileRef.current.click()}
          src={formData.avatar || currentUser.avatar}
          alt="profile"
          className="rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2"
        />
        <p className="text-sm self-center">
          {fileUploadError ? (
            <span className="text-red-700">
              Error Image upload (image must be less than 2 mb)
            </span>
          ) : filePerc > 0 && filePerc < 100 ? (
            <span className="text-slate-700">{`Uploading ${filePerc}%`}</span>
          ) : filePerc === 100 ? (
            <span className="text-green-700">Image successfully uploaded!</span>
          ) : (
            ""
          )}
        </p>
        <input
          type="text"
          placeholder="username"
          id="username"
          className="border p-3 rounded-lg focus:outline-none"
          defaultValue={currentUser.username}
          onChange={handleChange}
        />
        <input
          type="email"
          placeholder="email"
          id="email"
          className="border p-3 rounded-lg focus:outline-none"
          defaultValue={currentUser.email}
          onChange={handleChange}
        />
        <input
          type="password"
          placeholder="password"
          id="password"
          className="border p-3 rounded-lg focus:outline-none"
          onChange={handleChange}
        />
        <button
          disabled={loading}
          className="bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80"
        >
          {loading ? "Loading..." : "Update"}
        </button>
        <Link
          className=" bg-green-700 text-white p-3 rounded-lg uppercase text-center hover:opacity-80"
          to="/create-listing"
        >
          Create listing
        </Link>
      </form>
      <div className="flex justify-between mt-5">
        <span
          className="bg-blue-700 w-[49%] text-white p-3 rounded-lg uppercase text-center hover:opacity-80 cursor-pointer"
          onClick={handleDeleteUser}
        >
          Delete account
        </span>
        <span
          onClick={handleSignOut}
          className="bg-blue-700 w-[49%] text-white p-3 rounded-lg uppercase text-center hover:opacity-80 cursor-pointer"
        >
          Sign out
        </span>
      </div>
      <p className=" text-red-700 mt-5">{error ? error : ""}</p>
      <p className=" text-green-700 mt-5">
        {updateSuccess ? "User Updated successfully" : ""}
      </p>
      <button
        onClick={handleShowListings}
        className=" text-green-700 mx-auto flex justify-center gap-2 items-center hover:font-bold"
      >
        <FaArrowAltCircleRight />
        <span>Show Listings</span>
      </button>
      <p className=" text-red-700 mt-5">
        {showListingsError ? "Error showing listing" : ""}
      </p>
      {userListings && userListings.length && showListing ? (
        <div className="flex flex-col gap-4">
          <h1 className="text-center mt-7 text-2xl font-semibold">
            Your Listings
          </h1>
          {userListings.map((listing) => (
            <div
              key={listing._id}
              className="border rounded-lg p-3 flex justify-between items-center gap-4"
            >
              <Link to={`/listing/${listing._id}`}>
                <img
                  src={listing.imageUrls[0]}
                  alt="listing cover"
                  className="h-16 w-16 object-contain"
                />
              </Link>
              <Link
                className="text-slate-700 font-semibold  hover:underline truncate flex-1"
                to={`/listing/${listing._id}`}
              >
                <p>{listing.name}</p>
              </Link>
              <div className="flex flex-col item-center">
                <button
                  onClick={() => handleListingDelete(listing._id)}
                  className="text-red-700 hover:font-bold flex justify-center gap-2 items-center"
                >
                  <FaArrowAltCircleRight />
                  <span>Delete</span>
                </button>
                <Link to={`/update-listing/${listing._id}`}>
                  <button className="text-green-700 hover:font-bold flex justify-center gap-2 items-center">
                    <FaArrowAltCircleRight />
                    <span>Edit</span>
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        ""
      )}
    </div>
  );
}
