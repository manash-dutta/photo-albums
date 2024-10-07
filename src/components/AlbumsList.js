import { useState, useEffect } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import Spinner from "react-spinner-material";
import db from "../firebase.config";
import styles from "./Styles.module.css";
import AlbumForm from "./AlbumForm";
import ImagesList from "./ImagesList";
import cover from "../assets/gallery.png";

export default function AlbumList() {
  const [showForm, setShowForm] = useState(false);
  const [albums, setAlbums] = useState([]);
  const [selectedAlbum, setSelectedAlbum] = useState(null);

  const toggleForm = () => {
    setShowForm((prevShowForm) => !prevShowForm);
  };

  useEffect(() => {
    const albumRef = collection(db, "albums");
    const unsub = onSnapshot(albumRef, (snapshot) => {
      const albums = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setAlbums(albums);
    });
    // Cleanup listener when the component unmounts
    return () => unsub();
  }, []);

  // Function to go back to the album list from the ImagesList component
  const handleBack = () => {
    setSelectedAlbum(null);
  };

  return (
    <main>
      {selectedAlbum ? (
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
                <Spinner
                  radius={120}
                  color={"#333"}
                  stroke={2}
                  visible={true}
                />
              )}
            </div>
          </div>
        </>
      )}
    </main>
  );
}
