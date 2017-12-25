import { Task } from './task';
import { Observable, Subject, BehaviorSubject } from 'rxjs';
import { IdGenerator } from './id-generator';

export class Source {

    private intervals: Array<number> = [];
    private taskEmitter$: Subject<Task>;
    private intervalsEmitter$: BehaviorSubject<any>;
    private onEmptySource$: Subject<void>;

    constructor(
        private tasksCounter: number,
        private sourceDistributionFunction: any
    ) {
        this.taskEmitter$ = new Subject();
        this.intervals = this.generateIntervals(this.tasksCounter);
        this.intervalsEmitter$ = new BehaviorSubject({
            id: 0,
            interval: this.intervals.shift()
        });
        this.onEmptySource$ = new Subject();
    }

    private generateIntervals(length: number): Array<number> {
        return Array.from({ length }, this.sourceDistributionFunction);
    }

    public get taskEmitter(): Observable<Task> {
        return this.taskEmitter$;
    }

    public get onEmptySource(): Observable<void> {
        return this.onEmptySource$;
    }

    public activate(): void {
        this.intervalsEmitter$.subscribe((obj: any) => {
            let interval = obj.interval * 10;
            let timerSubscription = Observable.timer(interval).subscribe(() => {
                let task = new Task(obj.id);
                if (!this.isIntervalsEmpty) {
                    this.taskEmitter$.next(task);
                    this.intervalsEmitter$.next({
                        id: ++obj.id,
                        interval: this.intervals.shift()
                    });
                } else {
                    this.taskEmitter$.next(task);
                    this.onEmptySource$.next();
                }
                timerSubscription.unsubscribe();
            })
        });
    }

    private get isIntervalsEmpty(): boolean {
        return this.intervals.length === 0;
    }
}