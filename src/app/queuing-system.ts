import { Source } from "./source";
import { Phase, Options, Phases, Model, ChannelStatus } from "./typings";
import { FirstPhase } from "./first-phase";
import { SecondPhase } from "./second-phase";
import { Task } from "./task";
import { Subject } from "rxjs/Subject";
import { Observable } from "rxjs/Observable";
import { Logger } from "./logger";

export class QueuingSystem {

    private firstPhase: FirstPhase;
    private secondPhase: SecondPhase;
    private onFinish$: Subject<void>;
    private model: Model;
    private waitingTasks: Array<{
        channelId: number,
        task: Task
    }> = [];

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
            }
        }
    }


    public start(): void {
        this.firstPhase.taskOverdueInAccumulator.subscribe(() => {
            let task = this.model.queuingSystem.accumulator.tasks.shift();
            console.log('превышено время ожидания', task);
            if (task) {
                this.model.rejectedTasks.push({
                    id: task.id
                });
            }
        });

        this.firstPhase.taskTakeFromAccumulator.subscribe((request: any) => {
            console.log('Взят из аккумулятора', request);
            
            this.model.queuingSystem.firstPhase.channels[request.channelId].id = request.task.getID();
            this.model.queuingSystem.firstPhase.channels[request.channelId].state = ChannelStatus.SERVICE;
            this.model.queuingSystem.accumulator.tasks = this.model.queuingSystem.accumulator.tasks.filter(task => task.id !== request.task.getID())
        
        });

        this.source.taskEmitter.subscribe(task => {
            this.model.sourceTasks.shift();
            Logger.newTaskAppeared(task.getID());
            let request = this.firstPhase.setTask(task);
            if (request.isStartProcessing) {
                if (request.idChannel === -1) {
                    Logger.addTaskToAccumulator(task.getID(), Phases.First);
                    this.model.queuingSystem.accumulator.tasks.push({
                        id: task.getID()
                    });
                } else {
                    Logger.startProcessingTask(task.getID(), Phases.First, request.idChannel);

                    this.model.queuingSystem.firstPhase.channels[request.idChannel].state = ChannelStatus.SERVICE;
                    this.model.queuingSystem.firstPhase.channels[request.idChannel].id = +task.getID();
                }
            } else {
                Logger.rejectTask(task.getID(), Phases.First);
                this.model.rejectedTasks.push({
                    id: task.getID()
                });
            }
        });

        this.source.onEmptySource.subscribe(() => {
            this.onFinish$.next();
        });

        this.firstPhase.getCompleted().subscribe(completed => {
            Logger.onCompletedTask(
                Phases.First,
                completed.idChannel,
                completed.task.getID(),
                completed.timeInChannel
            );
            this.model.queuingSystem.firstPhase.channels[completed.idChannel].state = ChannelStatus.EMPTY;
            this.model.queuingSystem.firstPhase.channels[completed.idChannel].id = null;

            let request = this.secondPhase.setTask(completed.task);
            if (request.isStartProcessing) {
                this.model.queuingSystem.firstPhase.channels[completed.idChannel].state = ChannelStatus.EMPTY;
                this.model.queuingSystem.firstPhase.channels[completed.idChannel].id = null;

                this.model.queuingSystem.secondPhase.channels[request.idChannel].state = ChannelStatus.SERVICE;
                this.model.queuingSystem.secondPhase.channels[request.idChannel].id = +completed.task.getID();

                Logger.startProcessingTask(completed.task.getID(), Phases.Second, request.idChannel);
            } else {
                Logger.rejectTask(completed.task.getID(), Phases.Second);
                this.firstPhase.block(completed.idChannel, true);

                this.model.queuingSystem.firstPhase.channels[completed.idChannel].state = ChannelStatus.BLOCK;
                this.model.queuingSystem.firstPhase.channels[completed.idChannel].id = +completed.task.getID();

                this.waitingTasks.push({
                    channelId: completed.idChannel,
                    task: completed.task
                });
                Logger.blockChannel(Phases.First, completed.idChannel);
            }
        });

        this.secondPhase.getCompleted().subscribe(completed => {
            Logger.onCompletedTask(
                Phases.Second,
                completed.idChannel,
                completed.task.getID(),
                completed.timeInChannel
            );

            this.model.queuingSystem.secondPhase.channels[completed.idChannel].state = ChannelStatus.EMPTY;
            this.model.queuingSystem.secondPhase.channels[completed.idChannel].id = null;

            Logger.successfullyCompletedTask(completed.task.getID(), Phases.Second);

            this.model.completedTasks.push({ id: completed.task.getID() });

            if (this.waitingTasks.length != 0) {
                let waitingTask = this.waitingTasks.shift();
                let request = this.secondPhase.setTask(waitingTask.task);
                if (request.isStartProcessing) {
                    Logger.unblockChannel(Phases.First, waitingTask.channelId);
                    this.firstPhase.block(waitingTask.channelId, false);

                    this.model.queuingSystem.firstPhase.channels[waitingTask.channelId].state = ChannelStatus.EMPTY;
                    this.model.queuingSystem.firstPhase.channels[waitingTask.channelId].id = null;

                    this.model.queuingSystem.secondPhase.channels[request.idChannel].state = ChannelStatus.SERVICE;
                    this.model.queuingSystem.secondPhase.channels[request.idChannel].id = +waitingTask.task.getID();
                }
            }
        });

        this.source.activate();
    }

    public get onFinish(): Observable<void> {
        return this.onFinish$;
    }

    public getModel(): Model {
        return this.model;
    }
}