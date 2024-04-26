import '@testing-library/jest-dom';

import MockAdapter from 'axios-mock-adapter';

import { ApiRoute } from '@2299899-fit-friends/consts';
import {
    makeFakeOrder, makeFakeState, makeFakeTraining, makeFakeUser, State
} from '@2299899-fit-friends/frontend-core';
import { AuthStatus, UserRole } from '@2299899-fit-friends/types';
import { act, render, screen } from '@testing-library/react';

import { withHistory, withStore } from '../../test-mocks/test-mocks-components';
import AccountPurchasesPage from './account-purchases.page';

describe('Component AccountPurchasesPage', () => {
  let mockState: State;
  let mockAxiosAdapter: MockAdapter;
  let withStoreComponent: JSX.Element;

  beforeEach(() => {
    mockState = makeFakeState();
    const withStoreResult = withStore(
      withHistory(<AccountPurchasesPage />),
      mockState,
    );
    withStoreComponent = withStoreResult.withStoreComponent;
    mockAxiosAdapter = withStoreResult.mockAxiosAdapter;

    mockState.APP.authStatus = AuthStatus.Auth;
    mockState.APP.currentUser = { ...makeFakeUser(), role: UserRole.User };

    const mockOrder = makeFakeOrder();
    mockAxiosAdapter.onGet(new RegExp(`${ApiRoute.Account}${ApiRoute.User}${ApiRoute.Balance}?(.*)`, 'g'))
      .reply(200, { entities: [mockOrder], totalPages: 1, totalItems: 1, itemsPerPage: 50, currentPage: 1 });
    mockAxiosAdapter.onGet(`${ApiRoute.Training}/${mockOrder.trainingId}`).reply(200, makeFakeTraining());
  });

  test('should render correctly', async () => {
    await act(async () => render(withStoreComponent));

    expect(screen.queryByText('Назад')).toBeInTheDocument();
    expect(screen.queryByText('Мои покупки')).toBeInTheDocument();
    expect(screen.queryByText('Только активные')).toBeInTheDocument();
  });
});
