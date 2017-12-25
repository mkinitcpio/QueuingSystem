import { Subject } from 'rxjs';

import { Phase, Completed, ChannelStatus, Request } from './typings';
import { Task } from './task';
import { Channel } from './channel';
import { of } from 'rxjs/observable/of';

export class SecondPhase implements Phase {
    private channels: Channel[] = [];
    private completed$: Subject<Completed> = new Subject();

    private timeInPhase = 0;
    private countCompletedTask = 0;

    constructor(channelsCount: number, distributionFunction: any) {
        this.createChannels(channelsCount, distributionFunction);
        this.onChange();
    }

    private createChannels(channelsCount: number, distributionFunction: any): void {
        for (let i = 0; i < channelsCount; i++) {
            this.channels[i] = new Channel(i, distributionFunction);
        }
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
                this.channels[completed.idChannel].setStatus(ChannelStatus.EMPTY);
            });
        }
    }

    public get avgTimeInPhase(): number {
        let avgTime = this.timeInPhase / this.countCompletedTask;
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
}
