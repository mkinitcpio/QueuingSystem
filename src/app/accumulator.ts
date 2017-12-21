import { Task } from './task';

export class Accumulator {
    private readonly capacity: number;
    private readonly requestList: Array<Task> = [];

    constructor(capacity: number) {
        this.capacity = capacity;
    }

    public AddRequest(task: Task) {
        if (this.isAccumulatorAvailable()) {
            this.requestList.push(task);
        }
    }
    public isAccumulatorAvailable() {
        return this.requestList.length < this.capacity;
    }
    public count() {
        return this.requestList.length;
    }
}
