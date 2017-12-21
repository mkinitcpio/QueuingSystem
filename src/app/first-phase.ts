import { Phase, Completed } from './typings';
import { Task } from './task';
import { Subject } from 'rxjs';

export class FirstPhase implements Phase {
    setTask(task: Task): boolean {
        throw new Error("Method not implemented.");
    }
    getCompleted(): Subject<Completed> {
        throw new Error("Method not implemented.");
    }
    check(task: Task): boolean {
        throw new Error("Method not implemented.");
    }
    onChange(): void {
        throw new Error("Method not implemented.");
    }

    constructor(channelsCount: number, accumulatorCapacity: number,
        taskInAccumulatorMaxTime: number, distributionFunction: any) {

    }
}
