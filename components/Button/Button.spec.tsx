import React from 'react';
import { render, fireEvent } from '@testing-library/react';

import Button from '@/components/Button/Button';

describe('test Button', () => {
  it('keep trigger onHold event when hold on button for over 1 second', async () => {
    const fakeOnHold = jest.fn();

    const wrapper = render(<Button onHold={fakeOnHold}>button</Button>);
    const button = wrapper.getByText('button');

    await fireEvent.mouseDown(button);

    // wait for 2 seconds
    await new Promise((r) => setTimeout(r, 2000));

    await fireEvent.mouseUp(button);

    expect(fakeOnHold).toHaveBeenCalled();
  });

  it('not trigger onHold event when hold on button for less than 1 second', async () => {
    const fakeOnHold = jest.fn();

    const wrapper = render(<Button onHold={fakeOnHold}>button</Button>);
    const button = wrapper.getByText('button');

    await fireEvent.mouseDown(button);

    // wait for 0.5 seconds
    await new Promise((r) => setTimeout(r, 500));

    await fireEvent.mouseUp(button);

    expect(fakeOnHold).not.toHaveBeenCalled();
  });

  it('not trigger onHold event when hold on button by using right click', async () => {
    const fakeOnHold = jest.fn();

    const wrapper = render(<Button onHold={fakeOnHold}>button</Button>);
    const button = wrapper.getByText('button');

    await fireEvent.mouseDown(button, { button: 2 });

    // wait for 1.5 seconds
    await new Promise((r) => setTimeout(r, 1500));

    await fireEvent.mouseUp(button, { button: 2 });

    expect(fakeOnHold).not.toHaveBeenCalled();
  });
});
