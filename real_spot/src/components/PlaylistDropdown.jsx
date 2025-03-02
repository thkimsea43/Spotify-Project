import { Dropdown } from "react-bootstrap";

const PlaylistDropdown = ({ playlists, onSelect, selectedPlaylist }) => {
  return (
    <Dropdown>
      <Dropdown.Toggle variant="success" id="dropdown-basic">
        {selectedPlaylist ? selectedPlaylist.name : "Select a Playlist"}
      </Dropdown.Toggle>

      <Dropdown.Menu>
        {playlists.map((playlist) => (
          <Dropdown.Item key={playlist.id} onClick={() => onSelect(playlist)}>
            {playlist.name}
          </Dropdown.Item>
        ))}
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default PlaylistDropdown;
