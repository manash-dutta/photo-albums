import { useState } from "react";
import { collection, query, where, getDocs, addDoc } from "firebase/firestore";
import db from "../config/firebase.config";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function AlbumForm() {
  const [albumName, setAlbumName] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if the album name is empty
    if (albumName.trim() === "") {
      toast.error("Album name cannot be empty");
      return;
    }

    try {
      // Check if the album name already exists in Firestore
      const albumRef = collection(db, "albums");
      const q = query(albumRef, where("name", "==", albumName));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        toast.error("Album name already exists");
        return;
      }

      // Add the album to Firestore
      await addDoc(albumRef, {
        name: albumName,
        createdAt: new Date(),
      });

      setAlbumName("");
      toast.success("Album created successfully!");
    } catch (err) {
      toast.error("Error adding album: " + err.message);
    }
  };

  const handleClear = (e) => {
    e.preventDefault();
    setAlbumName("");
    toast.info("Form cleared");
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <h3>Create an Album</h3>
        <input
          placeholder="Album Name"
          value={albumName}
          onChange={(e) => setAlbumName(e.target.value)}
        />
        <button type="button" onClick={handleClear}>
          Clear
        </button>
        <button type="submit">Create</button>
      </form>
    </div>
  );
}
