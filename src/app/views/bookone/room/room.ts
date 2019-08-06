import { Bed } from './../bed/bed';
import { MatTableDataSource } from '@angular/material';
import { RatesAndAvailability } from './../rates-availability/manage/manage-rates-availability.component';
export class Room {

    id: number;
    name: string;
    description: string;
    minimumOccupancy: number;
    maximumOccupancy: number;
    extraChargePerPerson: number;
    propertyId: number;
    roomOnlyPrice: number;
    totalPriceServices: number;
    totalPriceAmenities: number;
    totalPriceRoom: number;
    noOfPerson: number;
    shared: Boolean;
    noOfRooms: number ;
    beds: Bed[];
    dataSource: MatTableDataSource<RatesAndAvailability> ;

    constructor()
        { } 
}