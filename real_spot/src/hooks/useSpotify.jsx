import { useState, useEffect } from "react";
import SpotifyWebApi from "spotify-web-api-node";

const spotifyApi = new SpotifyWebApi({
  clientId: "b800373be0064164ad72643d31336b90",
});

const useSpotify = (accessToken) => {
  const [playlists, setPlaylists] = useState([]);
  const [tracks, setTracks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPlaylists, setSelectedPlaylists] = useState([]);
  const [newPlaylistID, setNewPlaylistID] = useState("");
  const [fetchingPlaylists, setFetchingPlaylists] = useState(new Set());

  useEffect(() => {
    if (!accessToken) return;
    spotifyApi.setAccessToken(accessToken);
    fetchPlaylists();
  }, [accessToken]);

  const fetchPlaylists = async () => {
    setIsLoading(true);
    let allPlaylists = [];

    try {
      let data;
      do {
        data = await spotifyApi.getUserPlaylists({
          offset: allPlaylists.length,
        });
        allPlaylists = [...allPlaylists, ...data.body.items];
      } while (data.body.next);

      // Sort playlists by track count (descending order)
      setPlaylists(
        allPlaylists.sort((a, b) => b.tracks.total - a.tracks.total)
      );
    } catch (error) {
      console.error("Error fetching playlists:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchTracksForPlaylist = async (playlist) => {
    if (fetchingPlaylists.has(playlist.id)) return; // Prevent duplicate fetches

    setFetchingPlaylists((prev) => new Set(prev).add(playlist.id));

    let offset = 0;
    const limit = 100;

    try {
      let response;
      do {
        response = await spotifyApi.getPlaylistTracks(playlist.id, {
          limit,
          offset,
        });

        const newTracks = response.body.items.map((item) => ({
          ...item.track,
          playlistId: playlist.id,
        }));

        // Dynamically update tracks **while fetching**
        setTracks((prevTracks) => [...prevTracks, ...newTracks]);

        offset += limit;
      } while (response.body.next);
    } catch (error) {
      console.error(
        `Error fetching tracks for playlist ${playlist.name}:`,
        error
      );
    } finally {
      // Remove from fetching list after it's done
      setFetchingPlaylists((prev) => {
        const updated = new Set(prev);
        updated.delete(playlist.id);
        return updated;
      });
    }
  };

  const handlePlaylistSelection = async (playlist) => {
    setSelectedPlaylists((prevSelected) => {
      const isAlreadySelected = prevSelected.some((p) => p.id === playlist.id);

      if (isAlreadySelected) {
        // Stop fetching if deselected & remove tracks
        setFetchingPlaylists((prev) => {
          const updated = new Set(prev);
          updated.delete(playlist.id);
          return updated;
        });

        setTracks((prevTracks) =>
          prevTracks.filter((track) => track.playlistId !== playlist.id)
        );

        return prevSelected.filter((p) => p.id !== playlist.id);
      } else {
        fetchTracksForPlaylist(playlist); // Continue fetching even after confirmation
        return [...prevSelected, playlist];
      }
    });
  };

  useEffect(() => {
    console.log("Updated tracks state:", tracks);
  }, [tracks]);

  const clearSelection = () => {
    setSelectedPlaylists([]);
    setTracks([]);
  };

  const confirmSelection = () => {
    console.log(tracks);
    console.log("Selected playlists confirmed:", selectedPlaylists);
  };

  const createPlaylist = async (year, trackURIs) => {
    try {
      const { body: playlist } = await spotifyApi.createPlaylist(year, {
        description: `Songs released in ${year}`,
        public: true,
      });

      setPlaylists((prev) => [...prev, playlist]);
      setNewPlaylistID(playlist.id);

      for (let i = 0; i < trackURIs.length; i += 100) {
        await spotifyApi.addTracksToPlaylist(
          playlist.id,
          trackURIs.slice(i, i + 100)
        );
      }
    } catch (error) {
      console.error("Error creating playlist or adding tracks:", error);
    }
  };

  return {
    playlists,
    selectedPlaylists,
    setSelectedPlaylists,
    handlePlaylistSelection,
    fetchTracksForPlaylist,
    confirmSelection,
    clearSelection,
    tracks,
    setTracks,
    isLoading,
    createPlaylist,
    newPlaylistID,
  };
};

export default useSpotify;
