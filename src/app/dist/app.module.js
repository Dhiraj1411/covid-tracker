"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.AppModule = void 0;
var platform_browser_1 = require("@angular/platform-browser");
var core_1 = require("@angular/core");
var app_routing_module_1 = require("./app-routing.module");
var app_component_1 = require("./app.component");
var animations_1 = require("@angular/platform-browser/animations");
var service_worker_1 = require("@angular/service-worker");
var environment_1 = require("../environments/environment");
var covid_component_1 = require("./dashboard/covid/covid.component");
var grid_list_1 = require("@angular/material/grid-list");
var card_1 = require("@angular/material/card");
var menu_1 = require("@angular/material/menu");
var icon_1 = require("@angular/material/icon");
var button_1 = require("@angular/material/button");
var layout_1 = require("@angular/cdk/layout");
var http_1 = require("@angular/common/http");
var country_component_1 = require("./dashboard/covid/country-table/country/country.component");
var table_1 = require("@angular/material/table");
var paginator_1 = require("@angular/material/paginator");
var sort_1 = require("@angular/material/sort");
var number_format_pipe_1 = require("./pipe/number-format.pipe");
var world_map_component_1 = require("./dashboard/covid/world-map/world-map.component");
var today_info_component_1 = require("./dashboard/covid/today-info/today-info.component");
var historical_info_component_1 = require("./dashboard/covid/historical-info/historical-info.component");
var select_1 = require("@angular/material/select");
var forms_1 = require("@angular/forms");
var button_toggle_1 = require("@angular/material/button-toggle");
var form_field_1 = require("@angular/material/form-field");
var input_1 = require("@angular/material/input");
var AppModule = /** @class */ (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        core_1.NgModule({
            declarations: [
                app_component_1.AppComponent,
                covid_component_1.COVIDComponent,
                country_component_1.CountryComponent,
                number_format_pipe_1.NumberFormatPipe,
                world_map_component_1.WorldMapComponent,
                today_info_component_1.TodayInfoComponent,
                historical_info_component_1.HistoricalInfoComponent
            ],
            imports: [
                platform_browser_1.BrowserModule,
                app_routing_module_1.AppRoutingModule,
                animations_1.BrowserAnimationsModule,
                service_worker_1.ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment_1.environment.production }),
                grid_list_1.MatGridListModule,
                card_1.MatCardModule,
                menu_1.MatMenuModule,
                icon_1.MatIconModule,
                button_1.MatButtonModule,
                layout_1.LayoutModule,
                http_1.HttpClientModule,
                table_1.MatTableModule,
                paginator_1.MatPaginatorModule,
                sort_1.MatSortModule,
                select_1.MatSelectModule,
                button_1.MatButtonModule,
                button_toggle_1.MatButtonToggleModule,
                forms_1.ReactiveFormsModule,
                form_field_1.MatFormFieldModule,
                input_1.MatInputModule
            ],
            providers: [],
            bootstrap: [app_component_1.AppComponent]
        })
    ], AppModule);
    return AppModule;
}());
exports.AppModule = AppModule;
