import querystring from 'querystring';

const path = require('path');
const BASE_ADDRESS = 'https://api.spotify.com/v1';


const getAccessToken = async () => {
    const client_id = process.env.SPOTIFY_CLIENT_ID;
    const client_secret = process.env.SPOTIFY_CLIENT_SECRET;
    const refresh_token = process.env.SPOTIFY_REFRESH_TOKEN;

    const basic = Buffer.from(`${client_id}:${client_secret}`).toString('base64');
    const TOKEN_ENDPOINT = `https://accounts.spotify.com/api/token`;

    const response = await fetch(TOKEN_ENDPOINT, {
        method: 'POST',
        headers: {
            Authorization: `Basic ${basic}`,
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: querystring.stringify({
            grant_type: 'refresh_token',
            refresh_token,
        }),
    });


    return response.json();
};

export interface Track {
    artists: string,
    external_urls: string,
    name: string
}


export const getTopTracks = async () => {
    const { access_token } = await getAccessToken();
    const TOP_TRACKS_ENDPOINT = path.join(BASE_ADDRESS, '/me/top/tracks');

    const response = await fetch(TOP_TRACKS_ENDPOINT, {
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
    });
    const { items } = await response.json();
    return items.slice(0, 10).map((track: { artists: any[]; external_urls: { spotify: any; }; name: any; }) => ({
        artist: track.artists.map((_artist: { name: any; }) => _artist.name).join(', '),
        songUrl: track.external_urls.spotify,
        title: track.name,
    }));
};


export const getNowPlaying = async () => {
    const { access_token } = await getAccessToken();
    const CURRENTLY_PLAYING_ENDPOINT = path.join(BASE_ADDRESS, 'me/player/currently-playing');

    const response = await fetch(CURRENTLY_PLAYING_ENDPOINT, {
        headers: {
            Authorization: `Bearer ${access_token}`
        }
    });

    if (response.status === 204) {
        return null
    }

    return response.json();
};


