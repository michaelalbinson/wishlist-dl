'use strict';

import MetadataSetter from "../MetadataSetter";

export default class RematchCommand {
    static async exec(filePath: string, queryHint: string) {
        await MetadataSetter.rematchMetadata(filePath, queryHint);
    }
}