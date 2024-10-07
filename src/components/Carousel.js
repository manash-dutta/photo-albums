import { useEffect, useState } from "react";
import styles from "./Styles.module.css";
import closeIcon from "../assets/close.svg";
import nextIcon from "../assets/next.svg";
import prevIcon from "../assets/prev.svg";

export default function Carousel({ images, initialIndex, onClose }) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const handleClickOutside = (event) => {
    if (event.target.classList.contains(styles.carouselModal)) {
      // Close if the user clicks outside the carousel container
      onClose();
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === "Escape") {
      // Close the modal if the Esc key is pressed
      onClose();
    } else if (event.key === "ArrowRight") {
      // Go to the next image on right arrow key press
      handleNext();
    } else if (event.key === "ArrowLeft") {
      // Go to the previous image on left arrow key press
      handlePrev();
    }
  };

  // Add event listeners for clicking outside and pressing keys
  useEffect(() => {
    document.addEventListener("keydown", handleKeyPress);
    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("keydown", handleKeyPress);
      document.removeEventListener("click", handleClickOutside);
    };
  });

  return (
    <div className={styles.carouselModal}>
      <div className={styles.carouselContainer}>
        <button className={styles.closeButton} onClick={onClose}>
          <img src={closeIcon} alt="Close" style={{ height: "30px" }} />
        </button>

        <div className={styles.imageContainer}>
          <img
            src={images[currentIndex].url}
            alt={images[currentIndex].name}
            className={styles.carouselImage}
          />
          <div className={styles.caption}>{images[currentIndex].name}</div>
        </div>

        <button className={styles.prevButton} onClick={handlePrev}>
          <img src={prevIcon} alt="Previous" style={{ height: "40px" }} />
        </button>

        <button className={styles.nextButton} onClick={handleNext}>
          <img src={nextIcon} alt="Next" style={{ height: "40px" }} />
        </button>
      </div>
    </div>
  );
}
