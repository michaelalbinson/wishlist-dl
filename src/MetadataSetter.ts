'use strict';

import ID3trackMetadata from "./types/ID3trackMetadata";
import {spawn} from "child_process";
import {dirname, join, basename} from 'path';
import Logger from "./Logger";
import chalk from "chalk";
import SpotifyClient from "./spotify/SpotifyClient";
import {readdirSync, existsSync} from "fs";
import {cwd} from "process";

export default class MetadataSetter {
    static async setMetadataForDir(dirName: string, queryHint: string|undefined): Promise<void> {
        const files = readdirSync(join(cwd(), dirName));
        const mp3Files = files.filter((fileName: string) => fileName.endsWith(".mp3"));

        for (const mp3Filename of mp3Files) {
            const filePath = join(cwd(), dirName, mp3Filename);
            const matches = basename(filePath).match(/^[0-9A-Za-z- ,.'&]+((\((feat\.)|(ft.))[A-Za-z ]+\))?/i);
            if (!matches)
                throw 'Failed to match regex';

            const trackData = matches[0].trim();
            const client = new SpotifyClient();
            const search = queryHint ? `${queryHint} ${trackData}` : trackData;
            const data = await client.trackMetadata(search);
            await MetadataSetter.setMetadata(filePath, data);
        }
    }

    static async rematchMetadata(filePath: string, queryHint: string): Promise<void> {
        const rematchFile = join(cwd(), filePath)
        if (!existsSync(rematchFile))
            throw 'File does not exist!';

        const matches = basename(filePath).match(/^[0-9A-Z-'&,. ]+/i);
        if (!matches)
            throw 'Failed to match regex';

        const client = new SpotifyClient();
        const metadata = await client.trackMetadata(`${queryHint} ${matches}`);
        await MetadataSetter.setMetadata(filePath, metadata);
    }

    static async setMetadata(inFilePath: string, metadata: ID3trackMetadata): Promise<boolean> {
        return new Promise((resolve) => {
            const rename = spawn('ffmpeg', [
                '-i', inFilePath,
                '-metadata', `title=${metadata.title}`,
                '-metadata', `artist=${metadata.artist}`,
                '-metadata', `album=${metadata.album}`,
                '-metadata', `track=${metadata.trackNumber}`,
                '-metadata', `year=${metadata.release_date}`,
                '-metadata', `genre=${metadata.genre}`,
                `${join(dirname(inFilePath), metadata.title.replace('/', '_'))}.mp3`,
                '-y'
            ]);

            rename.stdout.on('data', (data: string) => {
                Logger.debug(`stdout: ${data}`);
            });

            rename.stderr.on('data', (data: string) => {
                Logger.error(chalk.red(`ERROR: ${data}`));
            });

            rename.on('close', (code: number) => {
                Logger.debug(`Child process exited with code ${code}`);
                resolve(true);
            });
        });
    }
}