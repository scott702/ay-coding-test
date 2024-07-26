'use client';
import { useCallback, useState } from 'react';
import RoomAllocation from '@/components/RoomAllocation/RoomAllocation';
import styled from 'styled-components';
import { Allocation } from '@/components/RoomAllocation/RoomAllocation.types';
import { ButtonBase as Button } from '@/components/Button/Button';
import { case1, case2, case3 } from '@/constants/data';

const Wrapper = styled.div`
  width: 560px;
  min-height: 100px;
  border: 1px solid gray;
  padding: 10px;
`;

const ButtonWrapper = styled.div`
  display: flex;
  flex-flow: row;
  gap: 4px;
`;

export const App = () => {
  const [data, setData] = useState(case1);
  const onChange = useCallback((result: Allocation[]) => {
    console.log('[test] onChange result: ', result);
  }, []);

  const handleChangeData = useCallback((dataset) => {
    setData(dataset);
  }, []);

  return (
    <>
      <ButtonWrapper>
        <Button width={100} onClick={() => handleChangeData(case1)}>
          {' '}
          case1{' '}
        </Button>
        <Button width={100} onClick={() => handleChangeData(case2)}>
          {' '}
          case2{' '}
        </Button>
        <Button width={100} onClick={() => handleChangeData(case3)}>
          {' '}
          case3{' '}
        </Button>
      </ButtonWrapper>
      <Wrapper>
        <RoomAllocation
          guests={data.guests}
          rooms={data.rooms}
          onChange={onChange}
          key={data.id}
        ></RoomAllocation>
      </Wrapper>
    </>
  );
};

export default App;
