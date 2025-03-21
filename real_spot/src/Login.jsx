import React from "react";
import { Container } from "react-bootstrap";

const AUTH_URL =
  "https://accounts.spotify.com/authorize?client_id=b800373be0064164ad72643d31336b90&response_type=code&redirect_uri=http://localhost:5173&scope=streaming%20user-read-email%20user-read-private%20user-library-read%20user-library-modify%20playlist-modify-public%20playlist-modify-private";

export default function Login() {
  return (
    <Container
      className="d-flex justify-content-center align-items-center"
      style={{ minHeight: "100vh" }}
    >
      <a href={AUTH_URL} className="btn btn-success btn-lg">
        Login with Spotify
      </a>
    </Container>
  );
}
