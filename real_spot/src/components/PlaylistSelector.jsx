import useSpotify from "../hooks/useSpotify";
import styles from "./PlaylistSelector.module.css";
import LoadingSpinner from "./LoadingSpinner";

const PlaylistSelector = ({ accessToken, onConfirm }) => {
  const {
    tracks,
    playlists,
    selectedPlaylists,
    isLoading,
    handlePlaylistSelection,
    confirmSelection,
    clearSelection,
  } = useSpotify(accessToken);

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className={styles.playlistContainer}>
      <div className={styles.buttonContainer}>
        <button
          onClick={clearSelection}
          className={`${styles.button} ${styles.buttonPrimary}`}
        >
          Clear
        </button>
      </div>
      <h5 className={styles.sectionTitle}>Select Playlists:</h5>
      <div className={styles.playlistList}>
        {playlists.map((playlist) => (
          <div
            key={playlist.id}
            className={styles.playlistItem}
            onClick={() => handlePlaylistSelection(playlist)}
            tabIndex="0"
            onKeyDown={(event) =>
              event.key === "Enter" && handlePlaylistSelection(playlist)
            }
          >
            <input
              type="checkbox"
              checked={selectedPlaylists.some((p) => p.id === playlist.id)}
              readOnly
              className={styles.checkbox}
            />
            <label className={styles.playlistLabel}>
              <strong>{playlist.name}</strong> Tracks: {playlist.tracks.total}
            </label>
          </div>
        ))}
      </div>
      <div className={styles.buttonContainer}>
        <button
          onClick={() => {
            confirmSelection();
            onConfirm(selectedPlaylists, tracks);
          }}
          className={`${styles.button} ${styles.buttonPrimary}`}
        >
          Confirm Selection
        </button>
      </div>
    </div>
  );
};

export default PlaylistSelector;
