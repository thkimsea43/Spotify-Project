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
    let playlistTracks = [];
    let offset = 0;
    const limit = 100;

    try {
      let response;
      do {
        response = await spotifyApi.getPlaylistTracks(playlist.id, {
          limit,
          offset,
        });
        playlistTracks = [
          ...playlistTracks,
          ...response.body.items.map((item) => item.track),
        ];
        offset += limit;
      } while (response.body.next);
    } catch (error) {
      console.error(
        `Error fetching tracks for playlist ${playlist.name}:`,
        error
      );
    }
    // console.log(playlistTracks);
    return playlistTracks;
  };

  const handlePlaylistSelection = async (playlist) => {
    setIsLoading(true);
    setSelectedPlaylists((prevSelected) => {
      const isAlreadySelected = prevSelected.some((p) => p.id === playlist.id);

      if (isAlreadySelected) {
        setTracks((prevTracks) =>
          prevTracks.filter(
            (track) => !track.playlistId || track.playlistId !== playlist.id
          )
        );
        return prevSelected.filter((p) => p.id !== playlist.id);
      } else {
        fetchTracksForPlaylist(playlist).then((playlistTracks) => {
          setTracks((prevTracks) => [
            ...prevTracks,
            ...playlistTracks.map((track) => ({
              ...track,
              playlistId: playlist.id,
            })),
          ]);
        });
        return [...prevSelected, playlist];
      }
    });
    console.log(tracks);
    setIsLoading(false);
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
