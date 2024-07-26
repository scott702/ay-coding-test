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

export const getAllocationCount = (guestsCombination: Allocation[]) => {
  let adultCount = 0;
  let childCount = 0;
  let priceCount = 0;
  guestsCombination.forEach(({ adult, child, price }) => {
    adultCount += adult ?? 0;
    childCount += child ?? 0;
    priceCount += price ?? 0;
  });

  return {
    adultCount,
    childCount,
    priceCount,
  };
};

export const getDefaultRoomAllocation = (
  guests: Guests,
  rooms: RoomConfig[]
): Allocation[] => {
  if (guests.adult === 0) {
    return rooms.map(() => ({ adult: 0, child: 0, price: 0 }));
  }

  let guestCombination = [];

  // 列舉所有 guests 的可能
  for (let a = 1; a <= guests.adult; a += 1) {
    guestCombination.push({ adult: a, child: 0 });
    for (let c = 1; c <= guests.child; c += 1) {
      guestCombination.push({ adult: a, child: c });
    }
  }

  // convert guestCombination to allocation of each room and store result into map
  const roomAllocationMap = new Map<number, Allocation[]>();
  for (let roomIndex = 0; roomIndex < rooms.length; roomIndex += 1) {
    const room = rooms[roomIndex];

    if (!roomAllocationMap.has(roomIndex)) {
      roomAllocationMap.set(roomIndex, []);
    }

    for (let i = 0; i < guestCombination.length; i += 1) {
      const { adult, child } = guestCombination[i];
      const totalPeople = adult + child;

      if (totalPeople <= room.capacity) {
        roomAllocationMap
          .get(roomIndex)
          ?.push(getAllocationAndPrice({ adult, child }, room));
      }
    }
  }

  let min: number = Infinity;
  let minCostAllocation: Allocation[] = [];

  // use dfs to find minimum cost allocation
  const findMinCostAllocation = (
    depth: number,
    maxDepth: number,
    comb: Allocation[]
  ) => {
    if (depth === maxDepth) {
      const { adultCount, childCount, priceCount } = getAllocationCount(comb);

      if (
        adultCount === guests.adult &&
        childCount === guests.child &&
        priceCount < min
      ) {
        const copyComb = [...comb.map((item) => ({ ...item }))];

        min = priceCount;
        minCostAllocation = copyComb;
      }
      return;
    }

    const allocationArray = roomAllocationMap.get(depth) ?? [];
    for (let a = 0; a <= allocationArray.length; a += 1) {
      comb.push(allocationArray[a] ?? { adult: 0, child: 0, price: 0 });
      findMinCostAllocation(depth + 1, maxDepth, comb);
      comb.pop();
    }
  };

  findMinCostAllocation(0, rooms.length, []);

  return minCostAllocation;
};
