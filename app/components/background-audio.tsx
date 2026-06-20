'use client'

import { useEffect, useRef, useState } from 'react'

export function BackgroundAudio() {
  const [youtubeId, setYoutubeId] = useState<string | null>(null)
  const youtubeContainerRef = useRef<HTMLDivElement>(null)
  const playerRef = useRef<YT.Player | null>(null)
  const isReadyRef = useRef(false)
  const hasInteractedRef = useRef(false)
  const pendingUnmuteRef = useRef(false)
  const currentYoutubeIdRef = useRef<string | null>(null)

  useEffect(() => {
    const ac = new AbortController()
    async function fetchAndPlayLatestSong() {
      try {
        const response = await fetch('/api/musix/latest-song', { signal: ac.signal })
        const data = await response.json()
        if (ac.signal.aborted) return
        if (!data.songName || !data.artist) return
        const searchResponse = await fetch('/api/musix/search-youtube', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ songName: data.songName, artist: data.artist }),
          signal: ac.signal,
        })
        const searchData = await searchResponse.json()
        if (ac.signal.aborted) return
        if (searchData.youtubeId) setYoutubeId(searchData.youtubeId)
      } catch (e) {
        if (e instanceof Error && e.name === 'AbortError') return
        console.error('BackgroundAudio: Error fetching song:', e)
      }
    }
    fetchAndPlayLatestSong()
    return () => ac.abort()
  }, [])

  useEffect(() => {
    if (!youtubeId) {
      if (playerRef.current) {
        try { playerRef.current.destroy() } catch { /* ignore */ }
        playerRef.current = null
      }
      currentYoutubeIdRef.current = null
      return
    }

    if (currentYoutubeIdRef.current === youtubeId && playerRef.current) return

    currentYoutubeIdRef.current = youtubeId

    function initializePlayer() {
      if (!youtubeId || !youtubeContainerRef.current) return
      if (playerRef.current) {
        try { playerRef.current.destroy() } catch { /* ignore */ }
        playerRef.current = null
      }
      isReadyRef.current = false

      playerRef.current = new window.YT.Player(youtubeContainerRef.current, {
        width: 480,
        height: 270,
        videoId: youtubeId,
        playerVars: {
          autoplay: 1,
          controls: 0,
          disablekb: 1,
          enablejsapi: 1,
          fs: 0,
          iv_load_policy: 3,
          modestbranding: 1,
          playsinline: 1,
          rel: 0,
          showinfo: 0,
          mute: 1,
        },
        events: {
          onReady: (event: YT.PlayerEvent) => {
            isReadyRef.current = true
            try { event.target.playVideo() } catch { /* ignore */ }
            // honour any interaction that happened before the player was ready
            if (pendingUnmuteRef.current) {
              hasInteractedRef.current = true
              pendingUnmuteRef.current = false
              try { event.target.unMute() } catch { /* ignore */ }
            }
          },
          onStateChange: (event: YT.OnStateChangeEvent) => {
            if (event.data === YT.PlayerState.PLAYING && hasInteractedRef.current) {
              window.dispatchEvent(new CustomEvent('audioPlaying', { detail: true }))
            } else {
              window.dispatchEvent(new CustomEvent('audioPlaying', { detail: false }))
            }
          },
          onError: (event: YT.PlayerEvent) => {
            console.error('BackgroundAudio: Player error:', event.data)
          },
          onAutoplayBlocked: () => {
            window.dispatchEvent(new CustomEvent('autoplayBlocked'))
          },
        },
      })
    }

    if (window.YT?.Player) {
      initializePlayer()
    } else {
      // Load the API script if not already inserted
      if (!document.querySelector('script[src="https://www.youtube.com/iframe_api"]')) {
        const tag = document.createElement('script')
        tag.src = 'https://www.youtube.com/iframe_api'
        document.head.appendChild(tag)
      }
      // onYouTubeIframeAPIReady is the canonical callback; no polling needed
      window.onYouTubeIframeAPIReady = initializePlayer
    }

    const handleInteraction = () => {
      if (hasInteractedRef.current) return
      if (!isReadyRef.current || !playerRef.current) {
        // Player not ready yet — store intent, act on it in onReady
        pendingUnmuteRef.current = true
        return
      }
      hasInteractedRef.current = true
      try {
        playerRef.current.unMute()
        if (playerRef.current.getPlayerState() !== YT.PlayerState.PLAYING) {
          playerRef.current.playVideo()
        }
        if (playerRef.current.getPlayerState() === YT.PlayerState.PLAYING) {
          window.dispatchEvent(new CustomEvent('audioPlaying', { detail: true }))
        }
      } catch (e) {
        console.error('BackgroundAudio: Failed to unmute:', e)
      }
    }

    const handleTriggerPlay = () => {
      if (!isReadyRef.current || !playerRef.current) return
      hasInteractedRef.current = true
      pendingUnmuteRef.current = false
      try {
        playerRef.current.unMute()
        if (playerRef.current.getPlayerState() !== YT.PlayerState.PLAYING) {
          playerRef.current.playVideo()
        }
        setTimeout(() => {
          if (playerRef.current?.getPlayerState() === YT.PlayerState.PLAYING) {
            window.dispatchEvent(new CustomEvent('audioPlaying', { detail: true }))
          }
        }, 100)
      } catch (e) {
        console.error('BackgroundAudio: Failed to play:', e)
      }
    }

    const handleTriggerPause = () => {
      if (!isReadyRef.current || !playerRef.current) return
      try {
        playerRef.current.pauseVideo()
        window.dispatchEvent(new CustomEvent('audioPlaying', { detail: false }))
      } catch (e) {
        console.error('BackgroundAudio: Failed to pause:', e)
      }
    }

    const interactionEvents = ['click', 'touchstart', 'keydown', 'scroll'] as const
    interactionEvents.forEach((ev) => window.addEventListener(ev, handleInteraction))
    window.addEventListener('triggerAudioPlay', handleTriggerPlay)
    window.addEventListener('triggerAudioPause', handleTriggerPause)

    return () => {
      interactionEvents.forEach((ev) => window.removeEventListener(ev, handleInteraction))
      window.removeEventListener('triggerAudioPlay', handleTriggerPlay)
      window.removeEventListener('triggerAudioPause', handleTriggerPause)
      if (playerRef.current) {
        try { playerRef.current.destroy() } catch { /* ignore */ }
      }
    }
  }, [youtubeId])

  if (!youtubeId) return null

  return (
    <div
      style={{ position: 'absolute', left: -9999, top: 0, width: 480, height: 270, overflow: 'hidden', pointerEvents: 'none' }}
      aria-hidden="true"
    >
      <div ref={youtubeContainerRef} style={{ width: 480, height: 270 }} />
    </div>
  )
}
