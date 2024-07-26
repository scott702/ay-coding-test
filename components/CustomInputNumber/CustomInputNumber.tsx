'use client';

import styled from 'styled-components';
import Button from '@/components/Button/Button';
import { useCallback, useState } from 'react';
import { COLOR_GRAY_1, COLOR_GRAY_2 } from '@/constants/colors';

const Wrapper = styled.div`
  display: flex;
  flex-flow: row;
  gap: 8px;
`;

const Input = styled.input`
  font-size: 16px;
  text-align: center;
  width: 48px;
  height: 48px;
  border: 1px solid ${COLOR_GRAY_2};
  border-radius: 4px;
  color: ${COLOR_GRAY_1};

  &::-webkit-inner-spin-button {
    display: none;
  }

  &:disabled {
    cursor: not-allowed;
  }
`;

interface CustomInputNumberProps {
  min?: number;
  max?: number;
  step?: number;
  name?: string;
  value: number;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (
    event: React.FocusEvent<HTMLInputElement | HTMLButtonElement>
  ) => void;
  disabled?: boolean;
}

const CustomInputNumber = ({
  min = 0,
  max = 100,
  step = 1,
  name = '',
  value,
  onChange,
  onBlur,
  disabled = false,
}: CustomInputNumberProps): JSX.Element => {
  const [inputValue, setInputValue] = useState<number>(value);

  const handleIncrease = useCallback(() => {
    setInputValue((prev) => {
      const sum = prev + step;
      return sum > max ? max : sum;
    });
  }, [step, max]);

  const handleDecrease = useCallback(() => {
    setInputValue((prev) => {
      const sum = prev - step;
      return sum < min ? min : sum;
    });
  }, [step, min]);

  const handleInputChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setInputValue(Number(event.target.value));
      onChange && onChange(event);
    },
    [onChange]
  );

  return (
    <Wrapper>
      <Button
        onClick={handleDecrease}
        onHold={handleDecrease}
        onBlur={onBlur}
        disabled={disabled || inputValue <= min}
        name={name}
      >
        {' '}
        -{' '}
      </Button>
      <Input
        type="number"
        min={min}
        max={max}
        name={name}
        step={step}
        value={inputValue}
        onChange={handleInputChange}
        onBlur={onBlur}
        disabled={disabled}
      />

      <Button
        onClick={handleIncrease}
        onHold={handleIncrease}
        onBlur={onBlur}
        disabled={disabled || inputValue >= max}
        name={name}
      >
        {' '}
        +{' '}
      </Button>
    </Wrapper>
  );
};

export default CustomInputNumber;
