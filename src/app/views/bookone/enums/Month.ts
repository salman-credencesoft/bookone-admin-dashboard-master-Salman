export enum MonthType {
  'JAN'= 1,
  'FEB',
  'MAR',
  'APR',
  'MAY',
  'JUN',
  'JUL',
  'AUG',
  'SEP',
  'OCT',
  'NOV',
  'DEC'
}

export namespace MonthType {

  export function values() {
    return Object.keys(MonthType).filter(
      (type) => isNaN(<any>type) && type !== 'values'
    );
  }
}
