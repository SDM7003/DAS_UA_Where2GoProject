import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterEvent'
})
export class FilterEventPipe implements PipeTransform {

  transform(value: any, arg: any): any {
    const resultEvents = [];
    for (const event of value) {
      if (event.name.toLocaleLowerCase().indexOf(arg.toLowerCase()) > -1) {
        resultEvents.push(event);
      }
    }
    return resultEvents;
  }

}
