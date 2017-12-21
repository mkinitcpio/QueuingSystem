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
