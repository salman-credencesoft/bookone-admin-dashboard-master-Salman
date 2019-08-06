export enum AirPortServiceType {
  'No'= 0,
  'Pick Up',
  'Drop Off',
  'Pick-Up & Drop Off'
}

export namespace AirPortServiceType {

  export function values() {
    return Object.keys(AirPortServiceType).filter(
      (type) => isNaN(<any>type) && type !== 'values'
    );
  }
}
