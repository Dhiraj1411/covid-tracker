import { AfterViewInit, Component, OnInit, ViewChild, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable } from '@angular/material/table';
import { pipe } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { CountryDataSource, CountryItem } from './country-datasource';

@Component({
  selector: 'app-country',
  templateUrl: './country.component.html',
  styleUrls: ['./country.component.scss']
})
export class CountryComponent implements AfterViewInit, OnInit {
  @Input() countryWiseData;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatTable) table: MatTable<CountryItem>;
  dataSource: CountryDataSource;

  searchCountry = new FormControl("");

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  // displayedColumns = ['id', 'name'];
  displayedColumns = ['country', 'cases', 'active', 'recovered', 'deaths'];


  ngOnInit() {
    // this.dataSource = new CountryDataSource();
    // this.dataSource.data = this.countryWiseData;
    this.searchCountry.valueChanges.pipe(debounceTime(1000)).subscribe(value => {
      const data = this.countryWiseData.filter(item => {
        return item.country.toLowerCase().includes(value.toLowerCase());
      });
      const countryDataSource = new CountryDataSource(data);
      countryDataSource.paginator = this.paginator;
      countryDataSource.sort = this.sort;
      this.updateTable(countryDataSource);
    });
  }

  ngOnChanges() {
    this.dataSource = new CountryDataSource(this.countryWiseData);

  }

  ngAfterViewInit() {
    this.updateTable(this.dataSource);
  }

  updateTable(data) {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.table.dataSource = data;
  }
}
