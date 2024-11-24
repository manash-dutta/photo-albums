import { useState, useEffect } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import db from "../config/firebase.config";
import styles from "./Styles.module.css";
import AlbumForm from "./AlbumForm";
import ImagesList from "./ImagesList";
import cover from "../assets/gallery.png";
import spinner from "../assets/loading_spinner.svg";

export default function AlbumList() {
  const [showForm, setShowForm] = useState(false);
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAlbum, setSelectedAlbum] = useState(null);

  const toggleForm = () => {
    setShowForm((prevShowForm) => !prevShowForm);
  };

  useEffect(() => {
    setLoading(true);
    const albumRef = collection(db, "albums");
    const unsubscribe = onSnapshot(albumRef, (snapshot) => {
      const albums = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setAlbums(albums);
      setLoading(false);
    });
    // Cleanup listener when the component unmounts
    return () => unsubscribe();
  }, []);

  // Function to go back to the album list from the ImagesList component
  const handleBack = () => {
    setSelectedAlbum(null);
  };

  return (
    <main>
      {loading ? (
        <div className={styles.loading}>
          <img src={spinner} alt="Loading" />
        </div>
      ) : selectedAlbum ? (
        <ImagesList album={selectedAlbum} onBack={handleBack} />
      ) : (
        <>
          {showForm && <AlbumForm />}
          <div className={styles.container}>
            <div className={styles.headingContainer}>
              <h2>Your Albums</h2>
              <button onClick={toggleForm}>
                {showForm ? "Cancel" : "Add Album"}
              </button>
            </div>
            <div className={styles.gridContainer}>
              {albums.length > 0 ? (
                albums.map((album) => (
                  <div
                    key={album.id}
                    className={styles.gridItem}
                    onClick={() => setSelectedAlbum(album)}
                  >
                    <img
                      src={cover}
                      alt={album.name}
                      style={{ height: "120px", objectFit: "contain" }}
                    />
                    <span className={styles.caption}>{album.name}</span>
                  </div>
                ))
              ) : (
                <div className={styles.noContent}>
                  <h3>No Images in this Album</h3>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </main>
  );
}
