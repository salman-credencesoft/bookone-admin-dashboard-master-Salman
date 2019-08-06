import { Injectable } from '@angular/core';
@Injectable()
export class DateUtilService {

    convertJavaSQLDateToCalenderDate(date: string): Date {
        const year = date.substring(0, 4);
        const month = date.substring(5, 7);
        const day = date.substring(8, 10);
        const calenderDate = new Date();
        calenderDate.setFullYear(+year, +month - 1, +day);
        return calenderDate;
      }
    convertDate(date: Date) {
        const month = date.getMonth() + 1;
        const day = date.getDate();
        let month1;
        let day1;
        if (month < 10) {
          month1 = `0${month}`;
        } else {
          month1 = `${month}`;
        }
        if (day < 10) {
          day1 = `0${day}`;
        } else {
          day1 = `${day}`;
        }
        return `${date.getFullYear()}-${month1}-${day1}`;
      }
      convertCalenderDateToJavaSQLDate(date: Date) {
        const month = date.getMonth() + 1;
        const day = date.getDate();
        let month1;
        let day1;
        if (month < 10) {
          month1 = `0${month}`;
        } else {
          month1 = `${month}`;
        } if (day < 10) {
          day1 = `0${day}`;
        } else {
          day1 = `${day}`;
        }
        return `${date.getFullYear()}-${month1}-${day1}`;
      }

}
