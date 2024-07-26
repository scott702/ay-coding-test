'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

import {
  COLOR_BLUE_1,
  COLOR_BLUE_2,
  COLOR_BLUE_3,
  COLOR_BLUE_1_OVERLAY_40,
} from '@/constants/colors';

export const ButtonBase = styled.button`
  font-size: 16px;
  width: 48px;
  height: 48px;
  border: 1px solid ${COLOR_BLUE_1};
  color: ${COLOR_BLUE_1};
  background-color: transparent;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: ${COLOR_BLUE_3};
  }

  &:active {
    background-color: ${COLOR_BLUE_2};
  }

  &:disabled {
    cursor: not-allowed;
    border-color: ${COLOR_BLUE_1_OVERLAY_40};
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

    if (intervalRef.current || timeoutRef.current) {
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
