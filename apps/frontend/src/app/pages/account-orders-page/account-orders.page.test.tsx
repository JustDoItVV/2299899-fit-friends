import '@testing-library/jest-dom';

import MockAdapter from 'axios-mock-adapter';

import { ApiRoute } from '@2299899-fit-friends/consts';
import {
    makeFakeOrder, makeFakeState, makeFakeUser, State
} from '@2299899-fit-friends/frontend-core';
import { AuthStatus, UserRole } from '@2299899-fit-friends/types';
import { act, render, screen } from '@testing-library/react';

import { withHistory, withStore } from '../../test-mocks/test-mocks-components';
import AccountOrdersPage from './account-orders.page';

describe('Component AccountOrdersPage', () => {
  let mockState: State;
  let mockAxiosAdapter: MockAdapter;
  let withStoreComponent: JSX.Element;

  beforeEach(() => {
    mockState = makeFakeState();
    const withStoreResult = withStore(
      withHistory(<AccountOrdersPage />),
      mockState,
    );
    withStoreComponent = withStoreResult.withStoreComponent;
    mockAxiosAdapter = withStoreResult.mockAxiosAdapter;

    mockState.APP.authStatus = AuthStatus.Auth;
    mockState.APP.currentUser = { ...makeFakeUser(), role: UserRole.Trainer };

    mockAxiosAdapter.onGet(new RegExp(`${ApiRoute.Account}${ApiRoute.Trainer}${ApiRoute.Orders}?(.*)`, 'g'))
      .reply(200, { entities: [makeFakeOrder()], totalPages: 1, totalItems: 1, itemsPerPage: 50, currentPage: 1 });
  });

  test('should render correctly', async () => {
    await act(async () => render(withStoreComponent));

    expect(screen.queryByText('Назад')).toBeInTheDocument();
    expect(screen.queryByText('Мои заказы')).toBeInTheDocument();
    expect(screen.queryByText('Сортировать по:')).toBeInTheDocument();
    expect(screen.queryByText('Сумме')).toBeInTheDocument();
    expect(screen.queryByText('Количеству')).toBeInTheDocument();
  });
});
