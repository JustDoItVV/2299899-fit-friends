import '@testing-library/jest-dom';

import { makeFakeState } from '@2299899-fit-friends/frontend-core';
import { act, render, screen } from '@testing-library/react';

import { withHistory, withStore } from '../../test-mocks/test-mocks-components';
import AccountPurchasesPage from './account-purchases.page';

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

describe('Component AccountPurchasesPage', () => {
  test('should render correctly', async () => {
    const mockState = makeFakeState();
    const { withStoreComponent } = withStore(
      withHistory(<AccountPurchasesPage />),
      mockState,
    );

    await act(async () => render(withStoreComponent));

    expect(screen.queryByText('Header')).toBeInTheDocument();
    expect(screen.queryByText('Назад')).toBeInTheDocument();
    expect(screen.queryByText('Мои покупки')).toBeInTheDocument();
    expect(screen.queryByText('Только активные')).toBeInTheDocument();
    expect(screen.queryByText('ExpandingCatalog')).toBeInTheDocument();
  });
});
