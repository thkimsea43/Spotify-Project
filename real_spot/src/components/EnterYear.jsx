import { useState } from "react";

const EnterYear = ({ onCreatePlaylist, onAddToPlaylist }) => {
  const [year, setYear] = useState("");
  const [confirmedValue, setConfirmedValue] = useState("");

  const handleInputChange = (event) => {
    setYear(event.target.value);
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      setConfirmedValue(year); // Confirm the value
      onCreatePlaylist(year); // Trigger the playlist creation with the year
      onAddToPlaylist(year); // Trigger the playlist addition with the year
    }
  };

  // Handler to confirm the input value when clicking "Next"
  const handleNextClick = () => {
    setConfirmedValue(year); // Confirm the value
    onCreatePlaylist(year); // Trigger the playlist creation with the year
    onAddToPlaylist(year); // Trigger the playlist addition with the year
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

      <p>You entered: {confirmedValue}</p>
    </div>
  );
};

export default EnterYear;
