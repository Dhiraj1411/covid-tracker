"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.COVIDComponent = void 0;
var core_1 = require("@angular/core");
var operators_1 = require("rxjs/operators");
var layout_1 = require("@angular/cdk/layout");
var am4core = require("@amcharts/amcharts4/core");
var animated_1 = require("@amcharts/amcharts4/themes/animated");
var frozen_1 = require("@amcharts/amcharts4/themes/frozen");
var forms_1 = require("@angular/forms");
am4core.useTheme(frozen_1["default"]);
am4core.useTheme(animated_1["default"]);
var COVIDComponent = /** @class */ (function () {
    function COVIDComponent(breakpointObserver, zone, appService) {
        this.breakpointObserver = breakpointObserver;
        this.zone = zone;
        this.appService = appService;
        this.cards = this.breakpointObserver.observe(layout_1.Breakpoints.Handset).pipe(operators_1.map(function (_a) {
            var matches = _a.matches;
            if (matches) {
                return [
                    { title: 'Today (Worldwide)', cols: 11, rows: 2, content: 'current' },
                    { title: 'Countries', cols: 11, rows: 5, content: 'table' },
                    { title: 'Worldwide info', cols: 11, rows: 4, content: 'world_wide_case' },
                    { title: 'World Map', cols: 11, rows: 3, content: 'map' },
                ];
            }
            return [
                { title: 'Today (Worldwide)', cols: 7, rows: 2, content: 'current' },
                { title: 'Countries', cols: 4, rows: 5, content: 'table' },
                { title: 'World Map', cols: 7, rows: 3, content: 'map' },
                { title: 'Worldwide info', cols: 11, rows: 4, content: 'world_wide_case' },
            ];
        }));
        this.showPieChart = 'pie';
        this.showAreaChart = false;
        this.selectedPieChart = new forms_1.FormControl('numeric');
        this.getApiData();
    }
    COVIDComponent.prototype.getApiData = function () {
        var _this = this;
        this.appService.getCurrentDayData().subscribe(function (resp) {
            _this.currentDayChartData = resp;
        });
        this.appService.getCountryWiseData().subscribe(function (resp) {
            _this.countryWiseData = resp;
        });
    };
    COVIDComponent.prototype.ngAfterViewInit = function () {
        this.zone.runOutsideAngular(function () {
        });
    };
    COVIDComponent = __decorate([
        core_1.Component({
            selector: 'app-covid',
            templateUrl: './covid.component.html',
            styleUrls: ['./covid.component.scss']
        })
    ], COVIDComponent);
    return COVIDComponent;
}());
exports.COVIDComponent = COVIDComponent;
