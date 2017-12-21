import { Subject } from 'rxjs/Subject';
import { Completed, ChannelStatus } from './typings';
import { Task } from './task';

export class Channel {
    private id: number;
    private status: ChannelStatus;
    private channelDistributionFunction: any;

    private onEdit$: Subject<Completed> = new Subject();

    constructor(id: number, distributionFunction: any) {
        this.id = id;
        this.channelDistributionFunction = distributionFunction;
        this.status = ChannelStatus.EMPTY;
    }

    getID() { return this.id; }
    getStatus() { return this.status; }

    setStatus(newStatus: ChannelStatus) {
        this.status = newStatus;
    }

    takeTask(task: Task) {
        if (this.status === ChannelStatus.EMPTY) {

            let processingTime = 0;
            this.status = ChannelStatus.SERVICE;
            const that = this;

            processingTime = this.channelDistributionFunction();
            setTimeout(function () {
                that.status = 0;
                const completed: Completed = {
                    task: task,
                    idChannel: this.id
                };
                that.onEdit$.next(completed);
            }
                , processingTime);
            this.status = ChannelStatus.EMPTY;
            return true;
        }
        return false;
    }

    onEdit(): Subject<Completed> {
        return this.onEdit$;
    }
}
