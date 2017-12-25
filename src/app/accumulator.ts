import { Task } from './task';
import { AccumulationTask } from './typings';
import { take } from 'rxjs/operators/take';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs';

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
            let timer = Observable.timer(this.maxLifeTime).subscribe(() => {
                if(this.taskList.find(value => value.task.getID() == task.getID())){
                    this.taskList = this.taskList.filter((value) => task.getID() !== value.task.getID());
                    this.onDead$.next(task);
                }
                timer.unsubscribe();
            });
        }
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

    public get onDead(): Subject<Task> {
        return this.onDead$;
    }
}
