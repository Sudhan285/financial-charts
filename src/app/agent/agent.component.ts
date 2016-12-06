import { Component, OnInit, OnDestroy } from '@angular/core';
import { ChatService }       from '../services/chat.service';
import { AlertComponent } from '../shared/alert/alert.component';
import {AuthService} from '../services/auth.service';
import { ChartsModule } from 'ng2-charts/ng2-charts';

@Component({
  selector: 'app-agent',
  templateUrl: './agent.component.html',
  styleUrls: ['./agent.component.css'],
  providers: [ChatService, AuthService]
})
export class AgentComponent implements OnInit {

  public stockCode:string;
  public stocks:Array<any> = [{code:'IBM',name:'International Business Machines'}];

  constructor() { }

  ngOnInit() {
  }

  public addStock(){
    let obj = {code:'IBM',name:'Int Biz Mach'};
    console.log(this.stockCode);
    this.stockCode = '';
    this.stocks.push(obj);
  };
  public deleteStock(stock){
    let x = this.stocks.indexOf(stock);
    this.stocks.splice(x,1);
  };
  // lineChart
  public lineChartData:Array<any> = [
    {data: [65, 59, 80, 81, 56, 55, 40], label: 'Series A', fill:false},
    {data: [28, 48, 40, 19, 86, 27, 90], label: 'Series B', fill:false},
    {data: [18, 48, 77, 9, 100, 27, 40], label: 'Series C', fill:false},
    {data: [65, 59, 80, 81, 56, 55, 40], label: 'Series D', fill:false},
    {data: [28, 48, 40, 19, 86, 27, 90], label: 'Series E', fill:false},
    {data: [65, 59, 80, 81, 56, 55, 40], label: 'Series F', fill:false},
    {data: [28, 48, 40, 19, 86, 27, 90], label: 'Series G', fill:false}
  ];
  public lineChartLabels:Array<any> = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
  public lineChartOptions:any = {
    animation: false,
    responsive: true
  };
  public lineChartLegend:boolean = true;
  public lineChartType:string = 'line';

  public randomize():void {
    let _lineChartData:Array<any> = new Array(this.lineChartData.length);
    for (let i = 0; i < this.lineChartData.length; i++) {
      _lineChartData[i] = {data: new Array(this.lineChartData[i].data.length), label: this.lineChartData[i].label, fill:false};
      for (let j = 0; j < this.lineChartData[i].data.length; j++) {
        _lineChartData[i].data[j] = Math.floor((Math.random() * 100) + 1);
      }
    }
    this.lineChartData = _lineChartData;
  }

  // events
  public chartClicked(e:any):void {
    console.log(e);
  }

  public chartHovered(e:any):void {
    console.log(e);
  }
}
