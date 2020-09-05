import { Component, OnInit, NgZone, Input } from '@angular/core';

import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import am4themes_frozen from "@amcharts/amcharts4/themes/frozen";
import { FormControl } from '@angular/forms';

am4core.useTheme(am4themes_frozen);
am4core.useTheme(am4themes_animated);

@Component({
  selector: 'app-historical-info',
  templateUrl: './historical-info.component.html',
  styleUrls: ['./historical-info.component.scss']
})
export class HistoricalInfoComponent implements OnInit {

  caseType = new FormControl("cases");
  chart;
  @Input() showAreaChart;
  @Input() chartData;
  constructor(private zone: NgZone) { }

  ngOnInit(): void {
    this.caseType.valueChanges.subscribe(value => {
      if (this.showAreaChart) {
        const data = this.getCases(this.chartData, value);
        this.createAreaChart(data);
      } else {
        this.chart.dispose();
        // if (this.caseType.value === 'recovered') {
        //   am4core.useTheme(this.am4themes_myTheme_green);
        // } else if (this.caseType.value === 'cases') {
        //   am4core.useTheme(this.am4themes_myTheme_blue);
        // } else {
        //   am4core.useTheme(this.am4themes_myTheme_red);
        // }
        const data = this.getCases(this.chartData, value);
        this.create3DCyclinderChat(this.getCases(this.chartData, value))
      }
    });
  }

  ngAfterViewInit() {
    this.zone.runOutsideAngular(() => {
      // this.getCases(this.chartData);
    });
  }

  ngOnChanges() {
    if (this.chart)
      this.chart.dispose();

    if (this.showAreaChart) {
      // const data = this.getCases(this.chartData, this.caseType.value);
      const data = this.getAllCases(this.chartData);
      this.createAreaChart(data);
    } else {
      // if (this.caseType.value === 'recovered') {
      //   am4core.useTheme(this.am4themes_myTheme_green);
      // } else if (this.caseType.value === 'cases') {
      //   am4core.useTheme(this.am4themes_myTheme_blue);
      // } else {
      //   am4core.useTheme(this.am4themes_myTheme_red);
      // }
      const data = this.getCases(this.chartData, this.caseType.value);
      this.create3DCyclinderChat(data);
    }
  }

  getCases(resp, type) {
    const result = [];
    if (resp)
      for (const key in resp[type]) {
        if (resp.cases.hasOwnProperty(key)) {
          const obj = {
            number: resp[type][key],
            date: key
          }
          result.push(obj);
        }
      }
    return result;
  }

  getAllCases(resp) {
    const result = [];
    if (resp) {
      for (const key in resp['cases']) {
        const obj = {
          cases: resp['cases'][key],
          recovered: resp['recovered'][key],
          deaths: resp['deaths'][key],
          date: key
        }
        result.push(obj);
      }
    }
    return result;
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

  am4themes_myTheme_green(target) {
    if (target instanceof am4core.ColorSet) {
      target.list = [
        am4core.color("#22dc22")
      ];
    }
  }
  am4themes_myTheme_blue(target) {
    if (target instanceof am4core.ColorSet) {
      target.list = [
        am4core.color("#232555")
      ];
    }
  }
  am4themes_myTheme_red(target) {
    if (target instanceof am4core.ColorSet) {
      target.list = [
        am4core.color("#DF3520")
      ];
    }
  }
  am4themes_myTheme_lineChart(target) {
    if (target instanceof am4core.ColorSet) {
      target.list = [
        am4core.color("#232555"),
        am4core.color("#DF3520"),
        am4core.color("#22dc22"),
      ];
    }
  }

  createAreaChart(data) {
    // Create chart

    let chart = am4core.create("countryChart", am4charts.XYChart);
    chart.paddingRight = 20;
    chart.colors.step = 2;
    chart.data = data;

    let dateAxis = chart.xAxes.push(new am4charts.DateAxis());
    dateAxis.baseInterval = {
      "timeUnit": "day",
      "count": 1
    };
    // dateAxis.tooltipDateFormat = "HH:mm, d MMMM";

    let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.tooltip.disabled = true;
    valueAxis.title.text = "Count";

    this.createAxisAndSeries(chart, 'cases', '#232555');
    this.createAxisAndSeries(chart, 'recovered', '#22dc22');

    this.createAxisAndSeries(chart, 'deaths', '#DF3520');

    // Add legend
    chart.legend = new am4charts.Legend();

    // Add cursor
    chart.cursor = new am4charts.XYCursor();

    dateAxis.start = 0.8;
    dateAxis.keepSelection = true;

    this.chart = chart;
  }

  createAxisAndSeries(chart, field, strokeColor) {

    var series = chart.series.push(new am4charts.LineSeries());
    series.dataFields.valueY = field;
    series.dataFields.dateX = "date";
    series.strokeWidth = 2;
    series.name = field;
    series.stroke = strokeColor;
    series.tooltipText = `${field}: [bold]{valueY}[/]`;

    chart.cursor = new am4charts.XYCursor();
    chart.cursor.lineY.opacity = 0;
    chart.scrollbarX = new am4charts.XYChartScrollbar();
    chart.scrollbarX['series'].push(series);
  }

}
