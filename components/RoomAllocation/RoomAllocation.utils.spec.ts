import { case1, case2, case3 } from '@/constants/data';
import {
  getGuestsText,
  getAllocationAndPrice,
  getAllocationCount,
  getDefaultRoomAllocation,
  getRoomMaximum,
} from '@/components/RoomAllocation/RoomAllocation.utils';

describe('test RoomAllocation utils', () => {
  describe('test getGuestsText', () => {
    it('guests with adult', () => {
      const { guests } = case2;
      const text = getGuestsText(guests);
      expect(text).toBe('16 位大人');
    });

    it('guests with child', () => {
      const { guests } = case3;
      const text = getGuestsText(guests);
      expect(text).toBe('1 位小孩');
    });

    it('should combine adult text and child text with comma if guests contain adult and child', () => {
      const { guests } = case1;
      const text = getGuestsText(guests);
      expect(text).toBe('4 位大人, 2 位小孩');
    });
  });

  describe('test getAllocationAndPrice', () => {
    it('allocation with adult', () => {
      const { guests, rooms } = case2;
      const { price, ...allocationGuests } = getAllocationAndPrice(
        guests,
        rooms[0]
      );

      expect(allocationGuests).toEqual(guests);
      expect(price).toBe(8500);
    });

    it('allocation with adult and child', () => {
      const { guests, rooms } = case1;
      const { price, ...allocationGuests } = getAllocationAndPrice(
        guests,
        rooms[0]
      );

      expect(allocationGuests).toEqual(guests);
      expect(price).toBe(2000);
    });

    it('should return the price to 0 if guest only contain child', () => {
      const { guests, rooms } = case3;
      const { price, ...allocationGuests } = getAllocationAndPrice(
        guests,
        rooms[0]
      );

      expect(allocationGuests).toEqual(guests);
      expect(price).toBe(0);
    });
  });

  describe('test getAllocationCount', () => {
    it('should return the sum of all adult, child and price ', () => {
      const { rooms } = case1;
      const fakeGuests = [
        { adult: 1, child: 1 },
        { adult: 1, child: 0 },
        { adult: 2, child: 0 },
      ];
      const allocations = rooms.map((room, i) =>
        getAllocationAndPrice(fakeGuests[i], room)
      );

      const allocationCount = getAllocationCount(allocations);

      expect(allocationCount.adultCount).toEqual(4);
      expect(allocationCount.childCount).toEqual(1);
      expect(allocationCount.priceCount).toEqual(2900);
    });
  });

  describe('test getDefaultRoomAllocation', () => {
    it('should return the allocation of minimum cost', () => {
      const { rooms, guests } = case1;
      const allocation = getDefaultRoomAllocation(guests, rooms);

      expect(allocation).toEqual([
        { adult: 0, child: 0, price: 0 },
        { adult: 2, child: 0, price: 1000 },
        { adult: 2, child: 2, price: 1500 },
      ]);
    });

    it('should return all price of allocation to 0 if guests only contain child', () => {
      const { rooms, guests } = case3;
      const allocation = getDefaultRoomAllocation(guests, rooms);

      expect(allocation).toEqual([
        { adult: 0, child: 0, price: 0 },
        { adult: 0, child: 0, price: 0 },
        { adult: 0, child: 0, price: 0 },
      ]);
    });
  });

  describe('test getRoomMaximum', () => {
    it('should return current guests if the rest guests is 0', () => {
      const REST = 0;
      const CURRENT_SELECT = 1;

      expect(getRoomMaximum(REST, CURRENT_SELECT)).toEqual(CURRENT_SELECT);
    });

    it('should return current guests plus rest guest if the rest guests is not 0', () => {
      const REST = 2;
      const CURRENT_SELECT = 1;

      expect(getRoomMaximum(REST, CURRENT_SELECT)).toEqual(
        CURRENT_SELECT + REST
      );
    });
  });
});
