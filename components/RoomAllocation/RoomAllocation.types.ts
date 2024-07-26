import { RoomPeopleType } from '@/components/RoomAllocation/RoomAllocation.enums';

export type Guests = {
  [key in RoomPeopleType]: number;
};
