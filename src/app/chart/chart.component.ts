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
    { data: [65, 59, 80, 81, 56, 55, 40, 57, 31, 15, 46], label: 'Зависимость вероятность=и отказа от интенсивности потока обслуживания' }
  ];
  public lineChartLabels: Array<any> = [0, 0.0001, 0.0031, 0.0061, 0.0091, 0.0121, 0.0151, 0.0181, 0.0201, 0.0221];
  public lineChartOptions: any = {
    responsive: true
  };
  public lineChartColors: Array<any> = [
    { // dark grey
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
    this.lineChartData = [{ data: this.results, label: 'Зависимость вероятности отказа от интенсивности потока обслуживания' }];
  }
}
