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

  constructor(private data:DataService) { }

  ngOnInit() {
    this.dates();
  }

  public dates(){
    // 1m, 3m, 6m, 9m, 1y
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
    formatDate(addMonths(new Date(), -1));
    formatDate(addMonths(new Date(), -3));
    formatDate(addMonths(new Date(), -6));
    formatDate(addMonths(new Date(), -9));
    formatDate(addMonths(new Date(), -12));
    for (let date of dateArr){
      this.findRates(date);
    }
  }

  public findRates(date){
    let tempArr=[];
    this.data.getCurrency(this.base,date)
    .subscribe(
      stock => {
        let obj={date:stock.date,base:stock.base,curr:stock.rates[this.curr]};
        tempArr.push(obj);
    },
      error => console.log(error),
    );
    console.log(tempArr[0]);
  };


}
