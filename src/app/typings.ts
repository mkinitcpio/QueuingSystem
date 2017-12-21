import { Task } from './task';
import { Subject } from 'rxjs/Subject';

export interface Completed {
    task: Task;
    idChannel: number;
}

export interface Phase {
    setTask(task: Task): boolean;
    getCompleted(): Subject<Completed>;
}

export enum ChannelStatus {
    EMPTY,
    BLOCK,
    SERVICE
}

export interface Options {
    firstPhase: {
        channelCount: number,
        accumulatorCapacity: number,
        maxWaitingTime: number,
        distributionFunction: Function
    },
    secondPhase: {
        channelCount: number,
        distributionFunction: Function
    },
}

export enum Phases{
        First = 1,
        Second = 2
}