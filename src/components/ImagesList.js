import { useState, useEffect } from "react";
import {
  doc,
  collection,
  query,
  where,
  onSnapshot,
  deleteDoc,
} from "firebase/firestore";
import { toast } from "react-toastify";
import db from "../config/firebase.config";
import ImageForm from "./ImageForm";
import Carousel from "./Carousel";
import styles from "./Styles.module.css";
import spinner from "../assets/loading_spinner.svg";
import backIcon from "../assets/back.png";
import editIcon from "../assets/edit.png";
import deleteIcon from "../assets/delete.png";

export default function ImagesList({ album, onBack }) {
  const [images, setImages] = useState([]);
  const [filteredImages, setFilteredImages] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingImage, setEditingImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showCarousel, setShowCarousel] = useState(false);
  const [carouselIndex, setCarouselIndex] = useState(0);

  const toggleForm = () => {
    setShowForm((prevShowForm) => !prevShowForm);
  };

  // Fetch images for the selected album
  useEffect(() => {
    setLoading(true);
    const imagesRef = collection(db, "images");
    const q = query(imagesRef, where("albumId", "==", album.id));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const imagesData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setImages(imagesData);
      setFilteredImages(imagesData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [album.id]);

  // Filter images by name based on the search query
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredImages(images);
    } else {
      const filtered = images.filter((image) =>
        image.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredImages(filtered);
    }
  }, [searchQuery, images]);

  // Handle opening the carousel
  const openCarousel = (index) => {
    setCarouselIndex(index);
    setShowCarousel(true);
  };

  // Handle closing the carousel
  const closeCarousel = () => {
    setShowCarousel(false);
  };

  // Handle editing an image
  const handleEdit = (image) => {
    setEditingImage(image);
    setShowForm(true);
  };

  // Handle deleting an image
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this image?"
    );
    if (confirmDelete) {
      try {
        const imageDoc = doc(db, "images", id);
        await deleteDoc(imageDoc);
        toast.success("Image deleted successfully!")
      } catch (error) {
        toast.error("Unable to delete image at this time!")
        console.error("Error deleting image: ", error);
      }
    }
  };

  return (
    <main>
      {showForm && (
        <ImageForm
          album={album}
          editingImage={editingImage}
          setShowForm={setShowForm}
        />
      )}
      {showCarousel && (
        <Carousel
          images={filteredImages}
          initialIndex={carouselIndex}
          onClose={closeCarousel}
        />
      )}
      <div className={styles.container}>
        <div className={styles.headingContainer}>
          <div className={styles.headingItem}>
            <button
              onClick={onBack}
              style={{
                height: "50px",
                width: "50px",
                borderRadius: "50%",
                display: "flex",
                justifyContent: "center",
              }}
            >
              <img src={backIcon} alt="Back" style={{ height: "30px" }} />
            </button>
            <h3>Images in {album.name}</h3>
          </div>
          <div className={styles.headingItem}>
            <input
              type="text"
              placeholder="Search images..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button onClick={toggleForm}>
              {showForm ? "Cancel" : "Add image"}
            </button>
          </div>
        </div>

        <div className={styles.gridContainer}>
          {loading ? (
            <div className={styles.loading}>
              <img src={spinner} alt="Loading" />
            </div>
          ) : filteredImages.length > 0 ? (
            filteredImages.map((image, index) => (
              <div className={styles.gridItem} key={image.id}>
                <div className={styles.iconContainer}>
                  <img
                    src={editIcon}
                    alt="Edit"
                    className={styles.icon}
                    style={{ height: "34px" }}
                    onClick={() => handleEdit(image)}
                  />
                  <img
                    src={deleteIcon}
                    alt="Delete"
                    className={styles.icon}
                    style={{ height: "34px" }}
                    onClick={() => handleDelete(image.id)}
                  />
                </div>
                <img
                  src={image.url}
                  alt={image.name}
                  onClick={() => openCarousel(index)}
                  style={{ cursor: "pointer" }} // Make image clickable
                />
                <span className={styles.caption}>{image.name}</span>
              </div>
            ))
          ) : (
            <div className={styles.noContent}>
              <h3>No Images in this Album</h3>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
