import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { Channel } from './channel';
import { SecondPhase } from './second-phase';
import { Phase, Completed, Options } from './typings';
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

  ngOnInit(): void {

    let normalDistributionFunction = new NormalDistributionFunctionFactory().get(0.1);
    let exponentialDistributionFunction = new ExponentialDistributionFunctionFactory().get(0.1);

    let source = new Source(1000, exponentialDistributionFunction);

    let options: Options = {
      firstPhase: {
        accumulatorCapacity: 3,
        channelCount: 6,
        maxWaitingTime: 10,
        distributionFunction: normalDistributionFunction
      },
      secondPhase: {
        channelCount: 6,
        distributionFunction: exponentialDistributionFunction
      }
    };

    let system = new QueuingSystem(
      source,
      options
    );

    system.onFinish.subscribe(() => {
      Logger.write('Source пустой.');
    })
    system.start();
  }
}
