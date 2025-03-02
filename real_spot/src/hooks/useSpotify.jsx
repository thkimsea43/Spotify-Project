import { useState, useEffect } from "react";
import SpotifyWebApi from "spotify-web-api-node";

const spotifyApi = new SpotifyWebApi({
  clientId: "b800373be0064164ad72643d31336b90",
});

const useSpotify = (accessToken) => {
  const [playlists, setPlaylists] = useState([]);
  const [tracks, setTracks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [newPlaylistID, setNewPlaylistID] = useState("");

  useEffect(() => {
    if (!accessToken) return;
    spotifyApi.setAccessToken(accessToken);
    fetchPlaylists();
  }, [accessToken]);

  const fetchPlaylists = async () => {
    try {
      const data = await spotifyApi.getUserPlaylists();
      setPlaylists(data.body.items);
    } catch (error) {
      console.error("Error fetching playlists:", error);
    }
  };

  const fetchTracks = async (playlistId) => {
    setIsLoading(true);
    let allTracks = [];
    let offset = 0;
    const limit = 100;

    try {
      let response = await spotifyApi.getPlaylistTracks(playlistId, {
        limit,
        offset,
      });
      allTracks = [
        ...allTracks,
        ...response.body.items.map((item) => item.track),
      ];

      while (response.body.next) {
        offset += limit;
        response = await spotifyApi.getPlaylistTracks(playlistId, {
          limit,
          offset,
        });
        allTracks = [
          ...allTracks,
          ...response.body.items.map((item) => item.track),
        ];
      }

      setTracks(allTracks);
    } catch (error) {
      console.error("Error fetching tracks:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Create a new playlist based on the year entered
  const createPlaylist = async (playlistName, year) => {
    console.log({ tracks });
    try {
      const data = await spotifyApi.createPlaylist(playlistName, {
        description: `Playlist created for the year ${year}`,
        public: true, // You can change this to true if you want the playlist to be public
      });

      // Add the new playlist to the list of playlists
      setPlaylists((prevPlaylists) => [...prevPlaylists, data.body]);
      setNewPlaylistID(data.body.id); // Store the ID of the newly created playlist
      //   console.log("New playlist created:", data.body, data.body.id);
      //   setSelectedPlaylist(data.body); // Automatically select the newly created playlist
    } catch (error) {
      console.error("Error creating playlist", error);
    }
  };

  const addToPlaylist = async (trackId, playlistId) => {
    try {
      const data = await spotifyApi.addTracksToPlaylist(
        "3GzFhBVfZBflwqkrNs0J6b",
        ["spotify:track:0Cu8JdYvV9DdmzLzhxaZLH"]
      );
    } catch (error) {
      console.error("Error adding track to playlist", error);
    }
  };

  return {
    playlists,
    selectedPlaylist,
    setSelectedPlaylist,
    tracks,
    fetchTracks,
    isLoading,
    createPlaylist, // Expose the createPlaylist function
    newPlaylistID, // Expose the newPlaylistID state
    addToPlaylist, // Expose the addToPlaylist function
  };
};

export default useSpotify;
