"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.CountryComponent = void 0;
var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
var paginator_1 = require("@angular/material/paginator");
var sort_1 = require("@angular/material/sort");
var table_1 = require("@angular/material/table");
var operators_1 = require("rxjs/operators");
var country_datasource_1 = require("./country-datasource");
var CountryComponent = /** @class */ (function () {
    function CountryComponent() {
        this.searchCountry = new forms_1.FormControl("");
        /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
        // displayedColumns = ['id', 'name'];
        this.displayedColumns = ['country', 'cases', 'active', 'recovered', 'deaths'];
    }
    CountryComponent.prototype.ngOnInit = function () {
        var _this = this;
        // this.dataSource = new CountryDataSource();
        // this.dataSource.data = this.countryWiseData;
        this.searchCountry.valueChanges.pipe(operators_1.debounceTime(1000)).subscribe(function (value) {
            var data = _this.countryWiseData.filter(function (item) { return item.country.includes(value); });
            var countryDataSource = new country_datasource_1.CountryDataSource(data);
            countryDataSource.paginator = _this.paginator;
            countryDataSource.sort = _this.sort;
            _this.updateTable(countryDataSource);
        });
    };
    CountryComponent.prototype.ngOnChanges = function () {
        this.dataSource = new country_datasource_1.CountryDataSource(this.countryWiseData);
    };
    CountryComponent.prototype.ngAfterViewInit = function () {
        this.updateTable(this.dataSource);
    };
    CountryComponent.prototype.updateTable = function (data) {
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
        this.table.dataSource = data;
    };
    __decorate([
        core_1.Input()
    ], CountryComponent.prototype, "countryWiseData");
    __decorate([
        core_1.ViewChild(paginator_1.MatPaginator)
    ], CountryComponent.prototype, "paginator");
    __decorate([
        core_1.ViewChild(sort_1.MatSort)
    ], CountryComponent.prototype, "sort");
    __decorate([
        core_1.ViewChild(table_1.MatTable)
    ], CountryComponent.prototype, "table");
    CountryComponent = __decorate([
        core_1.Component({
            selector: 'app-country',
            templateUrl: './country.component.html',
            styleUrls: ['./country.component.scss']
        })
    ], CountryComponent);
    return CountryComponent;
}());
exports.CountryComponent = CountryComponent;
