import { getArchivedSongs } from '../../../musix/db'
import { getSpotifyAccessToken } from '../../../musix/spotify'
import { NextResponse } from 'next/server'

interface SpotifyTrackResponse {
  external_urls: { spotify: string }
  artists: Array<{ name: string; external_urls: { spotify: string } }>
  album: {
    name: string
    external_urls: { spotify: string }
    images: Array<{ url: string }>
  }
}

async function getSpotifyTrackInfo(accessToken: string, trackId: string): Promise<{
  albumArt: string | null
  albumName: string | null
  trackUrl: string | null
  albumUrl: string | null
  artistUrl: string | null
  success: boolean
}> {
  const empty = { albumArt: null, albumName: null, trackUrl: null, albumUrl: null, artistUrl: null, success: false }
  try {
    const response = await fetch(`https://api.spotify.com/v1/tracks/${trackId}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
    if (!response.ok) return empty
    const data: SpotifyTrackResponse = await response.json()
    if (!data.album) return empty
    return {
      albumArt: data.album.images[0]?.url ?? null,
      albumName: data.album.name ?? null,
      trackUrl: data.external_urls.spotify ?? null,
      albumUrl: data.album.external_urls.spotify ?? null,
      artistUrl: data.artists[0]?.external_urls.spotify ?? null,
      success: true,
    }
  } catch (error) {
    console.error('Error fetching from Spotify:', error)
    return empty
  }
}

// Force dynamic rendering to ensure latest song is always fetched fresh
export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  const url = new URL(request.url)
  const isDebugMode = url.searchParams.get('debug') === 'true'
  
  try {
    const songs = await getArchivedSongs()
    const latestSong = songs.length > 0 ? songs[0] : null
    
    if (!latestSong) {
      return NextResponse.json({ songName: null, artist: null, albumArt: null, albumName: null, trackUrl: null, albumUrl: null, artistUrl: null }, { status: 200 })
    }

    // Check if we have Spotify credentials
    const clientId = process.env.SPOTIFY_CLIENT_ID
    const clientSecret = process.env.SPOTIFY_CLIENT_SECRET

    const noSpotify = { songName: latestSong.songName, artist: latestSong.artist, albumArt: null, albumName: null, trackUrl: null, albumUrl: null, artistUrl: null }

    if (!clientId || !clientSecret || !latestSong.spotifyTrackId) {
      return NextResponse.json(noSpotify, { status: 200 })
    }

    let accessToken: string
    try {
      accessToken = await getSpotifyAccessToken(clientId, clientSecret)
    } catch (error) {
      console.error('Failed to get Spotify access token:', error)
      return NextResponse.json(noSpotify, { status: 200 })
    }

    const { albumArt, albumName, trackUrl, albumUrl, artistUrl } = await getSpotifyTrackInfo(accessToken, latestSong.spotifyTrackId)

    return NextResponse.json({
      songName: latestSong.songName,
      artist: latestSong.artist,
      albumArt,
      albumName,
      trackUrl,
      albumUrl,
      artistUrl,
    }, { status: 200 })
  } catch (error) {
    console.error('Error fetching album art:', error)
    return NextResponse.json({ songName: null, artist: null, albumArt: null, albumName: null, trackUrl: null, albumUrl: null, artistUrl: null }, { status: 200 })
  }
}
