'use client';

import React from 'react';
import styled from 'styled-components';
import Button from '@/components/Button/Button';
import { useCallback, useRef, useState } from 'react';
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
  const hiddenInputRef = useRef<HTMLInputElement | null>(null);

  const handleInputEvents = useCallback(() => {
    const event = new Event('input', { bubbles: true });

    setTimeout(() => {
      hiddenInputRef?.current?.dispatchEvent(event);
    }, 0);
  }, []);

  const handleIncrease = useCallback(() => {
    setInputValue((prev) => {
      const sum = prev + step;
      return sum > max ? max : sum;
    });
    handleInputEvents();
  }, [handleInputEvents, step, max]);

  const handleDecrease = useCallback(() => {
    setInputValue((prev) => {
      const sum = prev - step;
      return sum < min ? min : sum;
    });
    handleInputEvents();
  }, [handleInputEvents, step, min]);

  const handleInputChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setInputValue(Number(event.target.value));
      onChange && onChange(event);
    },
    [onChange]
  );

  const handleClickButtonChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
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
        data-testid="decrease-button"
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
        data-testid="custom-input"
      />

      {/* For clicking button to trigger InputEvent */}
      <input
        type="hidden"
        name={name}
        value={inputValue}
        onInput={handleClickButtonChange}
        ref={hiddenInputRef}
      ></input>

      <Button
        onClick={handleIncrease}
        onHold={handleIncrease}
        onBlur={onBlur}
        disabled={disabled || inputValue >= max}
        name={name}
        data-testid="increase-button"
      >
        {' '}
        +{' '}
      </Button>
    </Wrapper>
  );
};

export default CustomInputNumber;
