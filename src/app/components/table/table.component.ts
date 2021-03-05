import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { DataFormatService } from 'src/app/service/data-format.service';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit {
  dataSubscribe: Subscription | undefined;
  headers: string[] = [];
  dataList: string[][] = [];

  constructor(
    private dataFormatService: DataFormatService,
  ) { }

  ngOnInit(): void {
    this.dataSubscribe = this.dataFormatService.tourObservable.subscribe(data => {
      this.headers = data.tableData.headers;
      this.dataList = data.tableData.dataLsit;
    });
  }

  ngOnDestroy(): void {
    this.dataSubscribe?.unsubscribe();
  }

  delete(index: number) {
    this.dataFormatService.dataSubject.next({
      ...this.dataFormatService.sharedData,
      jsonData: this.dataFormatService.sharedData.jsonData.splice(index, 1),
    });
    this.dataFormatService.json2csv(this.dataFormatService.sharedData.jsonData);
  }
}
