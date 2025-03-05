import { useState } from "react";
import styles from "./Dashboard.module.css";

const PlaylistSelector = ({ playlists, onConfirm }) => {
  const [selectedPlaylists, setSelectedPlaylists] = useState([]);

  const handleCheckboxChange = (playlist) => {
    setSelectedPlaylists(
      (prevSelected) =>
        prevSelected.some((p) => p.id === playlist.id)
          ? prevSelected.filter((p) => p.id !== playlist.id) // Remove if already selected
          : [...prevSelected, playlist] // Add if not selected
    );
  };

  const handleConfirm = () => {
    onConfirm(selectedPlaylists); // Pass selected playlists to Dashboard
    // setSelectedPlaylists([]); // Clear UI selection
  };

  return (
    <div>
      <h5>Select Playlists:</h5>
      {playlists.map((playlist) => (
        <div key={playlist.id}>
          <input
            type="checkbox"
            id={playlist.id}
            checked={selectedPlaylists.some((p) => p.id === playlist.id)}
            onChange={() => handleCheckboxChange(playlist)}
          />
          <label htmlFor={playlist.id}>{playlist.name}</label>
        </div>
      ))}
      <button onClick={handleConfirm} className={`${styles.button} `}>
        Confirm Selection
      </button>
    </div>
  );
};

export default PlaylistSelector;
