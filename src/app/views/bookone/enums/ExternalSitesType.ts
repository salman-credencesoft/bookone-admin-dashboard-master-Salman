export enum ExternalSitesType {
  'Booking.com'= 1,
  AirBnB,
  Agoda,
  'Hotel.com'
}

export namespace ExternalSitesType {

  export function values() {
    return Object.keys(ExternalSitesType).filter(
      (type) => isNaN(<any>type) && type !== 'values'
    );
  }
}
