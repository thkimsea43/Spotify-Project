# Spotify Playlist Manager

## Overview

Spotify Playlist Manager is a React-based web application that allows users to authenticate with their Spotify account, select playlists, filter songs by release year, and create new playlists based on selected criteria.

This project was stemmed from a simple need to manage and organize my personal Spotify playlists. It honestly still amazes me that Spotify doesn't have a built-in feature to do this. I will continue to improve this project as my needs evolve and I really hope Spotify will eventually add this feature.

Just a point of clarification: This is different than Spotify's Wrapped (year end review) feature. My goal was simply to create a tool to help me manage my playlists by songs' release year.

## Features

- **Spotify Authentication:** Users can log in using their Spotify credentials.
- **Playlist Selection:** Users can browse and select their Spotify playlists.
- **Track Filtering:** Tracks can be filtered based on release year.
- **Playlist Creation:** Users can create new playlists with filtered tracks.
- **External API Integration:** Uses Spotify's Web API to fetch and manage playlists.
- **Enhanced Styling:** Uses modular CSS for styling components consistently.

## Folder Structure

```
root/
│── src/
│   ├── components/
│   │   ├── Dashboard.js
│   │   ├── TrackList.js
│   │   ├── CreatePlaylist.js
│   ├── hooks/
│   │   ├── useAuth.js
│   │   ├── useSpotify.js
│   ├── utils/
│   │   ├── spotifyUtils.js
│   ├── styles/
│   │   ├── Dashboard.module.css
│   │   ├── TrackList.module.css
│   │   ├── CreatePlaylist.module.css
│── public/
│── README.md
```

## Installation & Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/your-repo/spotify-playlist-manager.git
   cd spotify-playlist-manager
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file and add your **Spotify API credentials**:
   ```env
   REACT_APP_SPOTIFY_CLIENT_ID=your-client-id
   REACT_APP_SPOTIFY_CLIENT_SECRET=your-client-secret
   REACT_APP_REDIRECT_URI=http://localhost:3000
   ```
4. Start the development server:
   ```bash
   npm start
   ```

## Usage

1. Log in using your Spotify account.
2. Click the **"Create Playlist"** button to display the playlist selection dropdown.
3. Select a playlist to load its tracks.
4. Enter a year to filter tracks and click **"Create Playlist"**.
5. The new playlist will be created in your Spotify account.

## API Integration

### Spotify API

- **Authentication:** Uses OAuth 2.0 for user authentication.
- **Fetching Playlists:** Retrieves the user's playlists.
- **Fetching Tracks:** Fetches tracks from selected playlists.
- **Creating Playlists:** Creates new playlists in the user’s Spotify account.

### External API (MusicBrainz)

- **Fetches correct release dates** to compensate for incorrect data on Spotify.
- Integrated to validate and sort tracks based on accurate metadata.

## Styling

- Uses **CSS Modules** to keep styles modular and scoped.
- Button and input elements are styled consistently across the application.
- Responsive design with Bootstrap and custom CSS classes.

## Future Improvements

- Improve error handling and edge cases.
- Add more filtering options (e.g., by genre or popularity).
- Enhance UI/UX with animations and better state management.
- Implement user preferences for filtering and sorting.

## License

This project is licensed under the MIT License. Feel free to modify and use it as needed!

## Contributing

Pull requests and feature suggestions are welcome! Fork the repo and submit a PR with your improvements.

## Contact

For questions or support, contact: [[thkimsea@example.com](mailto:thkimsea@example.com)]
