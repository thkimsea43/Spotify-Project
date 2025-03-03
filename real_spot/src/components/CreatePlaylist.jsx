import { useState } from "react";
import useSpotify from "../hooks/useSpotify";
import { getSongs } from "../utils/spotifyUtils";

const CreatePlaylist = ({ tracks }) => {
  const { createPlaylist } = useSpotify();

  const [year, setYear] = useState("");
  const [confirmedValue, setConfirmedValue] = useState("");

  const handleInputChange = (event) => {
    setYear(event.target.value);
  };

  const onCreatePlaylist = (year, tracks) => {
    if (year) {
      // You can create a new playlist with the year entered
      console.log(year, tracks);

      const songs = getSongs(year, tracks);
      console.log(songs);
      createPlaylist(year, songs);
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      const currentYear = new Date().getFullYear();
      if (year && year > 1900 && year <= currentYear) {
        setConfirmedValue(year); // Confirm the value only if it's valid
        onCreatePlaylist(year, tracks); // Trigger the playlist creation with the year
      } else {
        console.error(
          "Invalid year. Please enter a valid year between 1900 and the current year."
        );
      }
    }
  };

  // Handler to confirm the input value when clicking "Next"
  const handleNextClick = () => {
    const currentYear = new Date().getFullYear();
    if (year && year > 1900 && year <= currentYear) {
      setConfirmedValue(year); // Confirm the value
      onCreatePlaylist(year, tracks); // Trigger the playlist creation with the year
    } else {
      console.error(
        "Invalid year. Please enter a valid year between 1900 and the current year."
      );
    }
  };

  return (
    <div>
      <label htmlFor="inputField">Enter Year:</label>
      <input
        id="inputField"
        type="text"
        value={year}
        onChange={handleInputChange} // Update input state
        onKeyDown={handleKeyPress} // Check for Enter key press
      />
      <button onClick={handleNextClick}>Next</button>

      {/* <p>You entered: {confirmedValue}</p> */}
    </div>
  );
};

export default CreatePlaylist;
