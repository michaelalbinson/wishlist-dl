'use strict';

import SemaphoreQueue from "../SemaphoreQueue";
import ListReader from "../ListReader";
import Downloader from "../Downloader";
import MetadataSetter from "../MetadataSetter";

export default class WishlistCommand {
    static async exec(filePath: string, queryHint: string|undefined, parallelism: number) {
        const semaphore = new SemaphoreQueue(parallelism);
        ListReader.readList(filePath).forEach(url => {
            semaphore.schedule(async () => {
                return Downloader.start(url);
            });
        });

        await semaphore.complete();
        await MetadataSetter.setMetadataForDir('downloads', queryHint);
    }
}