import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CustomInputNumber from '@/components/CustomInputNumber/CustomInputNumber';

describe('test CustomInputNumber', () => {
  it('click increase button to increase input value', () => {
    const wrapper = render(<CustomInputNumber value={2}></CustomInputNumber>);
    const increaseButton = wrapper.getByTestId('increase-button');
    const input = wrapper.getByTestId('custom-input') as HTMLInputElement;

    fireEvent.click(increaseButton);

    expect(input.value).toEqual('3');
  });

  it('click decrease button to trigger onChange with InputEvent', async () => {
    const INPUT_NAME = 'test';
    const fakeOnChange = jest.fn((event) => {
      expect(event.target.name).toEqual(INPUT_NAME);
      expect(event.target.value).toEqual('1');
      expect(event.nativeEvent.type).toEqual('input');
    });

    const wrapper = render(
      <CustomInputNumber
        value={2}
        name={INPUT_NAME}
        onChange={fakeOnChange}
      ></CustomInputNumber>
    );
    const decreaseButton = wrapper.getByTestId('decrease-button');
    const input = wrapper.getByTestId('custom-input') as HTMLInputElement;

    fireEvent.click(decreaseButton);

    await waitFor(() => {
      expect(input.value).toEqual('1');
      expect(fakeOnChange).toHaveBeenCalled();
    });
  });

  it('press value on input to trigger onChange', async () => {
    const INPUT_NAME = 'test';
    const fakeOnChange = jest.fn();

    const user = userEvent.setup();
    const wrapper = render(
      <CustomInputNumber
        value={2}
        name={INPUT_NAME}
        onChange={fakeOnChange}
      ></CustomInputNumber>
    );
    const input = wrapper.getByTestId('custom-input') as HTMLInputElement;

    user.type(input, '{3}');

    await waitFor(() => {
      expect(input.value).toEqual('23');
      expect(fakeOnChange).toHaveBeenCalled();
    });
  });

  describe('test input validation', () => {
    it('should assign maximum value if value of input is out of maximum', async () => {
      const INPUT_NAME = 'test';
      const MAX_INPUT = 4;
      const MIN_INPUT = 1;

      const user = userEvent.setup();
      const wrapper = render(
        <CustomInputNumber
          value={2}
          max={MAX_INPUT}
          min={MIN_INPUT}
          name={INPUT_NAME}
        ></CustomInputNumber>
      );
      const input = wrapper.getByTestId('custom-input') as HTMLInputElement;

      user.type(input, '{3}');

      await waitFor(() => {
        expect(input.value).toEqual(String(MAX_INPUT));
      });
    });

    it('should assign minimum value if value of input is out of minimum', async () => {
      const INPUT_NAME = 'test';
      const MAX_INPUT = 4;
      const MIN_INPUT = 2;

      const user = userEvent.setup();
      const wrapper = render(
        <CustomInputNumber
          value={2}
          max={MAX_INPUT}
          min={MIN_INPUT}
          name={INPUT_NAME}
        ></CustomInputNumber>
      );
      const input = wrapper.getByTestId('custom-input') as HTMLInputElement;

      user.clear(input);

      await waitFor(() => {
        expect(input.value).toEqual(String(MIN_INPUT));
      });
    });
  });
});
