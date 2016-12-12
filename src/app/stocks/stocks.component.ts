import { Component, OnInit } from '@angular/core';
import { ChartsModule } from 'ng2-charts/ng2-charts';
import { DataService } from '../services/data.service';

@Component({
  selector: 'stocks',
  templateUrl: './stocks.component.html',
  styleUrls: ['./stocks.component.css'],
  providers: [DataService]
})

export class StocksComponent implements OnInit {
  public stockCode:string; //the stock symbol (2 way binding from input)
  public stocks:Array<any> = []; //array of all stocks
  public error:string; //error message (if stock not found)
  public currentView:string; //the timeframe being graphed
  public loading:boolean = false; //loading screen

  constructor(private data:DataService) { }

  ngOnInit() {
    //checks local storage for previous session information
    let stockList = JSON.parse(localStorage.getItem("stockList"));
    if (stockList && stockList.length){
      this.stocks = stockList;
    }
    //sets initial view to 1 year
    this.changeView('1y');
  }

  //changes the time frame to graph
  public changeView(period){
    //handles scope
    let scope = this;

    //if previous session, enables loading screen while retrieving data
    if (scope.stocks.length){
      let time = 1000 + (500 * scope.stocks.length);
      this.loading = true;
      setTimeout(() => {
        this.loading = false;
      }, time);
    }
    //takes current date and the amount of months to add (or subtract)
    function addMonths(date, months) {
      date.setMonth(date.getMonth() + months);
      return date;
    }
    //formats the date for the api call
    function formatDate(date){
      let year = date.getFullYear();
      let month = date.getMonth() + 1;
      let day = date.getDate();
      let x = `${year}-${month}-${day}`;
      return x;
    }

    let startDate; //variable for starting date

    //takes the time frame and calls the appropriate function for the starting date
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

    scope.currentView = startDate; //sets the variable to correct format to add new stocks
    scope.lineChartData = [{data:[], label: null}]; //resets chart data
    let _stocks = scope.stocks; //temp stocks array
    scope.stocks = []; //clears global stocks array
    //makes api call for all stocks with the correct timeframe
    for (let stock of _stocks){
      setTimeout(() => {
        scope.addStock(stock.code, startDate);
      }, 50);
    }
  }

  //makes api call, takes symbol and start date as arguments
  public addStock(sym, date){
    this.data.getStocks(sym, date)
    .subscribe(
      stock => {
        //formats object for stocks array
        let shorten = 'Prices, Dividends, Splits and Trading Volume';
        let name = stock.dataset.name.replace(shorten, '');
        let info = `Closed at ${stock.dataset.data[0][4]} on ${stock.dataset.data[0][0]}`
        let obj = {code:stock.dataset.dataset_code,
                   name:name, info:info};
        this.stocks.push(obj);

        //sets local storage item to save stocks for next session
        localStorage.setItem("stockList", JSON.stringify(this.stocks));

        //makes temp variables
        let chartObj = {data:[], label: stock.dataset.dataset_code, fill:false, pointRadius:0, pointHitRadius:5};
        let labels = [];

        //pushes data to chart
        for (let i=stock.dataset.data.length-1; i>=0; i--){
          chartObj.data.push(stock.dataset.data[i][4]);
          labels.push(stock.dataset.data[i][0]);
        };

        //removes temp data object (needed because chart is removed if no data)
        if (this.lineChartData[0].label === null){
          this.lineChartData.splice(0,1);
        };
        //pushes to global chart variables
        this.lineChartData.push(chartObj);
        this.lineChartLabels = labels;

        //resets stock code
        this.stockCode = '';
    },
      error => this.noStock(),
    );
  };

  //deletes stock
  public deleteStock(stock){
    //remove stock from array
    let x = this.stocks.indexOf(stock);
    this.stocks.splice(x,1);

    //update local storage
    localStorage.setItem("stockList", JSON.stringify(this.stocks));

    //sets temp chart data variable
    let _lineChartData = this.lineChartData;
    //finds data object and deletes it
    for (let obj of _lineChartData){
      if (obj.label == stock.code){
        let y = _lineChartData.indexOf(obj);
        _lineChartData.splice(y,1);
      }
    }
    //resets data object
    this.lineChartData=[{data:[0], label: 'x'}];
    //sets global variable
    setTimeout(() => {
      this.lineChartData = _lineChartData.length ? _lineChartData : [{data:[], label: null}];
    }, 1);
  };

  //sets error message
  public noStock(){
    this.error =  'Sorry. We couldn\'t find that stock. Please try again.';
    setTimeout(() => {
      this.error = '';
      this.stockCode = '';
    }, 2000);
  }

  // lineChart configuration
  public lineChartLegend:boolean = true;
  public lineChartType:string = 'line';
  public lineChartData:Array<any> = [{data:[], label: null, fill:false, pointRadius:0, pointHitRadius:10}];
  public lineChartLabels:Array<any> = [0];
  public lineChartOptions:any = {
    animation: {
      duration: 1000
    },
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
}
