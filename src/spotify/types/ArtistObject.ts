'use strict';

import ImageObject from "./ImageObject";

export default interface ArtistObject {
    external_urls: {
        spotify: string
    },
    followers: {
        href: string|null,
        total: number
    },
    genres: string[],
    href: string,
    id: string,
    images: ImageObject[],
    name: string,
    popularity: number,
    type: string,
    uri: string
}