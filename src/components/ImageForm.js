import { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import db from "../firebase.config";
import styles from "./Styles.module.css"

export default function ImageForm({ album }) {
  const [imageUrl, setImageUrl] = useState("");
  const [imageName, setImageName] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (imageUrl.trim() === "" || imageName.trim() === "") {
      toast.error("Both fields are required");
      return;
    }

    try {
      const imagesRef = collection(db, "images");
      await addDoc(imagesRef, {
        albumId: album.id,
        url: imageUrl,
        name: imageName,
        createdAt: new Date(),
      });

      setImageUrl("");
      setImageName("");
      toast.success("Image added successfully!");
    } catch (error) {
      toast.error("Error adding image: ", error);
    }
  };

  const handleClear = (e) => {
    e.preventDefault();
    setImageName("");
    toast.info("Form cleared");
  };

  return (
    <form onSubmit={handleSubmit} className={styles.verticalAlign}>
      <h3>Add Image to {album.name}</h3>
      <input
        type="text"
        placeholder="Image Name"
        value={imageName}
        onChange={(e) => setImageName(e.target.value)}
      />
      <input
        type="text"
        placeholder="Image URL"
        value={imageUrl}
        onChange={(e) => setImageUrl(e.target.value)}
      />
      <div style={{textAlign: "center"}}>
        <button type="submit">Add</button>
        <button type="button" onClick={handleClear}>Clear</button>
      </div>
    </form>
  );
}
