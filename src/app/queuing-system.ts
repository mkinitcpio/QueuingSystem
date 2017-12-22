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
        options: Options
    ) {
        this.onFinish$ = new Subject();

        this.firstPhase = new FirstPhase(
            options.firstPhase.channelCount,
            options.firstPhase.accumulatorCapacity,
            options.firstPhase.maxWaitingTime,
            options.firstPhase.distributionFunction,
        );
        this.secondPhase = new SecondPhase(
            options.secondPhase.channelCount,
            options.secondPhase.distributionFunction
        );
    }

    public start(): void {


        this.source.taskEmitter.subscribe(task => {
            // console.log('is emit', task);
            Logger.newTaskAppeared(task.getID());
            let request = this.firstPhase.setTask(task);
            // console.log('start process', request);
            if (request.isStartProcessing) {
                Logger.startProcessingTask(task.getID(), Phases.First, request.idChannel);
            } else {
                Logger.rejectTask(task.getID(), Phases.First);
            }
        });

        this.source.onEmptySource.subscribe(() => {
            this.onFinish$.next();
        });

        this.firstPhase.getCompleted().subscribe(completed => {
            // console.log(completed);
            Logger.onCompletedTask(
                Phases.First,
                completed.idChannel,
                completed.task.getID(),
                completed.timeInChannel
            )
            let request = this.secondPhase.setTask(completed.task);
            if (request.isStartProcessing) {
                Logger.startProcessingTask(completed.task.getID(), Phases.Second, request.idChannel);
            } else {
                Logger.rejectTask(completed.task.getID(), Phases.Second);
            }
        });

        this.secondPhase.getCompleted().subscribe(completed => {
            // console.log('completed', completed);
            Logger.onCompletedTask(
                Phases.Second,
                completed.idChannel,
                completed.task.getID(),
                completed.timeInChannel
            )
            Logger.successfullyCompletedTask(completed.task.getID(), Phases.Second);
        });

        this.source.activate();
    }

    public get onFinish(): Observable<void> {
        return this.onFinish$;
    }
}