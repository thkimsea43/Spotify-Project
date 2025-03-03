export const formatTracks = (trackItems) => {
  return trackItems.map((item) => ({
    id: item.id,
    name: item.name,
    artists: item.artists.map((artist) => artist.name).join(", "),
    release_date: item.album.release_date,
    albumImage:
      item.album.images.length > 0
        ? item.album.images[0].url
        : "https://via.placeholder.com/64",
  }));
};

export const formatPlaylists = (playlists) => {
  return playlists.map((playlist) => ({
    id: playlist.id,
    name: playlist.name,
    image: playlist.images.length > 0 ? playlist.images[0].url : null,
  }));
};