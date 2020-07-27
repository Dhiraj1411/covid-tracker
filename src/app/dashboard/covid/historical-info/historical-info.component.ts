import { Component, OnInit, NgZone, Input } from '@angular/core';

import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import am4themes_frozen from "@amcharts/amcharts4/themes/frozen";

am4core.useTheme(am4themes_frozen);
am4core.useTheme(am4themes_animated);

@Component({
  selector: 'app-historical-info',
  templateUrl: './historical-info.component.html',
  styleUrls: ['./historical-info.component.scss']
})
export class HistoricalInfoComponent implements OnInit {

  chart;

  @Input() chartData;
  constructor(private zone: NgZone) { }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    this.zone.runOutsideAngular(() => {
      this.getCases(this.chartData);
    });
  }

  ngOnChanges() {
    this.getCases(this.chartData);
  }

  getCases(resp) {
    const result = [];
    if (resp)
      for (const key in resp.cases) {
        if (resp.cases.hasOwnProperty(key)) {
          const obj = {
            number: resp.cases[key],
            date: key
          }
          // const element = resp.cases[key];
          result.push(obj);
        }
      }
    console.log(result);
    this.create3DCyclinderChat(result);
  }

  create3DCyclinderChat(data) {

    let chart = am4core.create("countryChart", am4charts.XYChart3D);
    // ... chart code goes here ...      

    // Create axes
    var categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = "date";
    categoryAxis.renderer.grid.template.location = 0;
    categoryAxis.renderer.minGridDistance = 10;
    categoryAxis.renderer.inside = true;
    categoryAxis.renderer.grid.template.disabled = true;

    let labelTemplate = categoryAxis.renderer.labels.template;
    labelTemplate.rotation = -90;
    labelTemplate.horizontalCenter = "left";
    labelTemplate.verticalCenter = "middle";
    labelTemplate.dy = 10; // moves it a bit down;
    labelTemplate.inside = false; // this is done to avoid settings which are not suitable when label is rotated

    let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.renderer.grid.template.disabled = true;

    // Create series
    let series = chart.series.push(new am4charts.ConeSeries());
    series.dataFields.valueY = "number";
    series.dataFields.categoryX = "date";

    let columnTemplate = series.columns.template;
    columnTemplate.adapter.add("fill", function (fill, target) {
      return chart.colors.getIndex(target.dataItem.index);
    })

    columnTemplate.adapter.add("stroke", function (stroke, target) {
      return chart.colors.getIndex(target.dataItem.index);
    })

    let dateAxis = chart.xAxes.push(new am4charts.DateAxis());
    dateAxis.renderer.grid.template.location = 0;

    series.tooltipText = "{valueY.value}";
    chart.cursor = new am4charts.XYCursor();
    chart.data = data;
    // let scrollbarX = new am4charts.XYChartScrollbar();
    // scrollbarX.series.push(series);
    // chart.scrollbarX = scrollbarX;
    // .. chart code end here ...    

    this.chart = chart;
  }

}
