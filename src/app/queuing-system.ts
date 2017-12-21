import { Source } from "./source";
import { Phase, Options, Phases } from "./typings";
import { FirstPhase } from "./first-phase";
import { SecondPhase } from "./second-phase";
import { Task } from "./task";
import { Subject } from "rxjs/Subject";
import { Observable } from "rxjs/Observable";
import { Logger } from "./logger";

export class QueuingSystem {

    private firstPhase: Phase;
    private secondPhase: Phase;
    private onFinish$: Subject<void>;

    constructor(
        private source: Source,
        firstPhaseDistributionFunction: Function,
        secondPhaseDistributionFunction: Function,
        options: Options
    ) {
        this.onFinish$ = new Subject();

        this.firstPhase = new FirstPhase(
            options.firstPhase.channelCount,
            options.firstPhase.accumulatorCapacity,
            options.firstPhase.maxWaitingTime,
            firstPhaseDistributionFunction
        );

        this.secondPhase = new SecondPhase(
            options.secondPhase.channelCount,
            secondPhaseDistributionFunction
        );
    }

    public start(): void {
        this.firstPhase.getCompleted().subscribe(completed => {
            if (!this.secondPhase.setTask(completed.task)) {
                Logger.rejectTask(completed.task.getID(), Phases.Second);
            } else {
                Logger.startProcessingTask(completed.task.getID(), Phases.Second, null);
            }
        });

        this.secondPhase.getCompleted().subscribe(completed => {
            Logger.successfullyCompletedTask(completed.task.getID(), Phases.First);
        });

        this.source.taskEmitter.subscribe(task => {
            Logger.newTaskAppeared(task.getID());
            if (!this.firstPhase.setTask(task)) {
                Logger.rejectTask(task.getID(), Phases.First);
            } else {
                Logger.startProcessingTask(task.getID(), Phases.First, null);
            }
        });

        this.source.onEmptySource.subscribe(() => {
            this.onFinish$.next();
        });
        
        this.source.activate();
    }

    public get onFinish(): Observable<void> {
        return this.onFinish$;
    }
}