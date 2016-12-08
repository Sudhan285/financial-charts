import { Component, OnInit } from '@angular/core';
import { AlertComponent } from '../shared/alert/alert.component';
import { DataService } from '../services/data.service';
import { ChartsModule } from 'ng2-charts/ng2-charts';

@Component({
  selector: 'app-agent',
  templateUrl: './agent.component.html',
  styleUrls: ['./agent.component.css'],
  providers: [DataService]
})
export class AgentComponent implements OnInit {

  public currencies:any = [{code:'AUD',name:'Australian Dollar'},{code:'BGN',name:'Bulgarian Lev'},{code:'BRL',name:'Brazilian Real'},
                          {code:'CAD',name:'Canadian Dollar'},{code:'CHF',name:'Swiss Franc'},{code:'CNY',name:'Chinese Yuan Renminbi'},{code:'CZK',name:'Czech Koruna'},{code:'DKK',name:'Danish Krone'},{code:'EUR',name:'Euro'},{code:'GBP',name:'Great Britain Pound'},{code:'HKD',name:'Hong Kong Dollar'},
                          {code:'HRK',name:'Croatian Kuna'},{code:'HUF',name:'Hungarian Forint'},{code:'IDR',name:'Indonesian Rupiah'},{code:'ILS',name:'Israeli Shekel'},{code:'INR',name:'Indian Rupee'},{code:'JPY',name:'Japanese Yen'},{code:'KRW',name:'South Korean Won'},{code:'MXN',name:'Mexican Peso'},
                          {code:'MYR',name:'Malaysian Ringgit'},{code:'NOK',name:'Norwegian Krone'},{code:'NZD',name:'New Zealand Dollor'},{code:'PHP',name:'Philippine Peso'},{code:'PLN',name:'Polish Zloty'},{code:'RON',name:'Romanian New Leu'},{code:'RUB',name:'Russian Ruble'},{code:'SEK',name:'Swedish Krona'},
                          {code:'SGD',name:'Singapore Dollar'},{code:'THB',name:'Thai Baht'},{code:'TRY',name:'Turkish Lira'},{code:'USD',name:'United States Dollar'},{code:'ZAR',name:'South African Rand'}]

  public base:string = 'USD';
  public curr:string = 'EUR';
  public multiplier:number = 1;
  public currHistory:Array<any>;
  public rate:number;
  public username;

  constructor(private data:DataService) { }

  ngOnInit() {
    this.dates(null);
    let now = new Date();
    let month = now.getMonth() + 1;
    let year = now.getMonth() + 1;
  }

  public dates(value){
    let sym = (value) ? value.slice(-3) : this.base;
    let dateArr = ['latest'];
    function addMonths(date, months) {
      date.setMonth(date.getMonth() + months);
      return date;
    }
    function formatDate(date){
      let year = date.getFullYear();
      let month = (date.getMonth() + 1)<10 ? '0'+(date.getMonth() + 1) : date.getMonth() + 1;
      let day = date.getDate()<10 ? '0'+date.getDate() : date.getDate();
      let x = `${year}-${month}-${day}`;
      dateArr.push(x);
    }
    this.currHistory = [];
    for (let i=1; i<=12; i++){
        formatDate(addMonths(new Date(), -i));
    }

    for (let date of dateArr){
      this.findRates(sym,date);
    }
  }
  public tArr = [];
  public difference;
  public sortArray(){
    let scope = this;
    this.tArr.sort(function(a, b){
        var keyA = (a.date),
            keyB = (b.date);
        // Compare the 2 dates
        if(keyA < keyB) return 1;
        if(keyA > keyB) return -1;
        return 0;
    });
    this.rate = this.tArr[0].curr;
    let obj = [{data:[], label: `1 ${scope.base} = ${scope.curr}`}];
    let labels = [];
    for (let x of this.tArr){
      let newDate = String(x.date);
      let yr = newDate.slice(2,4);
      let mon = newDate.slice(4,6);
      labels.unshift(mon+'-'+yr);
      obj[0].data.unshift(x.curr);
    }
    this.lineChartLabels = labels;
    this.lineChartData = obj;
    let current = this.tArr[0].curr;
    let pastYear = this.tArr[12].curr;
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
  public findRates(sym,date){
    //let tempArr=[];
    let scope = this;
    this.data.getCurrency(sym,date)
    .subscribe(
      stock => {
        let obj={date:Number(stock.date.replace(/-/g,'')),base:stock.base,curr:stock.rates[this.curr]};
        if (scope.tArr.length == 13){scope.tArr = [];}
        scope.tArr.push(obj);
        if (scope.tArr.length == 13){scope.sortArray();}
    },
      error => console.log(error),
    );
  };

  public lineChartData:Array<any> = [{data:[0], label: null, fill:false, pointRadius:10, pointHitRadius:10}];
  public lineChartLabels:Array<any> = [];
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
          maxTicksLimit: 13
        }
      }]
    }
  };
  public lineChartLegend:boolean = false;
  public lineChartType:string = 'line';

}
