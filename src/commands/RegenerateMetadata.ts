'use strict';

import MetadataSetter from "../MetadataSetter";

export default class RegenerateMetadata {
    static async exec(dirPath: string, queryHint: string|undefined) {
        await MetadataSetter.setMetadataForDir(dirPath, queryHint);
    }
}