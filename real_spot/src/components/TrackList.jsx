import { ListGroup, Image } from "react-bootstrap";
import LoadingSpinner from "../components/LoadingSpinner";
import { formatTracks } from "../utils/spotifyUtils";
import styles from "./TrackList.module.css";

const TrackList = ({ tracks, isLoading }) => {
  if (isLoading) return <LoadingSpinner />;

  const formattedTracks = formatTracks(tracks);

  return (
    <ListGroup className={styles.listGroup}>
      {formattedTracks.length === 0 ? (
        <p className={styles.noTracksMessage}>
          No tracks found in this playlist.
        </p>
      ) : (
        formattedTracks.map((track, index) => (
          <ListGroup.Item
            key={track.id || index}
            className={styles.listGroupItem}
          >
            <Image
              src={track.albumImage}
              alt={track.name}
              width="50"
              height="50"
              className={styles.albumImage}
            />
            <div>
              <strong className={styles.trackDetails}>{track.name}</strong>
              <br />
              <small className={styles.trackMeta}>{track.artists}</small>
              <br />
              <small className={styles.trackMeta}>{track.release_date}</small>
            </div>
          </ListGroup.Item>
        ))
      )}
    </ListGroup>
  );
};

export default TrackList;
