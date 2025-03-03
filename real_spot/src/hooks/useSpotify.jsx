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

  const createPlaylist = async (year, trackURIs) => {
    try {
      console.log("TrackIDS", trackURIs, year);
      // Step 1: Create a new playlist
      const data = await spotifyApi.createPlaylist(year, {
        description: `Playlist created for the year ${year}`,
        public: true, // Change to true if you want it to be public
      });

      const newPlaylistId = data.body.id;
      setPlaylists((prevPlaylists) => [...prevPlaylists, data.body]);
      setNewPlaylistID(newPlaylistId);

      console.log("New playlist created:", data.body, newPlaylistId);

      // Step 2: Add tracks to the newly created playlist
      if (trackURIs.length > 0) {
        await spotifyApi.addTracksToPlaylist(newPlaylistId, trackURIs);
        console.log("Tracks added to playlist:", trackURIs);
      } else {
        console.log("No tracks to add.");
      }
    } catch (error) {
      console.error("Error creating playlist or adding tracks", error);
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
  };
};

export default useSpotify;
