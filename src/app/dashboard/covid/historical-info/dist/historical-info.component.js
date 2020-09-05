"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.HistoricalInfoComponent = void 0;
var core_1 = require("@angular/core");
var am4core = require("@amcharts/amcharts4/core");
var am4charts = require("@amcharts/amcharts4/charts");
var animated_1 = require("@amcharts/amcharts4/themes/animated");
var frozen_1 = require("@amcharts/amcharts4/themes/frozen");
var forms_1 = require("@angular/forms");
am4core.useTheme(frozen_1["default"]);
am4core.useTheme(animated_1["default"]);
var HistoricalInfoComponent = /** @class */ (function () {
    function HistoricalInfoComponent(zone) {
        this.zone = zone;
        this.caseType = new forms_1.FormControl("cases");
    }
    HistoricalInfoComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.caseType.valueChanges.subscribe(function (value) {
            if (_this.showAreaChart) {
                var data = _this.getCases(_this.chartData, value);
                _this.createAreaChart(data);
            }
            else {
                var data = _this.getCases(_this.chartData, value);
                _this.create3DCyclinderChat(_this.getCases(_this.chartData, value));
            }
        });
    };
    HistoricalInfoComponent.prototype.ngAfterViewInit = function () {
        this.zone.runOutsideAngular(function () {
            // this.getCases(this.chartData);
        });
    };
    HistoricalInfoComponent.prototype.ngOnChanges = function () {
        if (this.chart)
            this.chart.dispose();
        if (this.showAreaChart) {
            // const data = this.getCases(this.chartData, this.caseType.value);
            var data = this.getAllCases(this.chartData);
            this.createAreaChart(data);
        }
        else {
            var data = this.getCases(this.chartData, this.caseType.value);
            this.create3DCyclinderChat(data);
        }
    };
    HistoricalInfoComponent.prototype.getCases = function (resp, type) {
        var result = [];
        if (resp)
            for (var key in resp[type]) {
                if (resp.cases.hasOwnProperty(key)) {
                    var obj = {
                        number: resp[type][key],
                        date: key
                    };
                    result.push(obj);
                }
            }
        return result;
    };
    HistoricalInfoComponent.prototype.getAllCases = function (resp) {
        var result = [];
        if (resp) {
            // for (const type in resp) {
            for (var key in resp['cases']) {
                // if (resp.cases.hasOwnProperty(key)) {
                var obj = {
                    cases: resp['cases'][key],
                    recovered: resp['recovered'][key],
                    deaths: resp['deaths'][key],
                    date: key
                };
                result.push(obj);
                // }
                // }
            }
        }
        console.log(result);
        return result;
    };
    HistoricalInfoComponent.prototype.create3DCyclinderChat = function (data) {
        var chart = am4core.create("countryChart", am4charts.XYChart3D);
        // ... chart code goes here ...      
        // Create axes
        var categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
        categoryAxis.dataFields.category = "date";
        categoryAxis.renderer.grid.template.location = 0;
        categoryAxis.renderer.minGridDistance = 10;
        categoryAxis.renderer.inside = true;
        categoryAxis.renderer.grid.template.disabled = true;
        var labelTemplate = categoryAxis.renderer.labels.template;
        labelTemplate.rotation = -90;
        labelTemplate.horizontalCenter = "left";
        labelTemplate.verticalCenter = "middle";
        labelTemplate.dy = 10; // moves it a bit down;
        labelTemplate.inside = false; // this is done to avoid settings which are not suitable when label is rotated
        var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
        valueAxis.renderer.grid.template.disabled = true;
        // Create series
        var series = chart.series.push(new am4charts.ConeSeries());
        series.dataFields.valueY = "number";
        series.dataFields.categoryX = "date";
        var columnTemplate = series.columns.template;
        columnTemplate.adapter.add("fill", function (fill, target) {
            return chart.colors.getIndex(target.dataItem.index);
        });
        columnTemplate.adapter.add("stroke", function (stroke, target) {
            return chart.colors.getIndex(target.dataItem.index);
        });
        var dateAxis = chart.xAxes.push(new am4charts.DateAxis());
        dateAxis.renderer.grid.template.location = 0;
        series.tooltipText = "{valueY.value}";
        chart.cursor = new am4charts.XYCursor();
        chart.data = data;
        // let scrollbarX = new am4charts.XYChartScrollbar();
        // scrollbarX.series.push(series);
        // chart.scrollbarX = scrollbarX;
        // .. chart code end here ...    
        this.chart = chart;
    };
    HistoricalInfoComponent.prototype.createAreaChart = function (data) {
        // Create chart
        var chart = am4core.create("countryChart", am4charts.XYChart);
        chart.paddingRight = 20;
        chart.colors.step = 2;
        chart.data = data;
        var dateAxis = chart.xAxes.push(new am4charts.DateAxis());
        dateAxis.baseInterval = {
            "timeUnit": "day",
            "count": 1
        };
        // dateAxis.tooltipDateFormat = "HH:mm, d MMMM";
        var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
        new am4charts.SerialChart;
        valueAxis.tooltip.disabled = true;
        valueAxis.title.text = "Count";
        this.createAxisAndSeries(chart, 'cases');
        this.createAxisAndSeries(chart, 'recovered');
        this.createAxisAndSeries(chart, 'deaths');
        // Add legend
        chart.legend = new am4charts.Legend();
        // Add cursor
        chart.cursor = new am4charts.XYCursor();
        dateAxis.start = 0.8;
        dateAxis.keepSelection = true;
        this.chart = chart;
    };
    HistoricalInfoComponent.prototype.createAxisAndSeries = function (chart, field) {
        var series = chart.series.push(new am4charts.LineSeries());
        series.dataFields.valueY = field;
        series.dataFields.dateX = "date";
        series.strokeWidth = 2;
        series.name = field;
        series.tooltipText = field + ": [bold]{valueY}[/]";
        // series.tensionX = 0.8;
        // series.showOnInit = true;
        chart.cursor = new am4charts.XYCursor();
        chart.cursor.lineY.opacity = 0;
        chart.scrollbarX = new am4charts.XYChartScrollbar();
        chart.scrollbarX['series'].push(series);
    };
    __decorate([
        core_1.Input()
    ], HistoricalInfoComponent.prototype, "showAreaChart");
    __decorate([
        core_1.Input()
    ], HistoricalInfoComponent.prototype, "chartData");
    HistoricalInfoComponent = __decorate([
        core_1.Component({
            selector: 'app-historical-info',
            templateUrl: './historical-info.component.html',
            styleUrls: ['./historical-info.component.scss']
        })
    ], HistoricalInfoComponent);
    return HistoricalInfoComponent;
}());
exports.HistoricalInfoComponent = HistoricalInfoComponent;
