import { Component, OnInit, NgZone } from '@angular/core';

import * as am4core from "@amcharts/amcharts4/core";
import * as am4maps from "@amcharts/amcharts4/maps";
import am4geodata_worldLow from "@amcharts/amcharts4-geodata/worldLow";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import am4themes_frozen from "@amcharts/amcharts4/themes/frozen";

import { AppService } from '../../../app.service';
// Themes begin
am4core.useTheme(am4themes_frozen);
am4core.useTheme(am4themes_animated);

@Component({
  selector: 'app-world-map',
  templateUrl: './world-map.component.html',
  styleUrls: ['./world-map.component.scss']
})
export class WorldMapComponent implements OnInit {

  constructor(
    private zone: NgZone,
    private appService: AppService
  ) { }

  ngOnInit(): void {
    this.appService.getCountryWiseData().subscribe(
      (success:Array<any>) => {
        const result = [];
        for (const iterator of success) {
          const obj = {
            id : iterator['countryInfo']['iso2'],
            flag : iterator['countryInfo']['flag'],
            name: iterator['country'],
            cases: iterator['cases'],
            recovered: iterator['recovered'],
            value: iterator['deaths']
          }
          result.push(obj);
        }
        this.createChart(result);
      }
    )
  }

  ngAfterViewInit() {
    this.zone.runOutsideAngular(() => {
      // this.createChart();
    });
  }
  createChart(data) {
    // Create map instance
    let chart = am4core.create("worldMap", am4maps.MapChart);    

    // Set map definition
    chart.geodata = am4geodata_worldLow;

    // Set projection
    chart.projection = new am4maps.projections.Miller();

    // Create map polygon series
    let polygonSeries = chart.series.push(new am4maps.MapPolygonSeries());
    polygonSeries.exclude = ["AQ"];
    polygonSeries.useGeodata = true;
    polygonSeries.nonScalingStroke = true;
    polygonSeries.strokeWidth = 0.5;
    polygonSeries.calculateVisualCenter = true;

    let imageSeries = chart.series.push(new am4maps.MapImageSeries());
    imageSeries.data = data;
    imageSeries.dataFields.value = "value";

    let imageTemplate = imageSeries.mapImages.template;
    imageTemplate.nonScaling = true

    let circle = imageTemplate.createChild(am4core.Circle);
    circle.fillOpacity = 0.7;
    circle.fill = am4core.color("#ef2929");
    circle.stroke = am4core.color("#ef2929");
    circle.tooltipText = "Country : {name} \n Cases: [bold]{cases}[/] \n Recovered: [bold]{recovered}[/] \n Deaths: [bold]{value}[/]";


    imageSeries.heatRules.push({
      "target": circle,
      "property": "radius",
      "min": 4,
      "max": 30,
      "dataField": "value"
    })

    imageTemplate.adapter.add("latitude", (latitude, target) => {
      let polygon = polygonSeries.getPolygonById(target.dataItem.dataContext['id']);
      if (polygon) {
        return polygon.visualLatitude;
      }
      return latitude;
    })

    imageTemplate.adapter.add("longitude", (longitude, target) => {
      let polygon = polygonSeries.getPolygonById(target.dataItem.dataContext['id']);
      if (polygon) {
        return polygon.visualLongitude;
      }
      return longitude;
    })

  }

}
