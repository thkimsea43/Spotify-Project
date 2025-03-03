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

  const createPlaylist = async (year, trackURIs, selectedPlaylist) => {
    try {
      const { body: playlist } = await spotifyApi.createPlaylist(year, {
        description: `Playlist created for the year ${year}, extracted from the playlist ${selectedPlaylist.name}`,
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
    selectedPlaylist,
    setSelectedPlaylist,
    tracks,
    fetchTracks,
    isLoading,
    createPlaylist,
    newPlaylistID,
  };
};

export default useSpotify;
