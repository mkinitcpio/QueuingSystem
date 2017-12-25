import { Phase, Completed, ChannelStatus, Request } from './typings';
import { Task } from './task';
import { Subject } from 'rxjs';
import { Channel } from './channel';
import { Accumulator } from './accumulator';
import { Observable } from 'rxjs/Observable';

export class FirstPhase implements Phase {
    private channelsCount: number;
    private accumulatorCapacity: number;
    private taskInAccumulatorMaxTime: number;
    private distributionFunction: any;
    private channels: Channel[] = [];
    private accumulator: Accumulator;
    private completed$: Subject<Completed> = new Subject();
    private onTaskOverdueInAccumulator$: Subject<void> = new Subject();
    private onTaskTakeFromAccumulator$: Subject<any> = new Subject();

    private timeInPhase = 0;
    private countCompletedTask = 0;

    constructor(channelsCount: number, accumulatorCapacity: number,
        taskInAccumulatorMaxTime: number, distributionFunction: any) {
        this.createChannels(channelsCount, distributionFunction);
        this.createAccumulator(accumulatorCapacity, taskInAccumulatorMaxTime);
        this.onChange();
    }

    private createChannels(channelsCount: number, distributionFunction: any): void {
        for (let i = 0; i < channelsCount; i++) {
            this.channels[i] = new Channel(i, distributionFunction);
        }
    }

    private createAccumulator(accumulatorCapacity: number, taskInAccumulatorMaxTime: number): void {
        this.accumulator = new Accumulator(accumulatorCapacity, taskInAccumulatorMaxTime);
    }

    private check(task: Task): Request {
        for (let i = 0; i < this.channels.length; i++) {
            if (this.channels[i].takeTask(task)) {
                const request: Request = {
                    isStartProcessing: true,
                    idChannel: i
                };
                return request;
            }
        }
        if (this.accumulator.isAccumulatorAvailable()) {
            this.accumulator.addTask(task);
            return {
                isStartProcessing: true,
                idChannel: -1
            };
        }
        return {
            isStartProcessing: false,
            idChannel: -1
        };
    }

    private onChange(): void {
        for (let i = 0; i < this.channels.length; i++) {
            this.channels[i].onEdit().subscribe((completed: Completed) => {
                this.timeInPhase += completed.timeInChannel;
                this.countCompletedTask++;
                this.completed$.next(completed);
                if (this.channels[completed.idChannel].getStatus() !== ChannelStatus.BLOCK) {
                    this.channels[completed.idChannel].setStatus(ChannelStatus.EMPTY);

                    if (this.accumulator.count() > 0) {
                        let task = this.accumulator.getTask().task;
                        let request = this.check(task);
                        this.onTaskTakeFromAccumulator$.next({
                            task: task,
                            channelId: request.idChannel
                        });

                    }
                }
            });
        }
        this.accumulator.onDead.subscribe(() => {
            this.onTaskOverdueInAccumulator$.next();
        });
    }

    public get taskOverdueInAccumulator(): Observable<void> {
        return this.onTaskOverdueInAccumulator$;
    }

    public get taskTakeFromAccumulator(): Observable<void> {
        return this.onTaskTakeFromAccumulator$;
    }

    public setTask(task: Task): Request {
        const request: Request = this.check(task);
        if (request.isStartProcessing) {
            return request;
        } else {
            return request;
        }
    }

    public getCompleted(): Subject<Completed> {
        return this.completed$;
    }

    public block(id: number, state: boolean): void {
        if (state) {
            this.channels[id].setStatus(ChannelStatus.BLOCK);
        } else {
            this.channels[id].setStatus(ChannelStatus.EMPTY);
        }
    }


    public get avgTimeInPhase(): number {
        let avgInPhase = this.timeInPhase / this.countCompletedTask;
        let avgTime = avgInPhase + this.accumulator.avgTimeInAccumulation;
        avgTime = avgTime / 2;
        return avgTime;
    }

    public get getCountTaskInPhase(): number {
        let countTask = 0;
        for (let i = 0; i < this.channels.length; i++) {
            if (this.channels[i].getStatus() !== ChannelStatus.EMPTY) {
                countTask++;
            }
        }
        return countTask;
    }

    public get getAvgTimeInAccumulation(): number {
        return this.accumulator.avgTimeInAccumulation;
    }

    public get getMaxTimeInAccumulation(): number {
        return this.accumulator.getMaxTimeInAccumulation;
    }
}