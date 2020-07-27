import { Component, OnInit, Input, NgZone } from '@angular/core';

import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import am4themes_frozen from "@amcharts/amcharts4/themes/frozen";

import { AppService } from '../../../app.service';

am4core.useTheme(am4themes_frozen);
am4core.useTheme(am4themes_animated);

@Component({
  selector: 'app-today-info',
  templateUrl: './today-info.component.html',
  styleUrls: ['./today-info.component.scss']
})
export class TodayInfoComponent implements OnInit {


  pieChart;

  @Input() showPieChart;
  @Input() currentDayChartData;
  constructor(
    private zone: NgZone,
    private appService: AppService
  ) { }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    this.zone.runOutsideAngular(() => {
    });
  }

  createPieChart() {

    const data = [
      {
        cases: 'Cases',
        number: this.currentDayChartData['todayCases']
      },
      {
        cases: 'Recovered',
        number: this.currentDayChartData['todayRecovered']
      },
      {
        cases: 'Death',
        number: this.currentDayChartData['todayDeaths']
      }
    ];

    let chart = am4core.create("currentDayChart", am4charts.PieChart);
    let total = 0;
    chart.data = data;
    for (const item of data) {
      total = total + item['number']
    }
    chart.innerRadius = 70;
    let label = chart.seriesContainer.createChild(am4core.Label);
    label.text = total.toString(); // Typcasting to string;
    label.horizontalCenter = "middle";
    label.verticalCenter = "middle";
    label.fontSize = 20;

    // Add and configure Series
    let pieSeries = chart.series.push(new am4charts.PieSeries());
    pieSeries.dataFields.value = "number";
    pieSeries.dataFields.category = "cases";

    this.pieChart = chart;
  }

  ngOnDestroy() {
    this.zone.runOutsideAngular(() => {
      if (this.pieChart) {
        this.pieChart.dispose();
      }
    });
  }

}
