import '@testing-library/jest-dom';

import { makeFakeState } from '@2299899-fit-friends/frontend-core';
import { act, render, screen } from '@testing-library/react';

import { withHistory, withStore } from '../../test-mocks/test-mocks-components';
import MainPage from './main.page';

jest.mock('../../components/header/header', () => ({
  ...jest.requireActual('../../components/header/header'),
  __esModule: true,
  default: jest.fn(() => <div>Header</div>),
}));
jest.mock('../../components/slider-block/slider-block', () => ({
  ...jest.requireActual('../../components/slider-block/slider-block'),
  __esModule: true,
  default: jest.fn(() => <div>SliderBlock</div>),
}));

describe('Component MainPage', () => {
  test('should render correctly', async () => {
    const mockState = makeFakeState();
    const { withStoreComponent } = withStore(
      withHistory(<MainPage />),
      mockState,
    );

    await act(async () => render(withStoreComponent));

    expect(screen.queryByText('Header')).toBeInTheDocument();
    expect(screen.queryAllByText('SliderBlock').length).toBe(4);
  });
});
