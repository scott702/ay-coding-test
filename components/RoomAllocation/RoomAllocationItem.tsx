'use client';

import { ChangeEvent, useMemo } from 'react';
import styled from 'styled-components';

import CustomInputNumber from '@/components/CustomInputNumber/CustomInputNumber';
import { RoomPeopleType } from '@/components/RoomAllocation/RoomAllocation.enums';
import { Guests } from '@/components/RoomAllocation/RoomAllocation.types';
import { COLOR_GRAY_2 } from '@/constants/colors';

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  flex-flow: column;
  gap: 6px;

  border-bottom: 1px solid ${COLOR_GRAY_2};
  padding: 15px 0;
  &: last-child {
    border-bottom: 0;
  }
`;

const Title = styled.span`
  font-size: 20px;
  font-weight: bold;
`;

const Option = styled.div`
  display: flex;
  flex-flow: row;
  justify-content: space-between;
`;

const TitleSection = styled.div`
  display: flex;
  flex-flow: column;
  justify-content: center;
`;

const OptionTitle = styled.span`
  font-size: 16px;
  font-weight: bold;
`;

const OptionNote = styled.span`
  font-size: 12px;
  color: lightgrey;
`;

interface RoomAllocationItemProps {
  peopleCount: Guests;
  options: {
    min: number;
    max: number;
    name: RoomPeopleType;
    title: string;
    note?: string;
    disabled: boolean;
  }[];

  capacity: number;

  onChange: (result: Guests) => void;
}

const RoomAllocationItem = ({
  peopleCount,
  options,
  onChange,
}: RoomAllocationItemProps) => {
  const totalPeopleCount = useMemo<number>(
    () =>
      Object.values(peopleCount).reduce(
        (acc: number, value: number) => acc + value
      ),
    [peopleCount]
  );

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event?.target;

    onChange({ ...peopleCount, [name]: Number(value) });
  };

  return (
    <Wrapper>
      <Title>房間：{totalPeopleCount} 人</Title>
      {options.map((item) => (
        <Option key={item.name}>
          <TitleSection>
            <OptionTitle>{item.title}</OptionTitle>
            {item.note && <OptionNote>{item.note}</OptionNote>}
          </TitleSection>
          <CustomInputNumber
            min={item.min}
            max={item.max}
            step={1}
            value={peopleCount[item.name]}
            name={item.name}
            disabled={item.disabled}
            onChange={handleChange}
          ></CustomInputNumber>
        </Option>
      ))}
    </Wrapper>
  );
};

export default RoomAllocationItem;
