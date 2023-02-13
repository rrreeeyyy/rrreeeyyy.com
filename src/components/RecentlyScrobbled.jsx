import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useEffect, useState } from "react";

const RecentlyScrobbled = () => {
  dayjs.extend(relativeTime);

  const TRACK_LIMIT = 3;
  const LASTFM_USERNAME = import.meta.env.PUBLIC_LASTFM_USERNAME;
  const LASTFM_API_KEY = import.meta.env.PUBLIC_LASTFM_API_KEY;

  const endpoint = `https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${LASTFM_USERNAME}&api_key=${LASTFM_API_KEY}&format=json&limit=${TRACK_LIMIT}`;

  const [tracks, setTracks] = useState([]);

  useEffect(() => {
    const getTracks = async () => {
      const res = await fetch(endpoint).then((res) => res.json());
      setTracks(res.recenttracks.track);
    };
    getTracks();
  }, [])

  return (
    tracks.map((track) => (
      <li>
        <a href={track.url} target="_blank">
          <div>
            {track.name} by {track.artist["#text"]} (
            {dayjs().to(dayjs.unix(track.date.uts))})
          </div>
        </a>
      </li>
    ))
  )
}

export default RecentlyScrobbled;
