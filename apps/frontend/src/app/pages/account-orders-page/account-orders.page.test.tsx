import '@testing-library/jest-dom';

import { makeFakeState } from '@2299899-fit-friends/frontend-core';
import { act, render, screen } from '@testing-library/react';

import { withHistory, withStore } from '../../test-mocks/test-mocks-components';
import AccountOrdersPage from './account-orders.page';

jest.mock('../../components/header/header', () => ({
  ...jest.requireActual('../../components/header/header'),
  __esModule: true,
  default: jest.fn(() => <div>Header</div>),
}));
jest.mock('../../components/expanding-catalog/expanding-catalog', () => ({
  ...jest.requireActual('../../components/expanding-catalog/expanding-catalog'),
  __esModule: true,
  default: jest.fn(() => <div>ExpandingCatalog</div>),
}));

describe('Component AccountOrdersPage', () => {
  test('should render correctly', async () => {
    const mockState = makeFakeState();
    const { withStoreComponent } = withStore(
      withHistory(<AccountOrdersPage />),
      mockState,
    );

    await act(async () => render(withStoreComponent));

    expect(screen.queryByText('Header')).toBeInTheDocument();
    expect(screen.queryByText('Назад')).toBeInTheDocument();
    expect(screen.queryByText('Мои заказы')).toBeInTheDocument();
    expect(screen.queryByText('Сортировать по:')).toBeInTheDocument();
    expect(screen.queryByText('Сумме')).toBeInTheDocument();
    expect(screen.queryByText('Количеству')).toBeInTheDocument();
    expect(screen.queryByText('ExpandingCatalog')).toBeInTheDocument();
  });
});
