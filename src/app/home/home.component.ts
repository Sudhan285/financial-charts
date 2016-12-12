import { Component, OnInit } from '@angular/core';
import { ChartsModule } from 'ng2-charts/ng2-charts';
import { DataService } from '../services/data.service';
import { AlertComponent } from '../shared/alert/alert.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  providers: [DataService]
})
export class HomeComponent implements OnInit {
  public stockCode:string;
  public stocks:Array<any> = [];
  public error:string;
  public viewData:any;
  public currentView:string;

  constructor(private alert:AlertComponent,
              private data:DataService) { }

  ngOnInit() {
    let stockList = localStorage.getItem("stockList");
    if (stockList){this.stocks = JSON.parse(stockList);}
    this.changeView('1y');
  }

  public changeView(period){
    let scope = this;
    function addMonths(date, months) {
      date.setMonth(date.getMonth() + months);
      return date;
    }
    function formatDate(date){
      let year = date.getFullYear();
      let month = date.getMonth() + 1;
      let day = date.getDate();
      let x = `${year}-${month}-${day}`;
      return x;
    }
    let startDate;
    switch (period){
      case '1m':
        startDate = formatDate(addMonths(new Date(), -1));
        break;
      case '3m':
        startDate = formatDate(addMonths(new Date(), -3));
        break;
      case '6m':
        startDate = formatDate(addMonths(new Date(), -6));
        break;
      case 'ytd':
        let now = new Date();
        let yr = now.getFullYear();
        startDate = `${yr}-1-1`
        break;
      case '1y':
        startDate = formatDate(addMonths(new Date(), -12));
        break;
      default:
        startDate = formatDate(addMonths(new Date(), -12));
    }
    scope.currentView = startDate;
    scope.lineChartData = [{data:[], label: null}];
    let _stocks = scope.stocks;
    scope.stocks = [];
    for (let stock of _stocks){
      setTimeout(() => {
        scope.addStock(stock.code, startDate);
      }, 50);
    }
  }

  public addStock(sym, date){
    this.data.getStocks(sym, date)
    .subscribe(
      stock => {
        let shorten = 'Prices, Dividends, Splits and Trading Volume';
        let name = stock.dataset.name.replace(shorten, '');
        let info = `Closed at ${stock.dataset.data[0][4]} on ${stock.dataset.data[0][0]}`
        let obj = {code:stock.dataset.dataset_code,
                   name:name, info:info};
        //console.log(stock);
        this.stocks.push(obj);
        localStorage.setItem("stockList", JSON.stringify(this.stocks));
        //let stockData = stock.dataset.data.reverse();
        let chartObj = {data:[], label: stock.dataset.dataset_code, fill:false, pointRadius:0, pointHitRadius:5};
        let labels = [];
        for (let i=stock.dataset.data.length-1; i>=0; i--){
          chartObj.data.push(stock.dataset.data[i][4]);
          labels.push(stock.dataset.data[i][0]);
        };
        if (this.lineChartData[0].label === null){
          this.lineChartData.splice(0,1);
        };
        this.lineChartData.push(chartObj);
        this.lineChartLabels = labels;
        console.log(this.lineChartData);
        this.stockCode = '';
    },
      error => this.noStock(),
    );
  };
  public deleteStock(stock){
    let x = this.stocks.indexOf(stock);
    this.stocks.splice(x,1);
    localStorage.setItem("stockList", JSON.stringify(this.stocks));
    let _lineChartData = this.lineChartData;
    for (let obj of _lineChartData){
      if (obj.label == stock.code){
        let y = _lineChartData.indexOf(obj);
        _lineChartData.splice(y,1);
      }
    }
    this.lineChartData=[{data:[0], label: 'x'}];
    setTimeout(() => {
      this.lineChartData = _lineChartData.length ? _lineChartData:[{data:[], label: null}];
    }, 1);
  };
  public noStock(){
    this.error =  'Sorry. We couldn\'t find that stock. Please try again.';
    setTimeout(() => {
      this.error = '';
      this.stockCode = '';
    }, 3000);
  }
  // lineChart
  public lineChartData:Array<any> = [{data:[], label: null, fill:false, pointRadius:0, pointHitRadius:10}];
  public lineChartLabels:Array<any> = [0];
  public lineChartOptions:any = {
    animation: false,
    responsive: true,
    hover: {
			mode: 'x-axis'
		},
		tooltips: {
			enabled: true,
			mode: 'x-axis',
			titleFontSize: 24,
			titleMarginBottom: 15,
			bodyFontSize: 18,
			bodySpacing: 15,
      displayColors: false
		},
		legend: {
			labels: {
				fontSize: 18,
				fontStyle: "bold",
				padding: 30
			}
		},
    scales: {
      xAxes: [{
        ticks: {
          maxTicksLimit: 15
        }
      }]
    }
  };
  public lineChartLegend:boolean = true;
  public lineChartType:string = 'line';
}
