import '@testing-library/jest-dom';

import MockAdapter from 'axios-mock-adapter';

import { ApiRoute } from '@2299899-fit-friends/consts';
import {
    makeFakeRequest, makeFakeState, makeFakeUser, State
} from '@2299899-fit-friends/frontend-core';
import { AuthStatus } from '@2299899-fit-friends/types';
import { act, render, screen } from '@testing-library/react';

import { withHistory, withStore } from '../../test-mocks/test-mocks-components';
import AccountFriendsPage from './account-friends.page';

describe('Component AccountFriendsPage', () => {
  let mockState: State;
  let mockAxiosAdapter: MockAdapter;
  let withStoreComponent: JSX.Element;

  beforeEach(() => {
    mockState = makeFakeState();
    const withStoreResult = withStore(
      withHistory(<AccountFriendsPage />),
      mockState,
    );
    withStoreComponent = withStoreResult.withStoreComponent;
    mockAxiosAdapter = withStoreResult.mockAxiosAdapter;

    mockState.APP.authStatus = AuthStatus.Auth;
    mockState.APP.currentUser = { ...makeFakeUser() };

    mockAxiosAdapter.onGet(new RegExp(`${ApiRoute.Account}${ApiRoute.Trainer}${ApiRoute.Friends}?(.*)`, 'g'))
      .reply(200, { entities: [makeFakeUser()], totalPages: 1, totalItems: 1, itemsPerPage: 50, currentPage: 1 });
    mockAxiosAdapter.onGet(new RegExp(`${ApiRoute.Account}${ApiRoute.User}${ApiRoute.Friends}?(.*)`, 'g'))
      .reply(200, { entities: [makeFakeUser()], totalPages: 1, totalItems: 1, itemsPerPage: 50, currentPage: 1 });
    mockAxiosAdapter.onGet(new RegExp(`${ApiRoute.TrainingRequest}?(.*)`, 'g'))
      .reply(200, { entities: [makeFakeRequest()], totalPages: 1, totalItems: 1, itemsPerPage: 50, currentPage: 1 });
  });

  test('should render correctly', async () => {
    await act(async () => render(withStoreComponent));

    expect(screen.queryByText('Назад')).toBeInTheDocument();
    expect(screen.queryByText('Мои друзья')).toBeInTheDocument();
  });
});
