'use strict';

import {readFileSync, existsSync} from "fs";
import {join} from 'path';
import {cwd} from 'process';

export default class ListReader {
    static readList(path: string): string[] {
        const filePath = join(cwd(), path);
        if (!existsSync(filePath))
            throw 'File not found';

        const data = readFileSync(join(cwd(), path))
        return String(data).split('\n');
    }
}