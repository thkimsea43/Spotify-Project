import { useState, useEffect } from "react";
import useSpotify from "../hooks/useSpotify";
import { getSongs } from "../utils/spotifyUtils";
import styles from "./CreatePlaylist.module.css"; // Import the CSS Module

const CreatePlaylist = ({ tracks }) => {
  const { createPlaylist } = useSpotify();

  const [year, setYear] = useState("");
  const [confirmedValue, setConfirmedValue] = useState("");
  const [isHovered, setIsHovered] = useState(false); // Track hover state for button styling

  useEffect(() => {
    console.log("Updated tracks state: Create", tracks);
  }, [tracks]);

  const handleInputChange = (event) => {
    setYear(event.target.value);
  };

  const confirmYearAndCreatePlaylist = () => {
    const currentYear = new Date().getFullYear();
    if (year && year > 1900 && year <= currentYear) {
      setConfirmedValue(year); // Confirm the value

      const songs = getSongs(year, tracks);
      createPlaylist(year, songs);
    } else {
      console.error(
        "Invalid year. Please enter a valid year between 1900 and the current year."
      );
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      confirmYearAndCreatePlaylist();
    }
  };

  const handleNextClick = () => {
    confirmYearAndCreatePlaylist();
  };

  return (
    <div className={styles.buttonContainer}>
      <label htmlFor="inputField">Enter Year:</label>
      <input
        id="inputField"
        type="text"
        value={year}
        onChange={handleInputChange}
        onKeyDown={handleKeyPress}
        className={styles.inputField}
      />
      <button
        onClick={handleNextClick}
        className={`${styles.createButton}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          backgroundColor: isHovered ? styles.createButtonHovered : "#007bff",
        }}
      >
        Create Playlist
      </button>
    </div>
  );
};

export default CreatePlaylist;
