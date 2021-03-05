import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { DataFormatService } from 'src/app/service/data-format.service';

@Component({
  selector: 'app-convert',
  templateUrl: './convert.component.html',
  styleUrls: ['./convert.component.scss']
})
export class ConvertComponent implements OnInit {
  dataSubscribe: Subscription | undefined;
  csvData: string = '';
  jsonData: string = '';

  constructor(
    private dataFormatService: DataFormatService,
  ) { }

  ngOnInit(): void {
    this.dataSubscribe = this.dataFormatService.tourObservable.subscribe(data => {
      if (data.jsonData.length === 0) {
        this.jsonData = '';
      } else {
        this.jsonData = JSON.stringify(data.jsonData);
      }
      this.csvData = data.csvData;
    });
  }

  ngOnDestroy(): void {
    this.dataSubscribe?.unsubscribe();
  }

  csv2json(csvData: string) {
    this.dataFormatService.csv2json(csvData);
  }
}
