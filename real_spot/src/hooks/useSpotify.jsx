import { useState, useEffect } from "react";
import SpotifyWebApi from "spotify-web-api-node";

const spotifyApi = new SpotifyWebApi({
  clientId: "b800373be0064164ad72643d31336b90",
});

const useSpotify = (accessToken) => {
  const [playlists, setPlaylists] = useState([]);
  const [tracks, setTracks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPlaylists, setSelectedPlaylists] = useState([]);
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

  const fetchTracks = async (playlists) => {
    setIsLoading(true);
    let allTracks = [];
    const limit = 100;

    try {
      // Loop through each playlist and fetch tracks
      for (const playlist of playlists) {
        let offset = 0;
        let response;

        do {
          response = await spotifyApi.getPlaylistTracks(playlist.id, {
            limit,
            offset,
          });

          // Add the tracks from this playlist to the allTracks array
          allTracks = [
            ...allTracks,
            ...response.body.items.map((item) => item.track),
          ];

          offset += limit;
        } while (response.body.next); // Keep looping until there are no more pages
      }

      setTracks(allTracks); // Set all tracks after fetching them from all playlists
    } catch (error) {
      console.error("Error fetching tracks:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const createPlaylist = async (year, trackURIs) => {
    try {
      const { body: playlist } = await spotifyApi.createPlaylist(year, {
        description: `Playlist created for the year ${year}, extracted from the playlist `,
        public: true,
      });

      setPlaylists((prev) => [...prev, playlist]);
      setNewPlaylistID(playlist.id);
      console.log("New playlist created:", playlist);

      // Add tracks in batches of 100
      for (let i = 0; i < trackURIs.length; i += 100) {
        const batch = trackURIs.slice(i, i + 100);
        await spotifyApi.addTracksToPlaylist(playlist.id, batch);
        console.log(`Added batch ${i / 100 + 1}:`, batch);
      }
    } catch (error) {
      console.error("Error creating playlist or adding tracks:", error);
    }
  };

  return {
    playlists,
    selectedPlaylists,
    setSelectedPlaylists,
    tracks,
    fetchTracks,
    isLoading,
    createPlaylist,
    newPlaylistID,
  };
};

export default useSpotify;
