export const formatTracks = (trackItems) => {
  return trackItems.map((item) => ({
    id: item.id,
    name: item.name,
    artists: item.artists.map((artist) => artist.name).join(", "),
    albumImage:
      item.album.images.length > 0
        ? item.album.images[0].url
        : "https://via.placeholder.com/64",
  }));
};
