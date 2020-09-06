"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.TodayInfoComponent = void 0;
var core_1 = require("@angular/core");
var am4core = require("@amcharts/amcharts4/core");
var am4charts = require("@amcharts/amcharts4/charts");
var animated_1 = require("@amcharts/amcharts4/themes/animated");
var frozen_1 = require("@amcharts/amcharts4/themes/frozen");
am4core.useTheme(frozen_1["default"]);
am4core.useTheme(animated_1["default"]);
var TodayInfoComponent = /** @class */ (function () {
    function TodayInfoComponent(zone, appService) {
        this.zone = zone;
        this.appService = appService;
    }
    TodayInfoComponent.prototype.ngOnInit = function () {
    };
    TodayInfoComponent.prototype.ngAfterViewInit = function () {
        this.zone.runOutsideAngular(function () {
        });
    };
    TodayInfoComponent.prototype.ngOnChanges = function () {
        var _this = this;
        if (this.showPieChart === 'donut') {
            setTimeout(function () { _this.createPieChart('donut'); }, 500);
        }
        if (this.showPieChart === 'pie') {
            setTimeout(function () { _this.createPieChart('pie'); }, 500);
        }
        else if (this.pieChart) {
            this.pieChart.dispose();
        }
    };
    TodayInfoComponent.prototype.am4themes_myTheme_lineChart = function (target) {
        if (target instanceof am4core.ColorSet) {
            target.list = [
                am4core.color("#232555"),
                am4core.color("#22dc22"),
                am4core.color("#DF3520"),
            ];
        }
    };
    TodayInfoComponent.prototype.createPieChart = function (userChartType) {
        var data = [
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
        am4core.useTheme(this.am4themes_myTheme_lineChart);
        var chart = am4core.create("currentDayChart", am4charts.PieChart);
        var total = 0;
        chart.data = data;
        for (var _i = 0, data_1 = data; _i < data_1.length; _i++) {
            var item = data_1[_i];
            total = total + item['number'];
        }
        if (userChartType === 'donut')
            chart.innerRadius = 40;
        var label = chart.seriesContainer.createChild(am4core.Label);
        label.text = total.toString(); // Typcasting to string;
        label.horizontalCenter = "middle";
        label.verticalCenter = "middle";
        label.fontSize = 20;
        // Add and configure Series
        var pieSeries = chart.series.push(new am4charts.PieSeries());
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
    };
    TodayInfoComponent.prototype.ngOnDestroy = function () {
        var _this = this;
        this.zone.runOutsideAngular(function () {
            if (_this.pieChart) {
                _this.pieChart.dispose();
            }
        });
    };
    __decorate([
        core_1.Input()
    ], TodayInfoComponent.prototype, "showPieChart");
    __decorate([
        core_1.Input()
    ], TodayInfoComponent.prototype, "currentDayChartData");
    TodayInfoComponent = __decorate([
        core_1.Component({
            selector: 'app-today-info',
            templateUrl: './today-info.component.html',
            styleUrls: ['./today-info.component.scss']
        })
    ], TodayInfoComponent);
    return TodayInfoComponent;
}());
exports.TodayInfoComponent = TodayInfoComponent;
