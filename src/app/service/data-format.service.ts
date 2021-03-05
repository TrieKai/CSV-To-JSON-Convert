import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

interface sharedData {
  csvData: string
  jsonData: { [key: string]: string }[]
  tableData: {
    headers: string[]
    dataLsit: any[]
  }
}

@Injectable({
  providedIn: 'root'
})
export class DataFormatService {
  sharedData: sharedData = { csvData: '', jsonData: [], tableData: { headers: [], dataLsit: [] } };
  dataSubject = new Subject<sharedData>();
  tourObservable = this.dataSubject.asObservable();

  constructor() { }

  csv2json(csvData: string) {
    if (csvData === '') { return; }
    let lines = csvData.split("\n");
    let result = [];
    let headers = lines[0].split(",");

    for (let i = 1; i < lines.length; i++) {
      let obj: any = {};
      let currentline = lines[i].split(",");

      for (let j = 0; j < headers.length; j++) {
        obj[headers[j]] = currentline[j];
      }
      result.push(obj);
    }

    this.sharedData = { csvData: csvData, jsonData: result, tableData: this.handleTableData(result) }
    this.dataSubject.next(this.sharedData);
  }

  json2csv(jsonData: { [key: string]: string }[]) {
    if (jsonData.length === 0) {
      this.dataSubject.next({ csvData: '', jsonData: [], tableData: { headers: [], dataLsit: [] } });
      return;
    }
    let result = '';
    // Header
    Object.keys(jsonData[0]).forEach(header => {
      if (result !== '') { result += ','; }
      result += header;
    });

    // Data
    for (let i = 0; i < jsonData.length; i++) {
      let line = '';
      for (let index in jsonData[i]) {
        console.log(index)
        console.log(jsonData)
        if (line !== '') { line += ','; }
        line += jsonData[i][index];
      }
      result += '\n' + line;
    }

    this.sharedData = { csvData: result, jsonData: jsonData, tableData: this.handleTableData(jsonData) }
    this.dataSubject.next(this.sharedData);
  }

  handleTableData(jsonData: object[]) {
    const headers = Object.keys(jsonData[0]);
    const dataList = jsonData.map(item => {
      return Object.values(item);
    })
    const result = { headers: headers, dataLsit: dataList }

    return result;
  }
}
