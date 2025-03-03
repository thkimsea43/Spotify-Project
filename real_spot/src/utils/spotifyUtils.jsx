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
  console.log("getSongs Tracks:", tracks);

  return tracks
    .filter((track) => {
      const releaseYear = track.album.release_date?.split("-")[0]; // Extract year from release_date
      return releaseYear == year; // Compare with input year
    })
    .map((track) => track.uri); // Return only the track URI
};
