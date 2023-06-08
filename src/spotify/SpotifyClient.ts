'use strict';

import {env} from 'process';
import Logger from "../Logger";
import AuthResponse from "./types/AuthResponse";
import TrackMetadata from "./types/TrackMetadata";
import ID3trackMetadata from "../types/ID3trackMetadata";
import ArtistObject from "./types/ArtistObject";

export default class SpotifyClient {
    private authToken: string|null;

    constructor() {
        this.authToken = null;
    }

    async auth() {
        if (this.authToken)
            return this.authToken;

        const headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        // headers.append('Authorization', (new Buffer.from(env.CLIENT_ID + ':' + env.CLIENT_SECRET).toString('base64')));
        const body = `grant_type=client_credentials&client_id=${env.CLIENT_ID}&client_secret=${env.CLIENT_SECRET}&grant_type=client_credentials`;
        const response = await this.request('https://accounts.spotify.com/api/token', 'POST', body, headers);

        Logger.debug(response.ok ? 'Successful auth with Spotify' : 'Failed to authenticate with spotify');

        if (response.ok) {
            this.authToken = (await response.json() as AuthResponse).access_token;
            Logger.debug(`Bearer token: ${this.authToken}`);
        }
    }

    async trackMetadata(trackSearch: string): Promise<ID3trackMetadata> {
        const sanitizedSearch = encodeURI(trackSearch.replace(/ /g, '+'))
            .replace(/\(/g, "%28")
            .replace(/\)/g, "%29");

        const url = `https://api.spotify.com/v1/search?type=track&market=US&limit=1&offset=0&q=${sanitizedSearch}`;
        const response = await this.authorizedGet(url);
        if (!response.ok) {
            Logger.debug(await response.text());
            throw 'Failed to retrieve track';
        }

        const trackData = await response.json() as TrackMetadata;
        const track = trackData.tracks.items[0];
        if (!track)
            throw 'Failed to retrieve a result for search: ' + trackSearch;

        return {
            title: track.name,
            artist: track.artists.map((artist: ArtistObject) => artist.name).join(', '),
            album: track.album.name,
            release_date: new Date(track.album.release_date).getFullYear(),
            comment: track.id,
            trackNumber: track.track_number,
            genre: track.album.genres ? track.album.genres[0] : 'Unknown'
        } as ID3trackMetadata;
    }

    async authorizedGet(url: string): Promise<Response> {
        Logger.debug(`Authorized request out to ${url}`);
        if (!this.authToken)
            await this.auth();

        const headers = new Headers();
        headers.append('Authorization', `Bearer ${this.authToken}`);
        const response = await fetch(url, { headers });
        Logger.debug(response.ok ? `Successful request to ${url}` : `Failed request to ${url}`);
        return response;
    }

    async request(url: string, method: string, body: string|null, headers: Headers): Promise<Response> {
        Logger.debug(`Request out to ${url}`);

        const reqInit = { headers, method, body } as RequestInit;

        const response = await fetch('https://accounts.spotify.com/api/token', reqInit);
        Logger.debug(response.ok ? `Successful request to ${url}` : `Failed request to ${url}`);
        return response;
    }
}