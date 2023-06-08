'use strict';

import {spawn} from "child_process";
import {cwd} from 'process';
import {join} from 'path';
import chalk from "chalk";
import Logger from "./Logger";

export default class Downloader {
    static start(url: string): PromiseLike<boolean> {
        return new Promise(resolve => {
            const download = spawn('yt-dlp', ['-x', '--audio-format', 'mp3', url], {
                cwd: join(cwd(), 'downloads')
            });

            download.stdout.on('data', (data: string) => {
                Logger.debug(`stdout: ${data}`);
            });

            download.stderr.on('data', (data: string) => {
                Logger.error(chalk.red(`ERROR: ${data}`));
            });

            download.on('close', (code: number) => {
                Logger.debug(`Child process exited with code ${code}`);
                resolve(true);
            });
        });
    }
}