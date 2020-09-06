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
    function HistoricalInfoComponent(zone, appService) {
        this.zone = zone;
        this.appService = appService;
        this.days = [
            {
                value: '7',
                label: '1 Week'
            },
            {
                value: '30',
                label: '1 Month'
            },
            {
                value: '60',
                label: '2 Month'
            },
            {
                value: '90',
                label: '3 Month'
            },
            {
                value: '180',
                label: '6 Month'
            },
            {
                value: '365',
                label: '1 Year'
            }
        ];
        this.caseType = new forms_1.FormControl("cases");
        this.lastDays = new forms_1.FormControl("7");
    }
    HistoricalInfoComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.getHistoricalData(7);
        this.caseType.valueChanges.subscribe(function (value) {
            if (_this.showAreaChart) {
                var data = _this.getCases(_this.chartData, value);
                _this.createAreaChart(data);
            }
            else {
                _this.callCreate3DCyclinderChat(value);
            }
        });
        this.lastDays.valueChanges.subscribe(function (value) {
            _this.getHistoricalData(value);
        });
    };
    HistoricalInfoComponent.prototype.ngAfterViewInit = function () {
        this.zone.runOutsideAngular(function () {
            // this.getCases(this.chartData);
        });
    };
    HistoricalInfoComponent.prototype.getHistoricalData = function (days) {
        var _this = this;
        this.appService.getHistoricalData(days).subscribe(function (resp) {
            _this.chartData = resp;
            _this.createChart();
        });
    };
    HistoricalInfoComponent.prototype.ngOnChanges = function () {
        if (this.chart)
            this.chart.dispose();
        this.createChart();
    };
    HistoricalInfoComponent.prototype.createChart = function () {
        if (this.showAreaChart) {
            var data = this.getAllCases(this.chartData);
            this.createAreaChart(data);
        }
        else {
            this.callCreate3DCyclinderChat(this.caseType.value);
        }
    };
    HistoricalInfoComponent.prototype.callCreate3DCyclinderChat = function (value) {
        if (this.chart)
            this.chart.dispose();
        if (this.caseType.value === 'recovered') {
            this.create3DCyclinderChat(this.getCases(this.chartData, value), am4core.color("#22dc22"));
        }
        else if (this.caseType.value === 'cases') {
            this.create3DCyclinderChat(this.getCases(this.chartData, value), am4core.color("#232555"));
        }
        else if (this.caseType.value === 'deaths') {
            this.create3DCyclinderChat(this.getCases(this.chartData, value), am4core.color("#DF3520"));
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
            for (var key in resp['cases']) {
                var obj = {
                    cases: resp['cases'][key],
                    deaths: resp['deaths'][key],
                    recovered: resp['recovered'][key],
                    date: key
                };
                result.push(obj);
            }
        }
        return result;
    };
    HistoricalInfoComponent.prototype.create3DCyclinderChat = function (data, color) {
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
        columnTemplate.stroke = color;
        columnTemplate.fill = color;
        // columnTemplate.adapter.add("fill", function (fill, target) {
        //   return chart.colors.getIndex(target.dataItem.index);
        // })
        // columnTemplate.adapter.add("stroke", function (stroke, target) {
        //   return chart.colors.getIndex(target.dataItem.index);
        // })
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
    };
    HistoricalInfoComponent.prototype.createAxisAndSeries = function (chart, field, strokeColor) {
        var series = chart.series.push(new am4charts.LineSeries());
        series.dataFields.valueY = field;
        series.dataFields.dateX = "date";
        series.strokeWidth = 2;
        series.name = field;
        series.stroke = strokeColor;
        series.tooltipText = field + ": [bold]{valueY}[/]";
        chart.cursor = new am4charts.XYCursor();
        chart.cursor.lineY.opacity = 0;
        chart.scrollbarX = new am4charts.XYChartScrollbar();
        chart.scrollbarX['series'].push(series);
    };
    __decorate([
        core_1.Input()
    ], HistoricalInfoComponent.prototype, "showAreaChart");
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
