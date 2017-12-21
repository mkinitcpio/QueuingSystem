import { Source } from "./source";
import { Phase, Options } from "./typings";
import { FirstPhase } from "./first-phase";
import { SecondPhase } from "./second-phase";
import { Task } from "./task";
import { Subject } from "rxjs/Subject";
import { Observable } from "rxjs/Observable";



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
        this.firstPhase.getCompleted().subscribe(completed =>{
            if(!this.secondPhase.setTask(completed.task)){
                //Todo: implement counter;
            }
        });

        this.secondPhase.getCompleted().subscribe(completed =>{
            //Todo: implement counter;
        });

        this.source.taskEmitter.subscribe(task =>{
            if(!this.firstPhase.setTask(task)){
                //Todo: implement counter;
            }
        });

        this.source.onEmptySource.subscribe(()=>{
            this.onFinish$.next();
        });
        
        this.source.activate();
    }

    public get onFinish(): Observable<void>{
        return this.onFinish$;
    }
}