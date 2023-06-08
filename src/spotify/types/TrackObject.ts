'use strict';

import Album from "./Album";
import ArtistObject from "./ArtistObject";

export default interface TrackObject {
    album: Album,
    artists: ArtistObject[],
    available_markets: string[],
    disc_number: number,
    duration_ms: number,
    explicit: boolean,
    external_ids: {
        spotify: string
    },
    href: string,
    id: string,
    is_playable: boolean,
    linked_from: object,
    restrictions: {
        reason: string
    },
    name: string,
    popularity: number,
    preview_url: string,
    track_number: number,
    type: string,
    uri: string,
    is_local: boolean
}