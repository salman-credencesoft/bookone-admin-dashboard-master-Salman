import {Service} from './../service/service';
import {RoomDetails, BedDetails} from './../availability/availability.component';

export class Booking {

    id: number;
    referenceNumber: string;
    firstName: string;
    lastName: string;
    email: string;
    mobile: string;
    fromDate: string;
    fromDateCal: Date;
    toDate: string;
    roomType: string;
    roomPrice: string;
    airportShuttlePrice: string;
    businessEmail: string;
    businessName: string;
    notes: string ;
    externalBookingID: string;
    externalSite: string;
    commissionAmount: string;
    gstAmount: string;
    paymentSurcharge: string ;
    netAmount: string;
    airportService: string;
    accomodationType: string;
    roomId: number;
    propertyId: number;
    available: Boolean ;
    modeOfPayment: string ;
    cardNumber: number;
    expMonth: number;
    expYear: number;
    cvv: number;
    currency: string;
    token: string ;
    bookingAmount: number ;
    payableAmount: number ;
    roomName: string ;
    services: Service [];
    totalServiceAmount: number ;
    totalExpenseAmount: number ;
    totalPaymentAmount: number ;
    outstandingAmount: number ;
    discountAmount: number;
    totalAmount: number;
    bookingStatus: string;
    invoiceUrl: string ;
    noOfRooms: number;
    noOfPersons: number;
    checkinTime: Date ;
    checkoutTime: Date ;
    extraPersonCharge: number;
    noOfExtraPerson: number ;
    roomDetails: RoomDetails[] ;
    bedDetails: BedDetails[] ;
    createdBy: string ;
    createdDate: Date ;
    lastModifiedBy: string ;
    lastModifiedDate: Date ;
    changeType: string;
    message: string;
    noOfNights: number ;
    
    constructor() { }
}

