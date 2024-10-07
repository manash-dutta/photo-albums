import { useState, useEffect } from "react";
import { collection, addDoc, doc, updateDoc } from "firebase/firestore";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import db from "../config/firebase.config";
import styles from "./Styles.module.css";

export default function ImageForm({ album, editingImage, setShowForm }) {
  const [imageUrl, setImageUrl] = useState("");
  const [imageName, setImageName] = useState("");

  // Set form fields for editing when editingImage is provided
  useEffect(() => {
    if (editingImage) {
      setImageUrl(editingImage.url);
      setImageName(editingImage.name);
    } else {
      // Reset the form fields if not editing
      setImageUrl("");
      setImageName("");
    }
  }, [editingImage]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (imageUrl.trim() === "" || imageName.trim() === "") {
      toast.error("Both fields are required");
      return;
    }

    try {
      if (editingImage) {
        // Update existing image
        const imageDoc = doc(db, "images", editingImage.id);
        await updateDoc(imageDoc, {
          url: imageUrl,
          name: imageName,
        });
        setShowForm(false);

        toast.success("Image updated successfully!");
      } else {
        // Add new image
        const imagesRef = collection(db, "images");
        await addDoc(imagesRef, {
          albumId: album.id,
          url: imageUrl,
          name: imageName,
          createdAt: new Date(),
        });

        toast.success("Image added successfully!");
      }

      // Clear form fields
      setImageUrl("");
      setImageName("");
    } catch (error) {
      toast.error("Error saving image: ", error);
    }
  };

  const handleClear = (e) => {
    e.preventDefault();
    setImageName("");
    toast.info("Form cleared");
  };

  return (
    <form onSubmit={handleSubmit} className={styles.verticalAlign}>
      <h3>{editingImage ? `Edit Image` : `Add Image to ${album.name}`}</h3>
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
      <div style={{ textAlign: "center" }}>
        <button type="submit">{editingImage ? "Update" : "Add"}</button>
        <button type="button" onClick={handleClear}>
          Clear
        </button>
      </div>
    </form>
  );
}
