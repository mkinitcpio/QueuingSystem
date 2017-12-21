import { Task } from './task';

export class Accumulator {
    private readonly capacity: number;
    private requestList: Array<Task> = [];
    private readonly maxLifeTime: number;

    constructor(capacity: number, taskInAccumulatorMaxTime: number) {
        this.capacity = capacity;
        this.maxLifeTime = taskInAccumulatorMaxTime;
    }

    public addTask(task: Task): void {
        if (this.isAccumulatorAvailable()) {
            this.requestList.push(task);
        }
        setTimeout(() => {
            this.requestList = this.requestList.filter((value) => task !== value);
        }, this.maxLifeTime);
    }

    public getTast(): Task {
        return this.requestList.shift();
    }

    public isAccumulatorAvailable() {
        return this.requestList.length < this.capacity;
    }

    public count() {
        return this.requestList.length;
    }
}
