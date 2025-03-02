import { ListGroup, Image } from "react-bootstrap";
import LoadingSpinner from "../components/LoadingSpinner";
import { formatTracks } from "../utils/spotifyUtils";

const TrackList = ({ tracks, isLoading }) => {
  if (isLoading) return <LoadingSpinner />;

  const formattedTracks = formatTracks(tracks);

  return (
    <ListGroup style={{ maxWidth: "500px" }}>
      {formattedTracks.length === 0 ? (
        <p className="text-center mt-3">No tracks found in this playlist.</p>
      ) : (
        formattedTracks.map((track, index) => (
          <ListGroup.Item
            key={track.id || index}
            className="d-flex align-items-center"
          >
            <Image
              src={track.albumImage}
              alt={track.name}
              width="50"
              height="50"
              className="me-3 rounded"
            />
            <div>
              <strong>{track.name}</strong>
              <br />
              <small>{track.artists}</small>
            </div>
          </ListGroup.Item>
        ))
      )}
    </ListGroup>
  );
};

export default TrackList;
