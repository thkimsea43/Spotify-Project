import { useState } from "react";
import useAuth from "../hooks/useAuth";
import useSpotify from "../hooks/useSpotify";

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

      createPlaylist(
        year,
        tracks.map((track) => track.uri)
      );
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      setConfirmedValue(year); // Confirm the value
      onCreatePlaylist(year, tracks); // Trigger the playlist creation with the year
    }
  };

  // Handler to confirm the input value when clicking "Next"
  const handleNextClick = () => {
    setConfirmedValue(year); // Confirm the value
    onCreatePlaylist(year, tracks); // Trigger the playlist creation with the year
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
