export enum RoomType {
  'Single Bed'= 70,
  'Double Bed(1 Person)' = 90,
  'Double Bed (2 Person)'= 110,
  'Whole House' = 220
}

export namespace RoomType {

  export function values() {
    return Object.keys(RoomType).filter(
      (type) => isNaN(<any>type) && type !== 'values'
    );
  }
}
