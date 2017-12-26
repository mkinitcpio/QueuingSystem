import { Source } from "./source";
import { Phase, Options, Phases, Model, ChannelStatus } from "./typings";
import { FirstPhase } from "./first-phase";
import { SecondPhase } from "./second-phase";
import { Task } from "./task";
import { Observable, Subject, Subscription } from "rxjs";
import { Logger } from "./logger";

export class QueuingSystem {
    private timer = Observable.interval(100);
    private counter: number;
    private firstPhase: FirstPhase;
    private secondPhase: SecondPhase;
    private onFinish$: Subject<void>;
    private model: Model;
    public onEnd: Subject<number> = new Subject();

    private waitingTasks: Array<{
        channelId: number,
        task: Task
    }> = [];

    constructor(
        private source: Source,
        private options: Options
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

        this.model = {
            completedTasks: [],
            rejectedTasks: [],
            sourceTasks: Array.from({ length: options.sourceTasksCount }),
            queuingSystem: {
                accumulator: {
                    accumulatorCapacity: options.firstPhase.accumulatorCapacity,
                    tasks: []
                },
                firstPhase: {
                    channels: Array.from({ length: options.firstPhase.channelCount }, (index: number) => {
                        return {
                            id: index,
                            state: ChannelStatus.EMPTY
                        }
                    })
                },
                secondPhase: {
                    channels: Array.from({ length: options.secondPhase.channelCount }, (index: number) => {
                        return {
                            id: index,
                            state: ChannelStatus.EMPTY
                        }
                    })
                }
            },
            results: {}
        }
    }

    public start(): void {
        let counter = 0;
        let countTask = 0;
        let subscription: Subscription;
        this.firstPhase.taskOverdueInAccumulator.subscribe(() => {
            let task = this.model.queuingSystem.accumulator.tasks.shift();
            if (task) {
                this.model.rejectedTasks.push({
                    id: task.id
                });
            }
        });

        this.firstPhase.taskTakeFromAccumulator.subscribe((request: any) => {
            this.model.queuingSystem.firstPhase.channels[request.channelId].id = request.task.getID();
            this.model.queuingSystem.firstPhase.channels[request.channelId].state = ChannelStatus.SERVICE;
            this.model.queuingSystem.accumulator.tasks = this.model.queuingSystem.accumulator.tasks.filter(task => task.id !== request.task.getID())
        });

        this.source.taskEmitter.subscribe(task => {
            this.model.sourceTasks.shift();
            if (this.options.sourceTasksCount === 1000) {
                Logger.newTaskAppeared(task.getID());
            }
            let request = this.firstPhase.setTask(task);
            if (request.isStartProcessing) {
                if (request.idChannel === -1) {
                    if (this.options.sourceTasksCount === 1000) {
                        Logger.addTaskToAccumulator(task.getID(), Phases.First);
                    }
                    this.model.queuingSystem.accumulator.tasks.push({
                        id: task.getID()
                    });
                } else {
                    if (this.options.sourceTasksCount === 1000) {
                        Logger.startProcessingTask(task.getID(), Phases.First, request.idChannel);
                    }

                    this.model.queuingSystem.firstPhase.channels[request.idChannel].state = ChannelStatus.SERVICE;
                    this.model.queuingSystem.firstPhase.channels[request.idChannel].id = +task.getID();
                }
            } else {
                if (this.options.sourceTasksCount === 1000) {
                    Logger.rejectTask(task.getID(), Phases.First);
                }
                this.model.rejectedTasks.push({
                    id: task.getID()
                });
            }
        });

        this.source.onEmptySource.subscribe(() => {
            this.onFinish$.next();
        });

        this.firstPhase.getCompleted().subscribe(completed => {
            if (this.options.sourceTasksCount === 1000) {
                Logger.onCompletedTask(
                    Phases.First,
                    completed.idChannel,
                    completed.task.getID(),
                    completed.timeInChannel
                );
            }
            this.model.queuingSystem.firstPhase.channels[completed.idChannel].state = ChannelStatus.EMPTY;
            this.model.queuingSystem.firstPhase.channels[completed.idChannel].id = null;

            let request = this.secondPhase.setTask(completed.task);
            if (request.isStartProcessing) {
                this.model.queuingSystem.firstPhase.channels[completed.idChannel].state = ChannelStatus.EMPTY;
                this.model.queuingSystem.firstPhase.channels[completed.idChannel].id = null;

                this.model.queuingSystem.secondPhase.channels[request.idChannel].state = ChannelStatus.SERVICE;
                this.model.queuingSystem.secondPhase.channels[request.idChannel].id = +completed.task.getID();
                if (this.options.sourceTasksCount === 1000) {
                    Logger.startProcessingTask(completed.task.getID(), Phases.Second, request.idChannel);
                }
            } else {
                if (this.options.sourceTasksCount === 1000) {
                    Logger.rejectTask(completed.task.getID(), Phases.Second);
                }
                this.firstPhase.block(completed.idChannel, true);

                this.model.queuingSystem.firstPhase.channels[completed.idChannel].state = ChannelStatus.BLOCK;
                this.model.queuingSystem.firstPhase.channels[completed.idChannel].id = +completed.task.getID();

                this.waitingTasks.push({
                    channelId: completed.idChannel,
                    task: completed.task
                });
                if (this.options.sourceTasksCount === 1000) {
                    Logger.blockChannel(Phases.First, completed.idChannel);
                }
            }
        });

        this.secondPhase.getCompleted().subscribe(completed => {
            if (this.options.sourceTasksCount === 1000) {
                Logger.onCompletedTask(
                    Phases.Second,
                    completed.idChannel,
                    completed.task.getID(),
                    completed.timeInChannel
                );
            }
            this.model.queuingSystem.secondPhase.channels[completed.idChannel].state = ChannelStatus.EMPTY;
            this.model.queuingSystem.secondPhase.channels[completed.idChannel].id = null;

            if (this.options.sourceTasksCount === 1000) {
                Logger.successfullyCompletedTask(completed.task.getID(), Phases.Second);
            }
            this.model.completedTasks.push({ id: completed.task.getID() });

            if (this.waitingTasks.length != 0) {
                let waitingTask = this.waitingTasks.shift();
                let request = this.secondPhase.setTask(waitingTask.task);
                if (request.isStartProcessing) {
                    if (this.options.sourceTasksCount === 1000) {
                        Logger.unblockChannel(Phases.First, waitingTask.channelId);
                    }
                    this.firstPhase.block(waitingTask.channelId, false);

                    this.model.queuingSystem.firstPhase.channels[waitingTask.channelId].state = ChannelStatus.EMPTY;
                    this.model.queuingSystem.firstPhase.channels[waitingTask.channelId].id = null;

                    this.model.queuingSystem.secondPhase.channels[request.idChannel].state = ChannelStatus.SERVICE;
                    this.model.queuingSystem.secondPhase.channels[request.idChannel].id = +waitingTask.task.getID();
                }
            }
            if (this.model.completedTasks.length + this.model.rejectedTasks.length === this.options.sourceTasksCount) {
                subscription.unsubscribe();
                this.model.results.completedTasks = this.model.completedTasks.length;
                this.model.results.rejectedTasks = this.model.rejectedTasks.length;
                this.model.results.absoluteThroughputOfSystem = (0.05 * (this.firstPhase.avgTimeInPhase + this.secondPhase.avgTimeInPhase) / 20).toFixed(2);
                this.model.results.averageTasksInSystem = (countTask / counter).toFixed(2);
                this.model.results.a = ((this.model.results.rejectedTasks / this.options.sourceTasksCount) * 100).toFixed(2);
                this.model.results.averageTimeInAccumulator = this.firstPhase.getAvgTimeInAccumulation.toFixed(2);
                this.model.results.maxTimeInAccumulator = this.firstPhase.getMaxTimeInAccumulation;
                this.onEnd.next(this.model.results.a);
            }
        });

        this.source.activate();

        subscription = this.timer.subscribe(() => {
            countTask =
                this.firstPhase.getCountTaskInPhase && this.secondPhase.getCountTaskInPhase
                    ? countTask + this.firstPhase.getCountTaskInPhase + this.secondPhase.getCountTaskInPhase
                    : countTask;
            counter =
                this.firstPhase.getCountTaskInPhase && this.secondPhase.getCountTaskInPhase
                    ? counter + 1
                    : counter;
        });
    }

    public get onFinish(): Observable<void> {
        return this.onFinish$;
    }

    public getModel(): Model {
        return this.model;
    }
}