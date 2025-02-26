import {useState, useEffect} from 'react'
import useAuth from './useAuth'
import { Container } from 'react-bootstrap'
import SpotifyWebApi from "spotify-web-api-node"

const spotifyApi = new SpotifyWebApi({
  clientId: "b800373be0064164ad72643d31336b90",
})

export default function Dashboard({ code }) {
  const accessToken = useAuth(code)
  const [playlists, setPlaylists] = useState([])
    
  useEffect(() => {
    if (!accessToken) return
    spotifyApi.setAccessToken(accessToken)
  }, [accessToken])

  useEffect(() => {
    if (!accessToken) return
    spotifyApi.getUserPlaylists().then(data => {
      setPlaylists(data.body.items)
    })
  }, [accessToken])
  
  return (
    <Container className='d-flex flex-column py-2' style={{ height: '100vh' }}>

      <div className="flex-grow-1 my-2" style={{ overflowY: "auto" }}>
        {playlists.map(playlists => (
          playlists.name
        ))}
      
      </div>
    </Container>
  )
}


