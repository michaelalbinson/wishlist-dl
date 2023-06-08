'use strict';

export default interface ID3trackMetadata {
    title: string,
    artist: string,
    album: string,
    release_date: number,
    comment: string,
    trackNumber: number,
    genre: string
}