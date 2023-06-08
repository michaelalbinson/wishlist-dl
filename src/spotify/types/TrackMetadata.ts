'use strict';

import TrackObject from "./TrackObject";

export default interface TrackMetadata {
    tracks: {
        href: string,
        limit: number,
        next: string|null,
        offset: number,
        previous: string|null,
        total: number,
        items: TrackObject[]
    }
}