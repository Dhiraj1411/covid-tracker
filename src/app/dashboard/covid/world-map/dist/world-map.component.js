"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.WorldMapComponent = void 0;
var core_1 = require("@angular/core");
var am4core = require("@amcharts/amcharts4/core");
var am4maps = require("@amcharts/amcharts4/maps");
var worldLow_1 = require("@amcharts/amcharts4-geodata/worldLow");
var animated_1 = require("@amcharts/amcharts4/themes/animated");
var frozen_1 = require("@amcharts/amcharts4/themes/frozen");
// Themes begin
am4core.useTheme(frozen_1["default"]);
am4core.useTheme(animated_1["default"]);
var WorldMapComponent = /** @class */ (function () {
    function WorldMapComponent(zone, appService) {
        this.zone = zone;
        this.appService = appService;
    }
    WorldMapComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.appService.getCountryWiseData().subscribe(function (success) {
            var result = [];
            for (var _i = 0, success_1 = success; _i < success_1.length; _i++) {
                var iterator = success_1[_i];
                var obj = {
                    id: iterator['countryInfo']['iso2'],
                    flag: iterator['countryInfo']['flag'],
                    name: iterator['country'],
                    cases: iterator['cases'],
                    recovered: iterator['recovered'],
                    value: iterator['deaths']
                };
                result.push(obj);
            }
            _this.createChart(result);
        });
    };
    WorldMapComponent.prototype.ngAfterViewInit = function () {
        this.zone.runOutsideAngular(function () {
            // this.createChart();
        });
    };
    WorldMapComponent.prototype.createChart = function (data) {
        // Create map instance
        var chart = am4core.create("worldMap", am4maps.MapChart);
        // Set map definition
        chart.geodata = worldLow_1["default"];
        // Set projection
        chart.projection = new am4maps.projections.Miller();
        // Create map polygon series
        var polygonSeries = chart.series.push(new am4maps.MapPolygonSeries());
        polygonSeries.exclude = ["AQ"];
        polygonSeries.useGeodata = true;
        polygonSeries.nonScalingStroke = true;
        polygonSeries.strokeWidth = 0.5;
        polygonSeries.calculateVisualCenter = true;
        var imageSeries = chart.series.push(new am4maps.MapImageSeries());
        imageSeries.data = data;
        imageSeries.dataFields.value = "value";
        var imageTemplate = imageSeries.mapImages.template;
        imageTemplate.nonScaling = true;
        var circle = imageTemplate.createChild(am4core.Circle);
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
        });
        imageTemplate.adapter.add("latitude", function (latitude, target) {
            var polygon = polygonSeries.getPolygonById(target.dataItem.dataContext['id']);
            if (polygon) {
                return polygon.visualLatitude;
            }
            return latitude;
        });
        imageTemplate.adapter.add("longitude", function (longitude, target) {
            var polygon = polygonSeries.getPolygonById(target.dataItem.dataContext['id']);
            if (polygon) {
                return polygon.visualLongitude;
            }
            return longitude;
        });
    };
    WorldMapComponent = __decorate([
        core_1.Component({
            selector: 'app-world-map',
            templateUrl: './world-map.component.html',
            styleUrls: ['./world-map.component.scss']
        })
    ], WorldMapComponent);
    return WorldMapComponent;
}());
exports.WorldMapComponent = WorldMapComponent;
