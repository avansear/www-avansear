import { getArchivedSongs } from '../musix/archive'

export function SongArchive() {
  let archivedSongs = getArchivedSongs()

  return (
    <div>
      {archivedSongs
        .sort((a, b) => {
          const weekA = parseInt(a.week.replace(/\D/g, ''))
          const weekB = parseInt(b.week.replace(/\D/g, ''))
          return weekB - weekA
        })
        .map((song) => (
          <a
            key={song.youtubeId}
            className="flex flex-col space-y-1 mb-4"
            href={`https://www.youtube.com/watch?v=${song.youtubeId}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <div className="w-full flex flex-row space-x-2">
              <p className="text-[var(--color-accent)] w-fit tabular-nums flex-shrink-0">
                {song.week.toLowerCase()}
              </p>
              <p className="text-[var(--color-dark)] dark:text-[var(--color-light)] tracking-tight">
                {song.songName.toLowerCase()} - {song.artist.toLowerCase()}
              </p>
            </div>
          </a>
        ))}
    </div>
  )
} 