export interface Expense {
    id: number ;
    date: string;
    propertyId: number;
    name: string;
    description: string;
    amount: number;
    receiptNumber: string;
    notes: string;
    submittedBy: string;
    receiptUrl: string;
    bookingId: string;
    receiptFileName: string;
    businessEmail: string;
    externalReference: string;
    email: string ;
  }