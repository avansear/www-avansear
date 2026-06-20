'use client'

import { useEffect, useRef, useState } from 'react'

export function BackgroundAudio() {
  const [youtubeId, setYoutubeId] = useState<string | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const playerRef = useRef<YT.Player | null>(null)
  const isReadyRef = useRef(false)
  const playOnReadyRef = useRef(false)

  useEffect(() => {
    const ac = new AbortController()
    ;(async () => {
      try {
        const songRes = await fetch('/api/musix/latest-song', { signal: ac.signal })
        const song = await songRes.json()
        if (ac.signal.aborted || !song.songName || !song.artist) return
        const ytRes = await fetch('/api/musix/search-youtube', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ songName: song.songName, artist: song.artist }),
          signal: ac.signal,
        })
        const yt = await ytRes.json()
        if (!ac.signal.aborted && yt.youtubeId) setYoutubeId(yt.youtubeId)
      } catch (e) {
        if (e instanceof Error && e.name !== 'AbortError') console.error('BackgroundAudio:', e)
      }
    })()
    return () => ac.abort()
  }, [])

  useEffect(() => {
    if (!youtubeId) return

    let destroyed = false

    function createPlayer() {
      if (destroyed || !containerRef.current) return
      if (playerRef.current) {
        try { playerRef.current.destroy() } catch { /* ignore */ }
        playerRef.current = null
      }
      isReadyRef.current = false

      playerRef.current = new window.YT.Player(containerRef.current, {
        width: 480,
        height: 270,
        videoId: youtubeId,
        playerVars: {
          autoplay: 0, // no autoplay — play only on explicit user click
          controls: 0,
          disablekb: 1,
          enablejsapi: 1,
          fs: 0,
          iv_load_policy: 3,
          modestbranding: 1,
          playsinline: 1,
          rel: 0,
          showinfo: 0,
          mute: 1, // stay muted until user clicks; unMute() on play
        },
        events: {
          onReady: (event: YT.PlayerEvent) => {
            if (destroyed) return
            isReadyRef.current = true
            if (playOnReadyRef.current) {
              playOnReadyRef.current = false
              event.target.unMute()
              event.target.playVideo()
            }
          },
          onStateChange: (event: YT.OnStateChangeEvent) => {
            window.dispatchEvent(new CustomEvent('audioPlaying', {
              detail: event.data === YT.PlayerState.PLAYING,
            }))
          },
          onError: (event: YT.PlayerEvent) => {
            console.error('BackgroundAudio: player error', event.data)
          },
        },
      })
    }

    if (window.YT?.Player) {
      createPlayer()
    } else {
      if (!document.querySelector('script[src="https://www.youtube.com/iframe_api"]')) {
        const tag = document.createElement('script')
        tag.src = 'https://www.youtube.com/iframe_api'
        document.head.appendChild(tag)
      }
      window.onYouTubeIframeAPIReady = createPlayer
    }

    const handleTriggerPlay = () => {
      if (!isReadyRef.current || !playerRef.current) {
        playOnReadyRef.current = true
        return
      }
      try {
        playerRef.current.unMute()
        playerRef.current.playVideo()
      } catch (e) {
        console.error('BackgroundAudio: play failed', e)
      }
    }

    const handleTriggerPause = () => {
      playOnReadyRef.current = false
      if (!isReadyRef.current || !playerRef.current) return
      try {
        playerRef.current.pauseVideo()
        window.dispatchEvent(new CustomEvent('audioPlaying', { detail: false }))
      } catch (e) {
        console.error('BackgroundAudio: pause failed', e)
      }
    }

    window.addEventListener('triggerAudioPlay', handleTriggerPlay)
    window.addEventListener('triggerAudioPause', handleTriggerPause)

    return () => {
      destroyed = true
      window.removeEventListener('triggerAudioPlay', handleTriggerPlay)
      window.removeEventListener('triggerAudioPause', handleTriggerPause)
      if ((window.onYouTubeIframeAPIReady as unknown) === createPlayer) {
        window.onYouTubeIframeAPIReady = () => {}
      }
      if (playerRef.current) {
        try { playerRef.current.destroy() } catch { /* ignore */ }
        playerRef.current = null
      }
      isReadyRef.current = false
    }
  }, [youtubeId])

  if (!youtubeId) return null

  return (
    <div
      style={{ position: 'absolute', left: -9999, top: 0, width: 480, height: 270, overflow: 'hidden', pointerEvents: 'none' }}
      aria-hidden="true"
    >
      <div ref={containerRef} style={{ width: 480, height: 270 }} />
    </div>
  )
}
