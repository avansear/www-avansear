export interface ArchivedSong {
  week: string
  songName: string
  artist: string
  youtubeId: string
}

export function getArchivedSongs(): ArchivedSong[] {
  return [
    {
      week: "Week 1",
      songName: "Kilby Girl",
      artist: "The Backseat Lovers",
      youtubeId: "oTwVce9eWb4"
    },
    {
      week: "Week 2",
      songName: "dead girl in the pool.",
      artist: "girl in red",
      youtubeId: "Ra9KtiCMynE"
    },
  ]
}