import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import { app } from "../firebase";
import { useDispatch } from "react-redux";
import { signInSuccess } from "../../redux/user/userSlice";
import { useNavigate } from "react-router-dom";

export default function Oath() {
  // Dispatch hook for Redux
  const dispatch = useDispatch();
  // Navigate hook for routing
  const navigate = useNavigate();

  // Function to handle Google OAuth sign-in
  const handleGoogleClick = async () => {
    try {
      // Create Google auth provider instance
      const provider = new GoogleAuthProvider();
      // Get Firebase auth instance
      const auth = getAuth(app);

      // Sign in with Google popup
      const result = await signInWithPopup(auth, provider);
      // Send user data to backend for authentication
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/auth/google`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: result.user.displayName,
            email: result.user.email,
            photo: result.user.photoURL,
          }),
        }
      );
      const data = await res.json();
      // Dispatch Redux action to update user state
      dispatch(signInSuccess(data));
      navigate("/");
    } catch (error) {
      console.log(`Couldn't sign in with Google ${error}`);
    }
  };
  return (
    <button
      onClick={handleGoogleClick}
      type="button"
      className=" bg-red-700 text-white p-3 rounded-lg uppercase hover:opacity-90"
    >
      Continue with google
    </button>
  );
}
