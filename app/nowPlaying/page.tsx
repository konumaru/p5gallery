import dynamic from 'next/dynamic';
import Link from 'next/link';

import { getNowPlaying, getTrackFeatures } from './Spotify';

const directoryName = 'nowPlaying';

export const metadata = {
    title: directoryName,
}

const P5Canvas = dynamic(() => import('./src'), {
    ssr: false
});


export default async function Page() {
    const now_playing_track = await getNowPlaying();
    const empty_track_info = {
        id: "",
        name: "",
        artist: "",
        danceability: 0,
        energy: 0,
        key: 0,
        loudness: 0,
        speechiness: 0,
        acousticness: 0,
        instrumentalness: 0,
        liveness: 0,
        valence: 0,
        tempo: 0,
    }
    let track_info = empty_track_info;

    if (now_playing_track === null) {
        console.log('No track currently playing');
        track_info = empty_track_info;
    } else {
        const track_id = now_playing_track.item.id;
        const track_feature = await getTrackFeatures(track_id);

        track_info = {
            id: track_id,
            name: now_playing_track.item.name,
            artist: now_playing_track.item.artists.map((_artist: { name: string; }) => _artist.name).join(', '),
            danceability: track_feature.danceability,
            energy: track_feature.energy,
            key: track_feature.key,
            loudness: track_feature.loudness,
            speechiness: track_feature.speechiness,
            acousticness: track_feature.acousticness,
            instrumentalness: track_feature.instrumentalness,
            liveness: track_feature.liveness,
            valence: track_feature.valence,
            tempo: track_feature.tempo,
        };
    }

    console.log(track_info);

    return (
        <div className='bg-white'>
            <nav className="text-sm breadcrumbs">
                <ol className="list-none p-1 inline-flex">
                    <li className="flex items-center">
                        <Link href="/" className="text-blue-600 hover:text-blue-800">
                            Home
                        </Link>
                        <span className="mx-2 text-gray-500">/</span>
                    </li>
                    <li className="text-gray-700">{directoryName}</li>
                </ol>
            </nav>

            <h1 className="text-xl text-black font-bold mb-1 p-1">{directoryName}</h1>

            {
                now_playing_track === null ? (
                    <p className="text-lg text-black mb-1 p-1">🔇 Nothing currently playing</p>
                ) : (
                    <p className="text-lg text-black mb-1 p-1">🎵 Now Playing {track_info.name} with {track_info.artist}</p>
                )
            }

            < P5Canvas trackInfo={track_info} />
        </div >
    )
}
