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
    console.log("Selected Playlists:", selectedPlaylistsData);
    setShowPlaylists(false); // Hide PlaylistSelector after confirming
    fetchTracks(selectedPlaylistsData); // Fetch tracks for the first selected playlist
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
          <br />

          <div className="d-flex flex-column align-items-center p-4 bg-light rounded shadow">
            <CreatePlaylist
              tracks={tracks}
              selectedPlaylists={selectedPlaylists}
            />
          </div>

          <div className="mt-3">
            <TrackList tracks={tracks} isLoading={isLoading} />
          </div>
        </>
      )}
    </Container>
  );
}
