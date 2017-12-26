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
  public lineChartLabels: Array<any> = [0, 0.0001, 0.0031, 0.0061, 0.0091, 0.0121, 0.0151, 0.0181, 0.0201, 0.0221];
  public lineRegrationChartData: Array<any> = [];
  public lineChartOptions: any = {
    responsive: true
  };
  public lineChartColors: Array<any> = [
    { // grey
      backgroundColor: 'rgba(148,159,177,0.2)',
      borderColor: 'rgba(148,159,177,1)',
      pointBackgroundColor: 'rgba(148,159,177,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    }, { // dark grey
      backgroundColor: 'rgba(77,83,96,0.2)',
      borderColor: 'rgba(77,83,96,1)',
      pointBackgroundColor: 'rgba(77,83,96,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(77,83,96,1)'
    }
  ];
  public lineChartLegend: boolean = true;
  public lineChartType: string = 'line';

  public randomize(): void {

  }

  ngOnChanges(changes: SimpleChanges): void {
    this.results.unshift(100);
    this.results.push(0);
    this.results.push(0);
    this.generateRegrationPoints()
    this.lineChartData = [{ data: this.results, label: 'Зависимость вероятности отказа от интенсивности потока обслуживания' },
    { data: this.lineRegrationChartData, label: 'Регрессия' }];
  }

  private generateRegrationPoints() {
    let value = [...this.results];
    let x = [...this.lineChartLabels];
    // let Disp = [];
    // let SUMM = 0;
    // let MaxDisp = 0;
    // let Koch = 0;
    let M = x.length;
    let SummX = 0;
    let SummY = 0;
    let SummX2 = 0;
    let SummX3 = 0;
    let SummX4 = 0;
    let XY = 0;
    let X2Y = 0;
    for (let i = 0; i < M; i++) {
      SummX += +x[i];
      SummY += +value[i];
      SummX2 += Math.pow(+x[i], 2);
      SummX3 += Math.pow(+x[i], 3);
      SummX4 += Math.pow(+x[i], 4);
      XY += +value[i] * +x[i];
      X2Y += Math.pow(+x[i], 2) * +value[i];
    }
    let lambda = (SummX2 * SummX2 * SummX2 + SummX * SummX * SummX4 + M * SummX3 * SummX3 - M * SummX2 * SummX4 - SummX * SummX2 * SummX3 - SummX * SummX2 * SummX3);
    let A = (SummY * SummX2 * SummX2 + SummX * SummX * X2Y + M * SummX3 * XY - M * SummX2 * X2Y - SummX * XY * SummX2 - SummX * SummX3 * SummY) / lambda;
    let B = (SummX2 * XY * SummX2 + SummY * SummX * SummX4 + M * SummX3 * X2Y - M * XY * SummX4 - SummY * SummX3 * SummX2 - X2Y * SummX * SummX2) / lambda;
    let C = (SummX2 * SummX2 * X2Y + SummX * XY * SummX4 + SummX3 * SummX3 * SummY - SummX4 * SummX2 * SummY - SummX3 * XY * SummX2 - SummX * SummX3 * X2Y) / lambda;
    let regrationArray = [];
    for (let i = 0; i < M; i++) {
      regrationArray.push(Math.abs(C + B * +x[i] + A * Math.pow(+x[i], 2)));
    }
    this.lineRegrationChartData = regrationArray;
  }
}
