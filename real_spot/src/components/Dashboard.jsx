import { Container, Dropdown } from "react-bootstrap";
import useAuth from "../hooks/useAuth";
import useSpotify from "../hooks/useSpotify";
import TrackList from "./TrackList"; // Fix the file name casing
import CreatePlaylist from "./CreatePlaylist";

export default function Dashboard({ code }) {
  const accessToken = useAuth(code);
  const {
    playlists,
    selectedPlaylist,
    setSelectedPlaylist,
    tracks,
    fetchTracks,
    isLoading,
  } = useSpotify(accessToken);

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
          <CreatePlaylist tracks={tracks} />
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
