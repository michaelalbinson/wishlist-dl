#!/usr/bin/env node

'use strict';

import {Command} from "commander";
import {config} from 'dotenv';
import {argv} from 'process';
import WishlistCommand from "./commands/WishlistCommand";
import RematchCommand from "./commands/RematchCommand";
import RegenerateMetadata from "./commands/RegenerateMetadata";
import PlaylistFileBuilder from "./PlaylistFileBuilder";
import DirCleaner from "./DirCleaner";

async function run() {
    config();

    const program = new Command();
    program
        .command('rematch')
        .argument('<filename>', 'file to rematch metadata on')
        .argument('<query_hint>', 'the query hint for spotify')
        .action(async (filename, queryHint) => {
            await RematchCommand.exec(filename, queryHint);
        });

    program
        .command('wishlist')
        .argument('<filename>', 'The file that contains your wishlist')
        .option('--hint <hint>', "A hint to pass to spotify", "")
        .option('--output-dir <outputDir>', "The output directory", "")
        .option('--parallelism <parallelism>', "How many downloads to run in parallel", "1")
        .action(async (filename, options) => {
            await WishlistCommand.exec(filename, options.hint, Number(options.parallelism) || 1);
        });

    program
        .command('regenerate-metadata')
        .argument('<directory>')
        .option('--hint <hint>', "A hint to pass to spotify", "")
        .action(async (directory, options) => {
            await RegenerateMetadata.exec(directory, options.hint);
        });

    program
        .command('m3u')
        .argument('<directory>')
        .action(async (directory) => {
            await PlaylistFileBuilder.build3MU(directory);
        });

    program
        .command('cleanup')
        .argument('directory')
        .action(async (directory) => {
            await DirCleaner.cleanup(directory);
        });

    program.parse(argv);
}

run();