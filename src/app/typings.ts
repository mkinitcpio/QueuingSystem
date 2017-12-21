import { Task } from './task';
import { Subject } from 'rxjs/Subject';

export interface Completed {
    task: Task;
    idChannel: number;
}

export interface Phase {
    // public
    setTask(task: Task): boolean;
    getCompleted(): Subject<Completed>;

    // private
    check(task: Task): boolean;
    onChange(): void;
}

export enum ChannelStatus {
    EMPTY,
    BLOCK,
    SERVICE
}
