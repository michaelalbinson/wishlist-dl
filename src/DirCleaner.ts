'use strict';

import {cwd} from "process";
import {join} from "path";
import {existsSync, readdirSync, rmSync} from "fs";

export default class DirCleaner {
    static async cleanup(directory: string) {
        const path = join(cwd(), directory)
        if (!existsSync(path))
            throw 'Directory does not exist';

        const files = readdirSync(path);
        // trusting yt-dlp to always end files here
        const toDelete = files.filter((fileName: string) => fileName.endsWith("].mp3"));
        toDelete.forEach(file => {
            rmSync(join(path, file));
        });
    }
}