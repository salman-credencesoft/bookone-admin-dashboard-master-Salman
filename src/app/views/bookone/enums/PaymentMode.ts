
export enum PaymentMode {
Cash= 0,
Card,
'Bank Transfer'
  }
  export namespace PaymentMode {
    export function values() {
      return Object.keys(PaymentMode).filter(
        (type) => isNaN(<any>type) && type !== 'values'
      );
    }
  }