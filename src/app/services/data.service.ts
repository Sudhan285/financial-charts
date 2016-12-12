import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class DataService {
  constructor(private http: Http) { }

  //call stock api, takes 2 arguments: stock symbol and starting date
  getStocks(name, startDate) {
    let apiKey = "WTuGQxLsvq-PutMxZAPz";
    let now = new Date();
    let year = now.getFullYear();
    let month = now.getMonth() + 1;
    let date = now.getDate();
    let url = `https://www.quandl.com/api/v3/datasets/WIKI/${name}.json?api_key=${apiKey}&start_date=${startDate}&end_date=${year}-${month}-${date}`
    return this.http.get(url).map(res => res.json());
  }

  //calls currency api, takes base currency and date as arguments
  getCurrency(base, date) {
    let url = `http://api.fixer.io/${date}?base=${base}`;
    return this.http.get(url).map(res => res.json());
  }

}
