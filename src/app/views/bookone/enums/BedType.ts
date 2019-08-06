export enum BedType {
    'Single Bed',
    'Trundler Bed' ,
    'Double Bed',
    'Queen Bed'
  }
  export namespace BedType {
    export function values() {
      return Object.keys(BedType).filter(
        (type) => isNaN(<any>type) && type !== 'values'
      );
    }
  }