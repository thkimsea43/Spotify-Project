import { useState } from "react";
import useSpotify from "../hooks/useSpotify";
import { getSongs } from "../utils/spotifyUtils";

const CreatePlaylist = ({ tracks, selectedPlaylist }) => {
  const { createPlaylist } = useSpotify();

  const [year, setYear] = useState("");
  const [confirmedValue, setConfirmedValue] = useState("");

  const handleInputChange = (event) => {
    setYear(event.target.value);
  };

  const onCreatePlaylist = (year, tracks) => {
    if (year) {
      // You can create a new playlist with the year entered by the user
      const songs = getSongs(year, tracks);
      console.log(songs);
      createPlaylist(year, songs, selectedPlaylist);
    }
  };

  const confirmYearAndCreatePlaylist = () => {
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

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      confirmYearAndCreatePlaylist();
    }
  };

  const handleNextClick = () => {
    confirmYearAndCreatePlaylist();
  };

  return (
    <div>
      <label htmlFor="inputField">Enter Year:</label>
      <input
        id="inputField"
        type="text"
        value={year}
        onChange={handleInputChange}
        onKeyDown={handleKeyPress}
      />
      <button onClick={handleNextClick}>Next</button>
    </div>
  );
};

export default CreatePlaylist;
