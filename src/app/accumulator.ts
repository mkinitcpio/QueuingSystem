import { Task } from './task';
import { AccumulationTask } from './typings';
import { take } from 'rxjs/operators/take';
import { Subject } from 'rxjs/Subject';

export class Accumulator {
    private readonly capacity: number;
    private taskList: Array<AccumulationTask> = [];
    private readonly maxLifeTime: number;
    private onDead$: Subject<Task> = new Subject();

    constructor(capacity: number, taskInAccumulatorMaxTime: number) {
        this.capacity = capacity;
        this.maxLifeTime = taskInAccumulatorMaxTime;
    }

    public addTask(task: Task): void {
        const accumulationTask: AccumulationTask = {
            task: task,
            timeInAccumulator: new Date().getMilliseconds(),
        };

        if (this.isAccumulatorAvailable()) {
            this.taskList.push(accumulationTask);
        }
        setTimeout(() => {
            this.taskList = this.taskList.filter((value) => task !== value.task);
            this.onDead$.next(task);
        }, this.maxLifeTime);
    }

    public getTask(): AccumulationTask {
        const newTime = new Date().getMilliseconds();
        this.taskList[0].timeInAccumulator = (this.taskList[0].timeInAccumulator - newTime);
        return this.taskList.shift();
    }

    public isAccumulatorAvailable() {
        return this.taskList.length < this.capacity;
    }

    public count() {
        return this.taskList.length;
    }

    public onDead(): Subject<Task> {
        return this.onDead$;
    }
}
