import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { Channel } from './channel';
import { SecondPhase } from './second-phase';
import { Phase, Completed, Options, Model } from './typings';
import { Task } from './task';
import { QueuingSystem } from './queuing-system';
import { Source } from './source';
import { ExponentialDistributionFunctionFactory } from './factories/exponential-distribution-function-factory';
import { Logger } from './logger';
import { NormalDistributionFunctionFactory } from './factories/normal-distribution-function-factory';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  public tasks = [];
  public completedTasks = [];
  public rejectedTasks = [];

  public model: Model;

  ngOnInit(): void {

    let normalDistributionFunction = new NormalDistributionFunctionFactory().get(0.01);
    let exponentialDistributionFunction = new ExponentialDistributionFunctionFactory().get(0.02);
    let exponentialDistributionFunction1 = new ExponentialDistributionFunctionFactory().get(1);
    let source = new Source(100, exponentialDistributionFunction1);
    let options: Options = {
      firstPhase: {
        accumulatorCapacity: 9,
        channelCount: 5,
        maxWaitingTime: 1000,
        distributionFunction: normalDistributionFunction
      },
      secondPhase: {
        channelCount: 6,
        distributionFunction: exponentialDistributionFunction
      },
      sourceTasksCount: 100
    };

    let system = new QueuingSystem(
      source,
      options
    );

    system.onFinish.subscribe(() => {
      Logger.write('Source пустой.');
    });

    this.model = system.getModel();
    system.start();
  }
}
