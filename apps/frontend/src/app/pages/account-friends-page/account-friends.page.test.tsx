import '@testing-library/jest-dom';

import { makeFakeState } from '@2299899-fit-friends/frontend-core';
import { act, render, screen } from '@testing-library/react';

import { withHistory, withStore } from '../../test-mocks/test-mocks-components';
import AccountFriendsPage from './account-friends.page';

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
jest.mock('@2299899-fit-friends/frontend-core', () => ({
  ...jest.requireActual('@2299899-fit-friends/frontend-core'),
  useFetchPagination: () => ({
    items: [],
    nextPage: 1,
    setItems: jest.fn(),
    totalPages: 1,
    fetchNextPage: jest.fn(),
    fetchAll: jest.fn(),
    loading: false,
  }),
}));

describe('Component AccountFriendsPage', () => {
  test('should render correctly', async () => {
    const mockState = makeFakeState();
    const { withStoreComponent } = withStore(
      withHistory(<AccountFriendsPage />),
      mockState,
    );

    await act(async () => render(withStoreComponent));

    expect(screen.queryByText('Header')).toBeInTheDocument();
    expect(screen.queryByText('Назад')).toBeInTheDocument();
    expect(screen.queryByText('Мои друзья')).toBeInTheDocument();
    expect(screen.queryByText('ExpandingCatalog')).toBeInTheDocument();
  });
});
