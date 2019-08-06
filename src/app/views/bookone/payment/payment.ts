
export class Payment {

    id: string;
    referenceNumber: string;
    name: string;
    email: string;
    businessEmail: string;
    amount: number;
    currency: string;
    state: string;
    token: string;
    expYear: string;
    expMonth: string;
    cardNumber: string;
    cvv: string;
    description: string;
    status: string;
    receiptNumber: string;
    failureMessage: string;
    failureCode: string;
    paymentMode: string;
    externalReference: string;
    propertyId: number;
    constructor() {
    }
}
