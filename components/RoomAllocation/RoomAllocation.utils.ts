import { RoomPeopleType } from '@/components/RoomAllocation/RoomAllocation.enums';
import {
  Allocation,
  Guests,
  RoomConfig,
} from '@/components/RoomAllocation/RoomAllocation.types';

export const getGuestsText = (guest: Guests) => {
  let stringArray: string[] = [];
  (Object.keys(guest) as RoomPeopleType[]).forEach((key) => {
    if (key === RoomPeopleType.ADULT && guest[key]) {
      stringArray.push(`${guest[key]} 位大人`);
    }

    if (key === RoomPeopleType.CHILD && guest[key]) {
      stringArray.push(`${guest[key]} 位小孩`);
    }
  });

  return stringArray.join(', ') ?? '';
};

export const getAllocationAndPrice = (
  guests: Guests,
  roomConfig: RoomConfig
): Allocation => {
  let price = 0;

  if (guests[RoomPeopleType.ADULT] > 0) {
    const { adultPrice, childPrice, roomPrice } = roomConfig;
    price +=
      roomPrice +
      guests[RoomPeopleType.ADULT] * adultPrice +
      guests[RoomPeopleType.CHILD] * childPrice;
  }

  return {
    ...guests,
    price,
  };
};
