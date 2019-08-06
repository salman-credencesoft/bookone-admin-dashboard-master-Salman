

export enum BookingStatus {
New= 0,
Available,
Pending,
Cancelled,
 Confirmed,
'Checked-In',
'Checked-Out'
  }
  export namespace BookingStatus {
    export function values() {
      return Object.keys(BookingStatus).filter(
        (type) => isNaN(<any>type) && type !== 'values'
      );
    }
  }