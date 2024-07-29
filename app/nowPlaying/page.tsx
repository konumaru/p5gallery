import dynamic from 'next/dynamic';
import Link from 'next/link';

import { getNowPlaying } from './Spotify';

const directoryName = 'nowPlaying';

export const metadata = {
    title: directoryName,
}

const P5Canvas = dynamic(() => import('./src'), {
    ssr: false
});

export default async function Page() {
    const now_playing_track = await getNowPlaying();
    let track_name = ""
    let artist = ""

    if (now_playing_track === null) {
        console.log('No track currently playing');
        track_name = ""
        artist = ""
    } else {
        const track_id = now_playing_track.item.id;
        track_name = now_playing_track.item.name;
        artist = now_playing_track.item.artists.map((_artist: { name: string; }) => _artist.name).join(', ')

        // TODO: get track features by track_id.
    }

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
                    <p className="text-lg text-black mb-1 p-1">🎵 Now Playing {track_name} with {artist}</p>
                )
            }

            < P5Canvas />
        </div >
    )
}
