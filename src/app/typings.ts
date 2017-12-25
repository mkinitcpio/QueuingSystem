import { Task } from './task';
import { Subject } from 'rxjs/Subject';

export interface Completed {
    task: Task;
    idChannel: number;
    timeInChannel: number;
}

export interface AccumulationTask {
    task: Task;
    timeInAccumulator: number;
}

export interface Request {
    isStartProcessing: boolean;
    idChannel: number;
}

export interface Phase {
    setTask(task: Task): Request;
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
    };
    secondPhase: {
        channelCount: number,
        distributionFunction: Function
    };
    sourceTasksCount: number
}

export enum Phases {
    First = 1,
    Second = 2
}

export interface Model {
    queuingSystem: {
        accumulator: {
            accumulatorCapacity: number,
            tasks: Array<any>
        },
        firstPhase: {
            channels: Array<ChannelModel>
        },
        secondPhase: {
            channels: Array<ChannelModel>
        }
    },
    rejectedTasks: Array<any>,
    completedTasks: Array<any>,
    sourceTasks: Array<any>
}

interface ChannelModel {
    id: number,
    state: ChannelStatus
}
