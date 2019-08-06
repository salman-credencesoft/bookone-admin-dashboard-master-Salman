import { Address } from '../address-checker/Address';
import { PropertyStatusType } from './../enums/PropertyStatusType';
export class Property {

    id: number;
    name: string;
    email: string;
    managerName: string;
    managerContactNo: string;
    managerEmailAddress: string ;
    address: Address;
    contactNumber: string;
    landphone: string;
    status: PropertyStatusType;
    gstNumber: string;
    userId: string;
    propertyBarCode: Uint8Array[] ;
    logoUrl: string ;
    imageUrl: string;
    website: string;
    slogan: string ;
    mobile: string ;
    managerFirstName: string;
    managerLastName: string; 
    constructor() {
     }
}
