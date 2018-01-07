import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css']
})
export class ChartComponent implements OnChanges {


  @Input()
  results;

  @Input()
  i;
  // lineChart

  public lineChartData: Array<any> = [
    { data: [65, 59, 80, 81, 56, 55, 40, 57, 31, 15, 46], label: 'A' },
    { data: [28, 48, 40, 19, 86, 27, 90, 84, 24, 15, 48], label: 'Series B' }
  ];
  public lineChartLabels: Array<any> = [ 0.0001, 0.0031, 0.0061, 0.0091, 0.0121, 0.0151, 0.0181, 0.0201, 0.0221];
  public lineRegressionChartData: Array<any> = [];
  public lineChartOptions: any = {
    responsive: true
  };
  public lineChartColors: Array<any> = [
    { // grey
      backgroundColor: 'rgba(241,11,22,0.2)',
      borderColor: 'rgba(241,11,22,1)',
      pointBackgroundColor: 'rgba(241,11,22,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(241,11,22,0.8)'
    }, {
      backgroundColor: 'rgba(16,5,231,0.2)',
      borderColor: 'rgba(16,5,231,1)',
      pointBackgroundColor: 'rgba(16,5,231,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(16,5,231,1)'
    }
  ];
  public lineChartLegend: boolean = true;
  public lineChartType: string = 'line';

  public randomize(): void {

  }

  ngOnChanges(changes: SimpleChanges): void {
    this.results.push(0);
    this.results.push(0);

    this.generateRegressionPoints()

    this.lineChartData = [{ data: this.results, label: 'Эксперементальная зависимость вероятности отказа от интенсивности потока обслуживания' },
    { data: this.lineRegressionChartData, label: 'Регрессивная зависимость вероятности отказа от интенсивности потока обслуживания' }];
  }

  private generateRegressionPoints() {
    let outputValue = [...this.results];
    let inputValues = [...this.lineChartLabels];
    let count = inputValues.length;
    let inputValuesSum = 0;
    let outputValuesSum = 0;
    let inputValuesSumIn2 = 0;
    let inputValuesSumIn3 = 0;
    let inputValuesSumIn4 = 0;
    let XY = 0;
    let X2Y = 0;
    for (let i = 0; i < count; i++) {
      inputValuesSum += +inputValues[i];
      outputValuesSum += +outputValue[i];
      inputValuesSumIn2 += Math.pow(+inputValues[i], 2);
      inputValuesSumIn3 += Math.pow(+inputValues[i], 3);
      inputValuesSumIn4 += Math.pow(+inputValues[i], 4);
      XY += +outputValue[i] * +inputValues[i];
      X2Y += Math.pow(+inputValues[i], 2) * +outputValue[i];
    }
    let lambda = (inputValuesSumIn2 * inputValuesSumIn2 * inputValuesSumIn2 + inputValuesSum * inputValuesSum * inputValuesSumIn4 + count * inputValuesSumIn3 * inputValuesSumIn3 - count * inputValuesSumIn2 * inputValuesSumIn4 - inputValuesSum * inputValuesSumIn2 * inputValuesSumIn3 - inputValuesSum * inputValuesSumIn2 * inputValuesSumIn3);
    let A = (outputValuesSum * inputValuesSumIn2 * inputValuesSumIn2 + inputValuesSum * inputValuesSum * X2Y + count * inputValuesSumIn3 * XY - count * inputValuesSumIn2 * X2Y - inputValuesSum * XY * inputValuesSumIn2 - inputValuesSum * inputValuesSumIn3 * outputValuesSum) / lambda;
    let B = (inputValuesSumIn2 * XY * inputValuesSumIn2 + outputValuesSum * inputValuesSum * inputValuesSumIn4 + count * inputValuesSumIn3 * X2Y - count * XY * inputValuesSumIn4 - outputValuesSum * inputValuesSumIn3 * inputValuesSumIn2 - X2Y * inputValuesSum * inputValuesSumIn2) / lambda;
    let C = (inputValuesSumIn2 * inputValuesSumIn2 * X2Y + inputValuesSum * XY * inputValuesSumIn4 + inputValuesSumIn3 * inputValuesSumIn3 * outputValuesSum - inputValuesSumIn4 * inputValuesSumIn2 * outputValuesSum - inputValuesSumIn3 * XY * inputValuesSumIn2 - inputValuesSum * inputValuesSumIn3 * X2Y) / lambda;
    let regressionArray = [];
    for (let i = 0; i < count; i++) {
      regressionArray.push(Math.abs(C + B * +inputValues[i] + A * Math.pow(+inputValues[i], 2)));
    }
    this.lineRegressionChartData = regressionArray;
  }
}