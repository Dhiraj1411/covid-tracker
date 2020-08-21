import { Component, OnInit, Input, NgZone, OnChanges } from '@angular/core';

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
export class TodayInfoComponent implements OnInit, OnChanges {
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

  ngOnChanges() {
    if (this.showPieChart === 'donut') {
      setTimeout(() => { this.createPieChart('donut'); }, 500);
    } if (this.showPieChart === 'pie') {
      setTimeout(() => { this.createPieChart('pie'); }, 500);
    } else if (this.pieChart) {
      this.pieChart.dispose();
    }
  }

  createPieChart(userChartType) {

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
    if (userChartType === 'donut')
      chart.innerRadius = 40;

    let label = chart.seriesContainer.createChild(am4core.Label);
    label.text = total.toString(); // Typcasting to string;
    label.horizontalCenter = "middle";
    label.verticalCenter = "middle";
    label.fontSize = 20;

    // Add and configure Series
    let pieSeries = chart.series.push(new am4charts.PieSeries());
    pieSeries.dataFields.value = "number";
    pieSeries.dataFields.category = "cases";

    pieSeries.slices.template.stroke = am4core.color("#fff");
    pieSeries.slices.template.strokeWidth = 2;
    pieSeries.slices.template.strokeOpacity = 1;
    pieSeries.slices.template
      // change the cursor on hover to make it apparent the object can be interacted with
      .cursorOverStyle = [
        {
          "property": "cursor",
          "value": "pointer"
        }
      ];

    // pieSeries.alignLabels = false;
    // pieSeries.labels.template.bent = true;
    // pieSeries.labels.template.radius = 3;
    // pieSeries.labels.template.padding(0, 0, 0, 0);

    // pieSeries.ticks.template.disabled = true;

    // Create a base filter effect (as if it's not there) for the hover to return to
    var shadow = pieSeries.slices.template.filters.push(new am4core.DropShadowFilter);
    shadow.opacity = 0;

    // Create hover state
    var hoverState = pieSeries.slices.template.states.getKey("hover"); // normally we have to create the hover state, in this case it already exists

    // Slightly shift the shadow and make it more prominent on hover
    var hoverShadow = hoverState.filters.push(new am4core.DropShadowFilter);
    hoverShadow.opacity = 0.7;
    hoverShadow.blur = 5;

    chart.legend = new am4charts.Legend();

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
