'use strict';

import SemaphoreQueue from "../SemaphoreQueue";
import ListReader from "../ListReader";
import Downloader from "../Downloader";
import MetadataSetter from "../MetadataSetter";

export default class WishlistCommand {
    static async exec(filePath: string, queryHint: string|undefined) {
        const semaphore = new SemaphoreQueue(1);
        ListReader.readList(filePath).forEach(url => {
            semaphore.schedule(async () => {
                await Downloader.start(url);
            });
        });

        await semaphore.complete();
        await MetadataSetter.setMetadataForDir('downloads', queryHint);
    }
}