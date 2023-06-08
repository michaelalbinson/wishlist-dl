'use strict';

import ImageObject from "./ImageObject";
import CopyrightObject from "./CopyrightObject";
import SimplifiedArtistObject from "./SimplifiedArtistObject";

export default interface Album {
    album_type: string,
    total_tracks: number,
    available_markets: string[],
    external_urls: {
        spotify: string
    },
    href: string,
    id: string,
    images: ImageObject[],
    name: string,
    release_date: string,
    release_date_precision: string,
    restrictions: {
        reason: string
    },
    type: string,
    uri: string,
    copyrights: CopyrightObject,
    external_ids: {
        isrc: string,
        ean: string,
        upc: string
    },
    genres: string[],
    label: string,
    popularity: number,
    album_group: string,
    artists: SimplifiedArtistObject[]
}