import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class DataService {
  private apiKey = "WTuGQxLsvq-PutMxZAPz";
  constructor(private http: Http) { }

  getStocks(name, startDate) {
    let now = new Date();
    let year = now.getFullYear();
    let month = now.getMonth() + 1;
    let date = now.getDate();
    console.log(startDate);

    let url = `https://www.quandl.com/api/v3/datasets/WIKI/${name}.json?api_key=${this.apiKey}&start_date=${startDate}&end_date=${year}-${month}-${date}`
    return this.http.get(url).map(res => res.json());
  }

  getCurrency(base, date) {
    let url = `http://api.fixer.io/${date}?base=${base}`;
    return this.http.get(url).map(res => res.json());
  }
}
