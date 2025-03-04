import { Container, Dropdown } from "react-bootstrap";
import { useState } from "react";
import useAuth from "../hooks/useAuth";
import useSpotify from "../hooks/useSpotify";
import TrackList from "./TrackList";
import CreatePlaylist from "./CreatePlaylist";
import styles from "./Dashboard.module.css"; // Import the module

export default function Dashboard({ code }) {
  const accessToken = useAuth(code);
  const [showDropdown, setShowDropdown] = useState(false);
  const {
    playlists,
    selectedPlaylist,
    setSelectedPlaylist,
    tracks,
    fetchTracks,
    isLoading,
  } = useSpotify(accessToken);

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

      {showDropdown && (
        <div className="mt-3">
          <Dropdown>
            <Dropdown.Toggle variant="success" id="dropdown-basic">
              {selectedPlaylist ? selectedPlaylist.name : "Select a Playlist"}
            </Dropdown.Toggle>

            <Dropdown.Menu>
              {playlists.map((playlist) => (
                <Dropdown.Item
                  key={playlist.id}
                  onClick={() => {
                    setSelectedPlaylist(playlist);
                    fetchTracks(playlist.id);
                  }}
                >
                  {playlist.name}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>
        </div>
      )}

      {selectedPlaylist && (
        <>
          <br />
          <div className="d-flex flex-column align-items-center p-4 bg-light rounded shadow">
            <CreatePlaylist
              tracks={tracks}
              selectedPlaylist={selectedPlaylist}
            />
          </div>

          <div className="mt-3">
            <a
              href={selectedPlaylist.external_urls.spotify}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3"
            >
              Open in Spotify
            </a>
          </div>
          <div className="mt-3">
            <TrackList tracks={tracks} isLoading={isLoading} />
          </div>
        </>
      )}
    </Container>
  );
}
