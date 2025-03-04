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

export const getSongs = (year, tracks) => {
  console.log("Getting songs for year:", year);

  return tracks
    .filter((track) => {
      const releaseYear = track.album.release_date?.split("-")[0]; // Extract year from release_date
      return releaseYear == year; // Compare with input year
    })
    .sort((a, b) => {
      const dateA = new Date(a.album.release_date);
      const dateB = new Date(b.album.release_date);

      if (dateA - dateB !== 0) {
        return dateA - dateB; // Sort by release date (earliest first)
      }

      if (a.album.name !== b.album.name) {
        return a.album.name.localeCompare(b.album.name); // Sort alphabetically by album name
      }

      if (a.album.name !== b.album.name) {
        return a.name.localeCompare(b.name); // Sort by track name if albums are different
      }

      return a.track_number - b.track_number; // Sort by track number if same album
    })
    .map((track) => track.uri);
};
