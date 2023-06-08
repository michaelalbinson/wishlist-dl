'use strict';

import {nextTick} from 'process';
import chalk from "chalk";
import Logger from "./Logger";

export default class SemaphoreQueue {
    private pendingTasks: Array<() => PromiseLike<boolean>>;
    private currentTasks: number;
    private completedTasks: number;
    private totalTasks: number;
    readonly maxParallelism: number;

    constructor(parallelism = 2) {
        this.maxParallelism = parallelism;
        this.currentTasks = 0;
        this.completedTasks = 0;
        this.totalTasks = 0;
        this.pendingTasks = [];
    }

    schedule(lambda: () => PromiseLike<boolean>) {
        this.pendingTasks.push(lambda);
        this.totalTasks++;
        this.tryExecute();
    }

    complete() {
        return new Promise((resolve) => {
            const interval = setInterval(() => {
                if (this.completedTasks === this.totalTasks && this.currentTasks === 0) {
                    clearInterval(interval);
                    resolve(true);
                }
            }, 100);
        })
    }

    private tryExecute() {
        if (this.queuedLength() === 0) {
            Logger.log(chalk.green(`All queued tasks consumed. ${this.completedTasks}/${this.totalTasks} completed. ${this.currentTasks} currently executing.`));
            return false;
        }

        // too many jobs are running right now, delegate checking back to execute the next task to the currently running
        // task
        if (this.currentTasks > this.maxParallelism) {
            Logger.log(chalk.yellow('Job semaphore at capacity, rescheduling task'));
            return false;
        }

        // grab the task slot and run it
        const lambda = this.pendingTasks.shift();
        if (!lambda)
            return false;

        this.currentTasks++;
        Logger.log(chalk.green(`Running new task. ${this.completedTasks}/${this.totalTasks} completed. ${this.currentTasks} currently executing.`));
        nextTick(async () => {
            await lambda();
            this.currentTasks--;
            this.completedTasks++;
            Logger.log(chalk.green('Queueing another task...'));
            this.tryExecute();
        });

        return true;
    }

    queuedLength(): number {
        return this.pendingTasks.length;
    }
}