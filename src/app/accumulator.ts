import { Task } from './task';

export class Accumulator {
    private readonly capacity: number;
    private taskList: Array<Task> = [];
    private readonly maxLifeTime: number;

    constructor(capacity: number, taskInAccumulatorMaxTime: number) {
        this.capacity = capacity;
        this.maxLifeTime = taskInAccumulatorMaxTime;
    }

    public addTask(task: Task): void {
        if (this.isAccumulatorAvailable()) {
            this.taskList.push(task);
        }
        setTimeout(() => {
            this.taskList = this.taskList.filter((value) => task !== value);
        }, this.maxLifeTime);
    }

    public getTast(): Task {
        return this.taskList.shift();
    }

    public isAccumulatorAvailable() {
        return this.taskList.length < this.capacity;
    }

    public count() {
        return this.taskList.length;
    }
}
