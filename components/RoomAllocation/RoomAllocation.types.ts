import { RoomPeopleType } from '@/components/RoomAllocation/RoomAllocation.enums';

export type Guests = {
  [key in RoomPeopleType]: number;
};

export type Allocation = Guests & {
  price: number;
};

export type RoomConfig = {
  roomPrice: number;
  adultPrice: number;
  childPrice: number;
  capacity: number;
};
