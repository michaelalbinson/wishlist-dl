'use strict';

import {env} from 'process';

export default class Logger {
    static log(msg: string) {
        console.log(msg);
    }

    static debug(msg: string) {
        if (env.DEBUG)
            console.debug(msg);
    }

    static error(msg: string) {
        console.error(msg);
    }
}