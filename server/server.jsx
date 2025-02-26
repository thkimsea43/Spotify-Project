const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const spotifyWebApi = require("spotify-web-api-node");

const app = express();
app.use(cors()); 
app.use(bodyParser.json());

app.post('/refresh', (req, res) => {
    const refreshToken = req.body.refreshToken
    console.log("hi")
    const spotifyApi = new SpotifyWebApi({
        redirectUri: 'http://localhost:5173',
        clientId: "b800373be0064164ad72643d31336b90",
        clientSecret: "b37e8077973449dd8174a71a86b9e59d",
        refreshToken
    })

    spotifyApi.refreshAccessToken()
    .then(data => {
      res.json({
        accessToken: data.body.accessToken,
        expiresIn: data.body.expiresIn,
      })
    })
    .catch(err => {
      console.log(err)
      res.sendStatus(400)
    })
})
app.post('/login', (req, res) => {
    const code = req.body.code;
    const spotifyApi = new spotifyWebApi({
        clientId: "b800373be0064164ad72643d31336b90",
        clientSecret: "b37e8077973449dd8174a71a86b9e59d",
        redirectUri: "http://localhost:5173",
    });

    spotifyApi.authorizationCodeGrant(code).then((data) => {
        res.json({
            accessToken: data.body.access_token,
            refreshToken: data.body.refresh_token,
            expiresIn: data.body.expires_in,
        });
    }).catch((err) => {
        console.error(err);
        res.status(500).json({ error: "Failed to authenticate with Spotify" });
    });
});

app.listen(3001);