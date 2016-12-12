import { Component, OnInit } from '@angular/core';
import { DataService } from '../services/data.service';
import { ChartsModule } from 'ng2-charts/ng2-charts';

@Component({
  selector: 'currency',
  templateUrl: './currency.component.html',
  styleUrls: ['./currency.component.css'],
  providers: [DataService]
})
export class CurrencyComponent implements OnInit {

  //list of currency codes and full name for select dropdown
  public currencies:any = [{code:'AUD',name:'Australian Dollar'},{code:'BGN',name:'Bulgarian Lev'},{code:'BRL',name:'Brazilian Real'},
                          {code:'CAD',name:'Canadian Dollar'},{code:'CHF',name:'Swiss Franc'},{code:'CNY',name:'Chinese Yuan Renminbi'},{code:'CZK',name:'Czech Koruna'},{code:'DKK',name:'Danish Krone'},{code:'EUR',name:'Euro'},{code:'GBP',name:'Great Britain Pound'},{code:'HKD',name:'Hong Kong Dollar'},
                          {code:'HRK',name:'Croatian Kuna'},{code:'HUF',name:'Hungarian Forint'},{code:'IDR',name:'Indonesian Rupiah'},{code:'ILS',name:'Israeli Shekel'},{code:'INR',name:'Indian Rupee'},{code:'JPY',name:'Japanese Yen'},{code:'KRW',name:'South Korean Won'},{code:'MXN',name:'Mexican Peso'},
                          {code:'MYR',name:'Malaysian Ringgit'},{code:'NOK',name:'Norwegian Krone'},{code:'NZD',name:'New Zealand Dollor'},{code:'PHP',name:'Philippine Peso'},{code:'PLN',name:'Polish Zloty'},{code:'RON',name:'Romanian New Leu'},{code:'RUB',name:'Russian Ruble'},{code:'SEK',name:'Swedish Krona'},
                          {code:'SGD',name:'Singapore Dollar'},{code:'THB',name:'Thai Baht'},{code:'TRY',name:'Turkish Lira'},{code:'USD',name:'United States Dollar'},{code:'ZAR',name:'South African Rand'}]

  public base:string = 'USD'; //base currency
  public curr:string = 'EUR'; //currency to compare base to
  public multiplier:number = 1; //amount of base currency
  public rate:number; //exchange rate
  public loading:boolean = true; //displays loading screen
  public sortedArray:any = []; //a sorted array of exchange rates for last 12 months
  public difference:any; //object that handles the percentage of exchange rate difference from one year ago

  constructor(private data:DataService) { }

  ngOnInit() {
    //checks local storage for a default currency
    let defCurr = JSON.parse(localStorage.getItem("defaultCurrency"));
    if (defCurr){
      this.base = defCurr.base;
      this.curr = defCurr.curr;
    }
    //calculates exchange rate
    this.dates(null);
    //1 second timeout to let data load
    setTimeout(() => {
      this.loading = false;
    }, 1000);
  }

  public setDefault(){
    // sets a default currency and saves it to local storage
    let defaultCurrency = {
      base : this.base,
      curr : this.curr
    };
    localStorage.setItem("defaultCurrency", JSON.stringify(defaultCurrency));
  }

  //formats data to make api call
  public dates(value){
    // if base value was changed, the format needs to be changed
    let sym = (value) ? value.slice(-3) : this.base;
    //makes an array of dates starting with the latest information
    let dateArr = ['latest'];
    //takes current date and the amount of months to add (or subtract)
    function addMonths(date, months) {
      date.setMonth(date.getMonth() + months);
      return date;
    }
    //formats the date for the api call and pushes it to date array
    function formatDate(date){
      let year = date.getFullYear();
      let month = (date.getMonth() + 1)<10 ? '0'+(date.getMonth() + 1) : date.getMonth() + 1;
      let day = date.getDate()<10 ? '0'+date.getDate() : date.getDate();
      let x = `${year}-${month}-${day}`;
      dateArr.push(x);
    }
    //loop to get the formatted date for the previous 12 months
    for (let i=1; i<=12; i++){
        formatDate(addMonths(new Date(), -i));
    }
    //makes the api call for each value in the date array
    for (let date of dateArr){
      this.findRates(sym,date);
    }
  }

  //sorts the array by date in case the server returns them out of order
  public sortArray(){
    //handles scope
    let scope = this;
    //sorting algorithm
    this.sortedArray.sort(function(a, b){
        var keyA = (a.date),
            keyB = (b.date);
        // Compare the 2 dates
        if(keyA < keyB) return 1;
        if(keyA > keyB) return -1;
        return 0;
    });
    //sets exchange rate as latest rate
    this.rate = this.sortedArray[0].curr;

    //formats data and adds it to the graph
    let obj = [{data:[], label: `1 ${scope.base} = ${scope.curr}`}];
    let labels = [];
    for (let x of this.sortedArray){
      let newDate = String(x.date);
      let yr = newDate.slice(2,4);
      let mon = newDate.slice(4,6);
      labels.unshift(mon+'-'+yr);
      obj[0].data.unshift(x.curr);
    }
    this.lineChartLabels = labels;
    this.lineChartData = obj;

    //algorithm to calculate difference percentage from last year
    let current = this.sortedArray[0].curr;
    let pastYear = this.sortedArray[12].curr;
    if (current>pastYear){
      let pct = Math.round(((current/pastYear)-1)*100000)/1000;
      scope.difference = {change:'up',percent:pct};
    }else if (current<pastYear){
      let pct = Math.round((1-(current/pastYear))*100000)/1000;
      scope.difference = {change:'down',percent:pct};
    }else {
      scope.difference = {change:'none',percent:0};
    }
  }

  //makes the api calls takes the base currency and the date as arguments
  public findRates(sym,date){
    //handles scope
    let scope = this;
    this.data.getCurrency(sym,date)
    .subscribe(
      stock => {
        //formats data to usable format
        let obj={date:Number(stock.date.replace(/-/g,'')),base:stock.base,curr:stock.rates[this.curr]};
        //if new inquiry, reset array
        if (scope.sortedArray.length == 13){scope.sortedArray = [];}
        //push object to array
        scope.sortedArray.push(obj);
        //if array contains all 13 objects, sort it
        if (scope.sortedArray.length == 13){scope.sortArray();}
    },
      error => console.log(error),
    );
  };

  //chart set up
  public lineChartLegend:boolean = false;
  public lineChartType:string = 'line';
  public lineChartData:Array<any> = [{data:[0], label: null, fill:false, pointRadius:10, pointHitRadius:10}];
  public lineChartLabels:Array<any> = [];
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
          maxTicksLimit: 13
        }
      }]
    }
  };

}
