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

    public getID() { return this.id; }
    public getStatus() { return this.status; }

    public setStatus(newStatus: ChannelStatus) {
        this.status = newStatus;
    }

    public takeTask(task: Task) {
        if (this.status === ChannelStatus.EMPTY) {

            let processingTime = 0;
            this.status = ChannelStatus.SERVICE;
            const that = this;

            processingTime = this.channelDistributionFunction();
            setTimeout(function () {
                const completed: Completed = {
                    task: task,
                    idChannel: that.id
                };
                that.onEdit$.next(completed);
                this.status = ChannelStatus.EMPTY;
            }
                , processingTime);
            return true;
        }
        return false;
    }

    public onEdit(): Subject<Completed> {
        return this.onEdit$;
    }
}
