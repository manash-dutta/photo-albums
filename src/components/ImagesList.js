import { useState, useEffect } from "react";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import db from "../firebase.config";
import ImageForm from "./ImageForm";
import styles from "./Styles.module.css";

export default function ImagesList({ album, onBack }) {
  const [images, setImages] = useState([]);
  const [showForm, setShowForm] = useState(false);

  const toggleForm = () => {
    setShowForm((prevShowForm) => !prevShowForm);
  };

  // Fetch images for the selected album
  useEffect(() => {
    const imagesRef = collection(db, "images");
    const q = query(imagesRef, where("albumId", "==", album.id));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const imagesData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setImages(imagesData);
    });

    return () => unsubscribe();
  }, [album.id]);

  return (
    <main>
      {showForm && <ImageForm album={album} />}
      <div className={styles.container}>
        <div className={styles.headingContainer}>
          <div className={styles.headingItem}>
            <button onClick={onBack}>Back</button>
            <h3>Images in {album.name}</h3>
          </div>
          <div>
            <button onClick={toggleForm}>
              {showForm ? "Cancel" : "Add image"}
            </button>
          </div>
        </div>

        <div className={styles.gridContainer}>
          {images.length > 0 ? (
            images.map((image) => (
              <div className={styles.gridItem}>
                <img key={image.id} src={image.url} alt={image.name} />
                <span className={styles.caption}>{image.name}</span>
              </div>
            ))
          ) : (
            <p>No images available</p>
          )}
        </div>
      </div>
    </main>
  );
}
