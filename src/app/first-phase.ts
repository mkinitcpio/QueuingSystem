import { Phase, Completed, ChannelStatus } from './typings';
import { Task } from './task';
import { Subject } from 'rxjs';
import { Channel } from './channel';
import { Accumulator } from './accumulator';

export class FirstPhase implements Phase {
    private channelsCount: number;
    private accumulatorCapacity: number;
    private taskInAccumulatorMaxTime: number;
    private distributionFunction: any;
    private channels: Channel[] = [];
    private accumulator: Accumulator;
    private completed$: Subject<Completed> = new Subject();

    constructor(channelsCount: number, accumulatorCapacity: number,
        taskInAccumulatorMaxTime: number, distributionFunction: any) {
        this.createChannels(channelsCount, distributionFunction);
        this.createAccumulator(accumulatorCapacity, taskInAccumulatorMaxTime);
        this.onChange();
    }

    private createChannels(channelsCount: number, distributionFunction: any): void {
        for (let i = 0; i < channelsCount; i++) {
            this.channels[i] = new Channel(i + 1, distributionFunction);
        }
    }

    private createAccumulator(accumulatorCapacity: number, taskInAccumulatorMaxTime: number): void {
        this.accumulator = new Accumulator(accumulatorCapacity, taskInAccumulatorMaxTime);
    }

    private check(task: Task): boolean {
        for (let i = 0; i < this.channels.length; i++) {
            if (this.channels[i].takeTask(task)) {
                return true;
            }
        }
        if (this.accumulator.isAccumulatorAvailable()) {
            this.accumulator.addTask(task);
            return true;
        }
        return false;
    }

    private onChange(): void {
        for (let i = 0; i < this.channels.length; i++) {
            this.channels[i].onEdit().subscribe((completed: Completed) => {
                this.completed$.next(completed);
                this.channels[completed.idChannel - 1].setStatus(ChannelStatus.EMPTY);
                if (this.accumulator.count() > 0) {
                    this.check(this.accumulator.getTast());
                }
            });
        }
    }

    public setTask(task: Task): boolean {
        if (this.check(task)) {
            return true;
        } else {
            return false;
        }
    }
    public getCompleted(): Subject<Completed> {
        return this.completed$;
    }


}
