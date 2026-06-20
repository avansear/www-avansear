export async function getSpotifyAccessToken(clientId: string, clientSecret: string): Promise<string> {
  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ grant_type: 'client_credentials', client_id: clientId, client_secret: clientSecret }),
  })
  if (!response.ok) {
    throw new Error(`Spotify auth error: ${response.status} ${await response.text()}`)
  }
  const data = await response.json() as { access_token: string }
  return data.access_token
}
