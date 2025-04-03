import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FileHandlerService {

  // saveJsonToFile(data: any, fileName: string) {
  //   const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  //   const a = document.createElement('a');
  //   a.href = URL.createObjectURL(blob);
  //   a.download = fileName;
  //   document.body.appendChild(a);
  //   a.click();
  //   document.body.removeChild(a);
  // }
}
