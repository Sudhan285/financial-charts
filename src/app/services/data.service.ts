import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class DataService {
  private apiKey = "WTuGQxLsvq-PutMxZAPz";
  constructor(private http: Http) { }
  getStocks(name) {
    let now = new Date();
    let year = now.getFullYear();
    let month = now.getMonth() + 1;
    let date = now.getDate();
    let url = `https://www.quandl.com/api/v3/datasets/WIKI/${name}.json?api_key=${this.apiKey}&start_date=${year - 1}-${month}-${date}&end_date=${year}-${month}-${date}`
    return this.http.get(url).map(res => res.json());
  }
}
