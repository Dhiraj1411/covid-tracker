import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AppService {

  constructor(private http: HttpClient) { }

  getHistoricalData() {
    return this.http.get('https://disease.sh/v3/covid-19/historical/all?lastdays=30');
  }

  getCurrentDayData() {
    return this.http.get('https://disease.sh/v3/covid-19/all');
  }

  getCountryWiseData() {
    return this.http.get('https://disease.sh/v3/covid-19/countries');
  }
}
