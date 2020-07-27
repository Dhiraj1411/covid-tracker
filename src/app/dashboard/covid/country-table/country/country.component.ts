import { AfterViewInit, Component, OnInit, ViewChild, Input } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable } from '@angular/material/table';
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

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  // displayedColumns = ['id', 'name'];
  displayedColumns = ['country', 'cases', 'active', 'recovered', 'deaths'];


  ngOnInit() {
    // this.dataSource = new CountryDataSource();
    // this.dataSource.data = this.countryWiseData;
  }

  ngOnChanges() {
    // this.dataSource.data = this.countryWiseData;
    this.dataSource = new CountryDataSource(this.countryWiseData);

  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.table.dataSource = this.dataSource;
  }
}
