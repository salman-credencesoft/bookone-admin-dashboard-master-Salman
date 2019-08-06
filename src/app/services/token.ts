 import { Room } from './../views/bookone/room/room';
 import { Property } from './../views/bookone/property/property';
export interface Token {
    token: string;
    userId: number;
    propertyId: number;
    rooms: Room[];
    property: Property;
  }
