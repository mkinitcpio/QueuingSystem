import { Task } from './task';
import { Subject } from 'rxjs/Subject';

declare module '@q-app' {
    export interface Completed {
        task: Task;
        idChannel: number;
    }

    export interface Phase {
        //publick
        setTast(task: Task): boolean;
        getCompleted(): Subject<Completed>

        //private
        check(): void;
        onEdit(): Subject<any>;
        getChannelDistributionFunction(intensity: number);
    }
}
