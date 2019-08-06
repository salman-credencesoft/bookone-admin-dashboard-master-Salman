import { Room } from './../room/room';
import { Property } from '../property/property';
export interface Token {
    token: string;
    userId: number;
    propertyId: number;
    rooms: Room[];
    property: Property;
  }
