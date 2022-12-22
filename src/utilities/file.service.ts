import { Injectable } from '@angular/core';
import * as FileSaver from 'file-saver';

@Injectable({
  providedIn: 'root'
})
export class FileService {

  constructor() { }

  csvDownload(headers: any, data: any) {
    if(!data) { return}
    const separator = ',';
    const csvContent: any = 
      headers.join(separator) +
      '\n' +
      data
      .map((rowData: any) => {
        return headers
          .map((headKey) => {
            return rowData[headKey.toLowerCase().replaceAll(' ', '_')]
            ===
              null ||
              rowData[headKey.toLowerCase().replaceAll(' ', '_')]
            === undefined
            ? '' 
            : rowData[headKey.toLowerCase().replaceAll(' ', '_')]
          }).join(separator)
      }).join('\n');
      this.exportFile(csvContent, 'text/csv');
  }

  exportFile(data: any, fileType: string) {
    const blob = new Blob([data], {type: fileType});
    FileSaver.saveAs(blob, 'Conversion-CSV');
  }
}
