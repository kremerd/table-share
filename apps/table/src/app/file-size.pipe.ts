import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fileSize'
})
export class FileSizePipe implements PipeTransform {

  transform(value: number): string {
    const units = ['bytes', 'kB', 'MB', 'GB', 'TB'];
    const exponent = Math.min(Math.floor(Math.log2(value) / 10), units.length - 1);
    const scaledValue = Math.round(value / Math.pow(1024, exponent));
    return `${scaledValue} ${units[exponent]}`;
  }

}
