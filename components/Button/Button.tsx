'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

export const ButtonBase = styled.button`
  font-size: 16px;
  width: 48px;
  height: 48px;
  border: 1px solid rgb(30, 159, 210);
  color: rgb(30, 159, 210);
  background-color: transparent;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: rgb(240, 253, 255);
  }

  &:active {
    background-color: rgb(199, 247, 255);
  }

  &:disabled {
    cursor: not-allowed;
    border-color: rgba(30, 159, 210, 0.5);
    &:hover {
      background-color: transparent;
    }
  }
`;

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  onHold?: () => void;
};

const Button = ({ onHold, ...props }: ButtonProps): JSX.Element => {
  const [isHolding, setIsHolding] = useState<boolean>(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const { disabled } = props;

  const handleMouseLeftClick = useCallback(
    (
      event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
      callback: () => void
    ) => {
      if (event.button !== 0) {
        return;
      }

      callback();
    },
    []
  );

  useEffect(() => {
    if (!disabled) {
      return;
    }
    setIsHolding(false);
  }, [disabled]);

  // handle hold on button situation
  useEffect(() => {
    if (!isHolding) {
      intervalRef.current && clearInterval(intervalRef.current);
      timeoutRef.current && clearTimeout(timeoutRef.current);
      intervalRef.current = null;
      timeoutRef.current = null;
      return;
    }

    timeoutRef.current = setTimeout(() => {
      intervalRef.current = setInterval(() => {
        onHold && onHold();
      }, 100);
    }, 1000);
  }, [isHolding, onHold]);

  return (
    <ButtonBase
      {...props}
      onMouseDown={(event) =>
        handleMouseLeftClick(event, () => setIsHolding(true))
      }
      onMouseUp={(event) =>
        handleMouseLeftClick(event, () => setIsHolding(false))
      }
    />
  );
};

export default Button;
