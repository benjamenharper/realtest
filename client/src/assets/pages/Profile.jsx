import { useSelector } from "react-redux";
import { useRef, useState, useEffect } from "react";
import { getStorage, ref, uploadBytesResumable } from "firebase/storage";
import app from "../components/firebase";

//firebase storage
// service firebase.storage {
//   match /b/{bucket}/o {
//     match /{allPaths=**} {
//       allow read, write: if
//       request.resource.size < 2 * 1024 * 1024 && request.resource.contentType.matchs('image/.*');
//     }
//   }
// }

export default function Profile() {
  const { currentUser } = useSelector((state) => state.user);
  const fileRef = useRef(null);
  const [file, setFile] = useState(undefined);
  const [filePercentage, setFilePercentage] = useState(0);

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  const handleFileUpload = () => {
    const storage = getStorage(app);
    // It should be unique
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on("state_changed", (snapshot) => {
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      setFilePercentage(progress);
    });
  };

  console.log(file);
  return (
    <div className=" p-3 max-w-lg mx-auto">
      <h1 className=" text-3xl font-semibold text-center my-7">Profile</h1>
      <form className="flex flex-col gap-4">
        <input
          type="file"
          ref={fileRef}
          hidden
          accept="image/*"
          onChange={(e) => {
            setFile(e.target.files[0]);
          }}
        />
        <img
          onClick={() => fileRef.current.click()}
          className=" rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2"
          src={currentUser.avatar}
          alt="avatar"
        />
        <input
          type="text"
          placeholder="Username"
          className=" border p-3 rounded-lg"
          id="username"
        />
        <input
          type="text"
          placeholder="Email"
          className=" border p-3 rounded-lg"
          id="email"
        />
        <input
          type="text"
          placeholder="password"
          className=" border p-3 rounded-lg"
          id="password"
        />
        <button className=" bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-90 disabled:opacity-80">
          update
        </button>
      </form>
      <div className="flex justify-between mt-5">
        <span className=" text-red-700 cursor-pointer">Delete Account</span>
        <span className=" text-red-700 cursor-pointer">Sign Out</span>
      </div>
    </div>
  );
}
