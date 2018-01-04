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
import { Observable } from 'rxjs';
import { Controller } from './controller';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {


  public tasks = [];
  public completedTasks = [];
  public rejectedTasks = [];
  public results = [];
  public model: Model;
  public i = [];

  public isReady = false;
  public isStarted = false;
  public isShowChart = false;
  public isShowStatistics = false;

  ngOnInit(): void {  }

  public showStatistics(): void {
    this.isShowStatistics = true;
  }

  public start(): void {
    this.isReady = false;
    this.isStarted = true;
    let normalDistributionFunction = new NormalDistributionFunctionFactory().get(0.02);
    let exponentialDistributionFunction = new ExponentialDistributionFunctionFactory().get(0.02);
    let exponentialDistributionFunction1 = new ExponentialDistributionFunctionFactory().get(0.2);
    let source = new Source(1000, exponentialDistributionFunction1);
    let options: Options = {
      firstPhase: {
        accumulatorCapacity: 8,
        channelCount: 7,
        maxWaitingTime: 3000,
        distributionFunction: normalDistributionFunction
      },
      secondPhase: {
        channelCount: 8,
        distributionFunction: exponentialDistributionFunction
      },
      sourceTasksCount: 1000
    };
    let system = new QueuingSystem(
      source,
      options
    );
    this.model = system.getModel();
    system.start();
    system.onEnd.subscribe(() => {
      this.generateChartsData();
    });
  }

  generateChartsData(): any {
    let sources = [];
    let s = [];
    for (let i = 0.0001; i <= 0.02; i += 0.003) {
      this.i.push(i);
      let normalDistributionFunction = new NormalDistributionFunctionFactory().get(i);
      let exponentialDistributionFunction = new ExponentialDistributionFunctionFactory().get(i);
      let exponentialDistributionFunction1 = new ExponentialDistributionFunctionFactory().get(0.1);
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
      sources.push(system.onEnd);
      s.push(system);
    }

    Observable.zip(...sources).subscribe((results) => {
      this.results = results.sort((a: number, b: number) => b - a);
      this.isReady = true;
    });

    for (const so of s) {
      so.start();
    }
  }

  public closeDialog(): void {
    this.isShowStatistics = false;
  }

  public showLog() {
    Controller.setState();
  }
}
