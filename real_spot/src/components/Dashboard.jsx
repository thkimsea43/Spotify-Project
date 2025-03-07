import { Container } from "react-bootstrap";
import { useState, useEffect } from "react";
import useAuth from "../hooks/useAuth";
import useSpotify from "../hooks/useSpotify";
import PlaylistSelector from "./PlaylistSelector";
import TrackList from "./TrackList";
import CreatePlaylist from "./CreatePlaylist";
import styles from "./Dashboard.module.css";

export default function Dashboard({ code }) {
  const accessToken = useAuth(code);
  const [showPlaylists, setShowPlaylists] = useState(true);
  const [showTrackList, setShowTrackList] = useState(false);

  const {
    playlists,
    selectedPlaylists,
    setSelectedPlaylists,
    tracks,
    setTracks,
    isLoading,
  } = useSpotify(accessToken);

  const handleConfirm = (selectedPlaylists, tracks) => {
    setSelectedPlaylists(selectedPlaylists); // Update useSpotify's state
    setTracks(tracks);
    console.log("Selected Playlists:", selectedPlaylists);
    setShowPlaylists(false); // Hide PlaylistSelector after confirming
    setShowTrackList(true); // Show TrackList after confirming playlist selection
  };

  return (
    <Container className={styles.container}>
      {showPlaylists && (
        <div className="mt-3">
          <PlaylistSelector
            accessToken={accessToken}
            onConfirm={handleConfirm}
          />
        </div>
      )}

      {!showPlaylists && showTrackList && (
        <>
          <br />
          <div className="d-flex flex-column align-items-center p-4 bg-light rounded shadow">
            <CreatePlaylist tracks={tracks} />
          </div>

          <div className="mt-3">
            {isLoading && <p>Fetching tracks, please wait...</p>}
            <TrackList tracks={tracks} />
          </div>
        </>
      )}
    </Container>
  );
}
