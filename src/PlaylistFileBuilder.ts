'use strict';

import {createWriteStream, readdirSync} from "fs";
import {join} from 'path';
import {cwd} from 'process';

export default class PlaylistFileBuilder {
    static build3MU(dirPath: string) {
        const files = readdirSync(join(cwd(), dirPath));
        const mp3Files = files.filter((fileName: string) => fileName.endsWith(".mp3"));

        // Create a new .m3u file for each .mp3 file.
        const playlistFile = join(cwd(), dirPath, "To Claire - Jules.m3u");
        const writer = createWriteStream(playlistFile);
        // Write the playlist header to the file.
        writer.write("#EXTM3U\r\n");
        for (const mp3Filename of mp3Files) {
            writer.write(`#EXTINF:0,${mp3Filename.replace('.mp3', '')}\r\n`);
            writer.write(mp3Filename + "\r\n");
        }

        writer.close();
    }
}