import { Component, NgZone } from '@angular/core';
import { map } from 'rxjs/operators';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';

import * as am4core from "@amcharts/amcharts4/core";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import am4themes_frozen from "@amcharts/amcharts4/themes/frozen";

import { AppService } from '../../app.service';
import { FormControl } from '@angular/forms';

am4core.useTheme(am4themes_frozen);
am4core.useTheme(am4themes_animated);

@Component({
  selector: 'app-covid',
  templateUrl: './covid.component.html',
  styleUrls: ['./covid.component.scss']
})
export class COVIDComponent {
  cards = this.breakpointObserver.observe(Breakpoints.Handset).pipe(
    map(({ matches }) => {
      if (matches) {
        return [
          { title: 'Today:', cols: 11, rows: 2, content: 'current' },
          { title: 'Countries', cols: 11, rows: 5, content: 'table' },
          { title: 'World Wise Cases:', cols: 11, rows: 4, content: 'world_wide_case' },
          { title: 'World Map', cols: 11, rows: 3, content: 'map' },
        ];
      }
      return [
        { title: 'Today:', cols: 7, rows: 2, content: 'current' },
        { title: 'Countries', cols: 4, rows: 5, content: 'table' },
        { title: 'World Map', cols: 7, rows: 3, content: 'map' },
        { title: 'World Wise Cases:', cols: 11, rows: 4, content: 'world_wide_case' },
      ];
    })
  );

  countryWiseData;
  currentDayChartData;
  historicalData;
  showPieChart = 'number';
  showAreaChart = true;

  selectedPieChart = new FormControl('numeric');

  constructor(
    private breakpointObserver: BreakpointObserver,
    private zone: NgZone,
    private appService: AppService
  ) {
    this.getApiData();    
  }

  getApiData() {
    this.appService.getCurrentDayData().subscribe(
      (resp) => {
        this.currentDayChartData = resp;
      }
    );

    this.appService.getCountryWiseData().subscribe(
      resp => {
        this.countryWiseData = resp;
      }
    );
  }

  ngAfterViewInit() {
    this.zone.runOutsideAngular(() => {
    });
  }
}
