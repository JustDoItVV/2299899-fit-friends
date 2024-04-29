import '@testing-library/jest-dom';

import { makeFakeState, State } from '@2299899-fit-friends/frontend-core';
import { act, fireEvent, render, screen } from '@testing-library/react';

import { withHistory, withStore } from '../../test-mocks/test-mocks-components';
import MultiRangeSlider from './multi-range-slider';

describe('Component MultiRangeSlider', () => {
  let mockState: State;
  let withStoreComponent: JSX.Element;
  const mockOnChangeMin = jest.fn();
  const mockOnChangeMax = jest.fn();
  const min = 1;
  const max = 10;

  beforeEach(() => {
    mockState = makeFakeState();
    const withStoreResult = withStore(
      withHistory(<MultiRangeSlider
        min={min}
        max={max}
        onChangeMin={mockOnChangeMin}
        onChangeMax={mockOnChangeMax}
      />),
      mockState,
    );
    withStoreComponent = withStoreResult.withStoreComponent;
  });

  test('should render correctly', async () => {
    await act(async () => render(withStoreComponent));

    expect(screen.queryByTestId('multi-range-slider')).toBeInTheDocument();
    expect(screen.getByTestId('multi-range-slider').childNodes.length).toBe(3);
    expect(screen.queryByText(min)).toBeInTheDocument();
    expect(screen.queryByText(max)).toBeInTheDocument();
  });

  test('should call callbacks onChange', async () => {
    await act(async () => render(withStoreComponent));
    const multiRangeSliderChildren = screen.getByTestId('multi-range-slider').children;
    fireEvent.change(multiRangeSliderChildren[0], { target: { value: 5 } });
    fireEvent.change(multiRangeSliderChildren[1], { target: { value: 8 } });

    expect(multiRangeSliderChildren[0]).toHaveValue('5');
    expect(multiRangeSliderChildren[1]).toHaveValue('8');
    expect(mockOnChangeMin).toHaveBeenCalled();
    expect(mockOnChangeMax).toHaveBeenCalled();
  });
});
