import { useState, useEffect } from "react";
import useAuth from "./useAuth";
import {
  Container,
  Dropdown,
  ListGroup,
  Image,
  ProgressBar,
} from "react-bootstrap";
import SpotifyWebApi from "spotify-web-api-node";

const spotifyApi = new SpotifyWebApi({
  clientId: "b800373be0064164ad72643d31336b90",
});

export default function Dashboard({ code }) {
  const accessToken = useAuth(code);
  const [playlists, setPlaylists] = useState([]);
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [tracks, setTracks] = useState([]); // Store playlist tracks
  const [loading, setLoading] = useState(false); // Loading state

  useEffect(() => {
    if (!accessToken) return;
    spotifyApi.setAccessToken(accessToken);
  }, [accessToken]);

  useEffect(() => {
    if (!accessToken) return;
    spotifyApi.getUserPlaylists().then((data) => {
      setPlaylists(data.body.items);
      console.log("User Playlists:", data.body.items);
    });
  }, [accessToken]);

  useEffect(() => {
    if (!selectedPlaylist) return;
    console.log("Selected Playlist:", selectedPlaylist);

    let allTracks = [];
    let offset = 0;
    const limit = 100;

    const fetchTracks = async () => {
      setLoading(true); // Start loading

      try {
        let response = await spotifyApi.getPlaylistTracks(selectedPlaylist.id, {
          limit,
          offset,
        });

        allTracks = [
          ...allTracks,
          ...response.body.items.map((item) => item.track),
        ];

        // Continue fetching if there are more tracks
        while (response.body.next) {
          offset += limit;
          response = await spotifyApi.getPlaylistTracks(selectedPlaylist.id, {
            limit,
            offset,
          });

          allTracks = [
            ...allTracks,
            ...response.body.items.map((item) => item.track),
          ];
        }

        setTracks(allTracks);
        console.log("All Playlist Tracks (track key only):", allTracks);
      } catch (error) {
        console.error("Error fetching tracks:", error);
      } finally {
        setLoading(false); // Stop loading after tracks are fetched
      }
    };

    fetchTracks();
  }, [selectedPlaylist]);

  return (
    <Container
      className="d-flex flex-column align-items-center py-2"
      style={{ height: "100vh" }}
    >
      <Dropdown>
        <Dropdown.Toggle variant="success" id="dropdown-basic">
          {selectedPlaylist ? selectedPlaylist.name : "Select a Playlist"}
        </Dropdown.Toggle>

        <Dropdown.Menu>
          {playlists.map((playlist) => (
            <Dropdown.Item
              key={playlist.id}
              onClick={() => setSelectedPlaylist(playlist)}
            >
              {playlist.name}
            </Dropdown.Item>
          ))}
        </Dropdown.Menu>
      </Dropdown>

      {selectedPlaylist && (
        <div className="mt-3 text-center">
          <h5>Selected Playlist: {selectedPlaylist.name}</h5>
          <p>
            <a
              href={selectedPlaylist.external_urls.spotify}
              target="_blank"
              rel="noopener noreferrer"
            >
              Open in Spotify
            </a>
          </p>

          {/* Show loading bar while fetching tracks */}
          {loading ? (
            <ProgressBar animated now={100} label="Loading tracks..." />
          ) : tracks.length === 0 ? (
            // Show message if no tracks in the playlist
            <p>No tracks in this playlist.</p>
          ) : (
            <ListGroup style={{ maxWidth: "500px" }}>
              {tracks.map((track, index) => {
                const albumImage =
                  track.album.images.length > 0
                    ? track.album.images[0].url
                    : "https://via.placeholder.com/64"; // Fallback image

                return (
                  <ListGroup.Item key={track.id || index} className="d-flex">
                    <Image
                      src={albumImage}
                      alt={track.name}
                      width="50"
                      height="50"
                      className="me-3 rounded"
                    />
                    <div>
                      <strong>{track.name}</strong>
                      <br />
                      <small>
                        {track.artists.map((artist) => artist.name).join(", ")}
                      </small>
                    </div>
                  </ListGroup.Item>
                );
              })}
            </ListGroup>
          )}
        </div>
      )}
    </Container>
  );
}
