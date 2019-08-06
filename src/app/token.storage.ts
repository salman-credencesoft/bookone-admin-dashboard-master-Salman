import { Injectable } from '@angular/core';
import { Room } from './views/bookone/room/room';
import { Property } from './views/bookone/property/property';


const TOKEN_KEY = 'AuthToken';
const USER_ID = 'UserId';
const PROPERTY_ID = 'PropertyId';
const ROOM_TYPES = 'RoomDetails';
const PROPERTY_DETAILS = 'PropertyDetails';

@Injectable()
export class TokenStorage {
  rooms: Room[] ;

  constructor() { }

  signOut() {
    window.sessionStorage.removeItem(TOKEN_KEY);
    window.sessionStorage.removeItem(USER_ID);
    window.sessionStorage.removeItem(PROPERTY_ID);
    window.sessionStorage.removeItem(ROOM_TYPES);
    window.sessionStorage.clear();
  }

  public saveToken(token: string) {
    window.sessionStorage.removeItem(TOKEN_KEY);
    window.sessionStorage.setItem(TOKEN_KEY, token);
  }

  public getToken(): string {
    return sessionStorage.getItem(TOKEN_KEY);
  }
  public saveUserId(userId: number) {
    console.log(`User ID Inside Token Stoarge` + userId);
    window.sessionStorage.removeItem(USER_ID);
    window.sessionStorage.setItem(USER_ID, userId.toString());
  }
  public getUserId(): string {
    return sessionStorage.getItem(USER_ID);
  }
  public getPropertyId(): string {
    return sessionStorage.getItem(PROPERTY_ID);
  }
  public getRoomTypes(): Room[] {
    return JSON.parse(sessionStorage.getItem(ROOM_TYPES));
  }
  public getProperty(): Property {
    return JSON.parse(sessionStorage.getItem(PROPERTY_DETAILS));
  }
  public savePropertyId(propertyId: number) {
    console.log(`User ID Inside Token Stoarge` + propertyId);
    window.sessionStorage.removeItem(PROPERTY_ID);
    if (propertyId != null) {
      window.sessionStorage.setItem(PROPERTY_ID, propertyId.toString());
    } else {
      window.sessionStorage.setItem(PROPERTY_ID, null);
    }
  }
  public saveRoomTypes(roomTypes: Room[]) {
    console.log(roomTypes);
    window.sessionStorage.removeItem(ROOM_TYPES);
    if (roomTypes !== null || roomTypes !== undefined ) {
      window.sessionStorage.setItem(ROOM_TYPES, JSON.stringify(roomTypes));
    } else {
      window.sessionStorage.setItem(ROOM_TYPES, null);
    }
  }
  public saveProperty(property: Property) {
    window.sessionStorage.removeItem(PROPERTY_DETAILS);
    if (property != null) {
      window.sessionStorage.setItem(PROPERTY_DETAILS, JSON.stringify(property));
    } else {
      window.sessionStorage.setItem(PROPERTY_DETAILS, null);
    }
  }


}
