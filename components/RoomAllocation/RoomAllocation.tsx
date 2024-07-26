'use client';

import { useCallback, useMemo, useState } from 'react';
import styled from 'styled-components';

import RoomAllocationItem from '@/components/RoomAllocation/RoomAllocationItem';
import { RoomPeopleType } from '@/components/RoomAllocation/RoomAllocation.enums';
import {
  Allocation,
  Guests,
  RoomConfig,
} from '@/components/RoomAllocation/RoomAllocation.types';
import {
  getAllocationAndPrice,
  getAllocationCount,
  getDefaultRoomAllocation,
  getGuestsText,
} from '@/components/RoomAllocation/RoomAllocation.utils';

import Notice from '@/components/Notice/Notice';
import { COLOR_BLUE_1 } from '@/constants/colors';

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-flow: column;
  gap: 12px;
`;

const Title = styled.span`
  font-size: 24px;
  font-weight: bold;
`;

const Cost = styled.span`
  color: ${COLOR_BLUE_1};
`;

interface RoomAllocationProps {
  guests: Guests;
  rooms: RoomConfig[];
  onChange: (result: Allocation[]) => void;
}

const RoomAllocation = ({ guests, rooms, onChange }: RoomAllocationProps) => {
  const defaultRoomAllocation = useMemo(
    () => getDefaultRoomAllocation(guests, rooms),
    [guests, rooms]
  );

  const [roomAllocation, setRoomAllocation] = useState<Allocation[]>(
    defaultRoomAllocation
  );

  const restAllocationGuests = useMemo<Guests>(() => {
    const result = { ...guests };

    roomAllocation.forEach((item) => {
      Object.values(RoomPeopleType).forEach((type) => {
        result[type] -= item[type];
      });
    });

    return result;
  }, [guests, roomAllocation]);

  const currentCost = useMemo<number>(
    () => getAllocationCount(roomAllocation).priceCount,
    [roomAllocation]
  );

  const isNoAdult = useMemo<boolean>(
    () =>
      guests[RoomPeopleType.ADULT] === 0 && guests[RoomPeopleType.CHILD] > 0,
    [guests]
  );

  const roomsOptions = useMemo(() => {
    return rooms.map((item, i) => [
      {
        name: RoomPeopleType.ADULT,
        min: 0,
        max:
          restAllocationGuests[RoomPeopleType.ADULT] === 0
            ? roomAllocation[i][RoomPeopleType.ADULT]
            : item.capacity,
        title: '大人',
        note: '年齡 20+',
        disabled: guests[RoomPeopleType.ADULT] === 0,
      },
      {
        name: RoomPeopleType.CHILD,
        min: 0,
        max:
          restAllocationGuests[RoomPeopleType.CHILD] === 0
            ? roomAllocation[i][RoomPeopleType.CHILD]
            : item.capacity,
        title: '小孩',
        disabled: guests[RoomPeopleType.CHILD] === 0 || isNoAdult,
      },
    ]);
  }, [guests, isNoAdult, restAllocationGuests, roomAllocation, rooms]);

  const restPeopleNoticeText = useMemo<string>(
    () => getGuestsText(restAllocationGuests),
    [restAllocationGuests]
  );

  const totalGuestsText = useMemo<string>(
    () => getGuestsText(guests),
    [guests]
  );

  const handleOnChange = useCallback(
    (guests: Guests, index: number) => {
      const values = [...roomAllocation];
      values[index] = getAllocationAndPrice(guests, rooms[index]);

      setRoomAllocation(values);
      onChange && onChange(values);
    },
    [onChange, roomAllocation, rooms]
  );

  return (
    <Wrapper>
      <Title>
        住客人數：{totalGuestsText} / {rooms.length}房
      </Title>
      <Cost>目前金額：{currentCost} 元</Cost>
      {restPeopleNoticeText && (
        <Notice>尚未分配人數：{restPeopleNoticeText}</Notice>
      )}
      {isNoAdult && <Notice>Must contain at least 1 adult.</Notice>}
      {roomAllocation.map(({ price, ...guests }, i) => (
        <RoomAllocationItem
          peopleCount={guests}
          capacity={rooms[i].capacity}
          options={roomsOptions[i]}
          onChange={(result) => handleOnChange(result, i)}
          key={`room${i}`}
        ></RoomAllocationItem>
      ))}
    </Wrapper>
  );
};

export default RoomAllocation;
