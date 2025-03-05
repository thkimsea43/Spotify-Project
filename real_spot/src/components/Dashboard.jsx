import { Container, Dropdown } from "react-bootstrap";
import { useState } from "react";
import useAuth from "../hooks/useAuth";
import useSpotify from "../hooks/useSpotify";
import PlaylistSelector from "./PlaylistSelector";
import TrackList from "./TrackList";
import CreatePlaylist from "./CreatePlaylist";
import styles from "./Dashboard.module.css";

export default function Dashboard({ code }) {
  const accessToken = useAuth(code);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showPlaylists, setShowPlaylists] = useState(true);

  const {
    playlists,
    selectedPlaylists,
    setSelectedPlaylists,
    tracks,
    fetchTracks,
    isLoading,
  } = useSpotify(accessToken);

  const handleConfirm = (selectedPlaylistsData) => {
    setSelectedPlaylists(selectedPlaylistsData); // Update useSpotify's state
    setShowPlaylists(false); // Hide PlaylistSelector after confirming
  };

  return (
    <Container className={styles.container}>
      <div className="mt-3">
        <button
          onClick={() => setShowDropdown(!showDropdown)}
          className={`${styles.button} ${
            showDropdown ? styles.buttonActive : styles.buttonPrimary
          }`}
        >
          {showDropdown ? "Hide Playlist Selection" : "Create Playlist"}
        </button>
      </div>

      {showDropdown && showPlaylists && (
        <div className="mt-3">
          <PlaylistSelector playlists={playlists} onConfirm={handleConfirm} />
        </div>
      )}

      {!showPlaylists && (
        <>
          <div className="mt-3">
            <strong>Selected Playlists:</strong>{" "}
            {selectedPlaylists.map((playlist) => playlist.name).join(", ")}
          </div>
        </>
      )}
    </Container>
  );
}
