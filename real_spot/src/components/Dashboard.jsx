import { Container, Dropdown } from "react-bootstrap";
import useAuth from "../hooks/useAuth";
import useSpotify from "../hooks/useSpotify";
import TrackList from "./Tracklist";
import EnterYear from "./EnterYear";

export default function Dashboard({ code }) {
  const accessToken = useAuth(code);
  const {
    playlists,
    selectedPlaylist,
    setSelectedPlaylist,
    tracks,
    fetchTracks,
    isLoading,
    createPlaylist,
    addToPlaylist,
    newPlaylistID,
  } = useSpotify(accessToken);

  // Function to handle the playlist creation based on year
  const handleCreatePlaylist = (year) => {
    if (year) {
      // You can create a new playlist with the year entered
      createPlaylist(`${year}`, year); // Modify `createPlaylist` to accept year
    }
  };

  const handleAddToPlaylist = (playlist) => {
    if (selectedPlaylist && accessToken) {
      addToPlaylist(newPlaylistID, [tracks.uri]);
    }
  };

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
              onClick={() => {
                console.log(playlist.id);
                setSelectedPlaylist(playlist);
                fetchTracks(playlist.id);
              }}
            >
              {playlist.name}
            </Dropdown.Item>
          ))}
        </Dropdown.Menu>
      </Dropdown>

      {selectedPlaylist && (
        <>
          <br></br>
          <EnterYear
            onCreatePlaylist={handleCreatePlaylist}
            onAddToPlaylist={handleAddToPlaylist}
          />
          <a
            href={selectedPlaylist.external_urls.spotify}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3"
          >
            Open in Spotify
          </a>
          <TrackList tracks={tracks} isLoading={isLoading} />
        </>
      )}
    </Container>
  );
}
