import '@testing-library/jest-dom';

import MockAdapter from 'axios-mock-adapter';

import { ApiRoute } from '@2299899-fit-friends/consts';
import { makeFakeState, makeFakeUser, State } from '@2299899-fit-friends/frontend-core';
import { AuthStatus, UserRole } from '@2299899-fit-friends/types';
import { faker } from '@faker-js/faker';
import { act, render, screen } from '@testing-library/react';

import { withHistory, withStore } from '../../test-mocks/test-mocks-components';
import UserCardPage from './user-card.page';

describe('Component UserCardPage', () => {
  let mockState: State;
  let mockAxiosAdapter: MockAdapter;
  let withStoreComponent: JSX.Element;

  beforeEach(() => {
    mockState = makeFakeState();
    const withStoreResult = withStore(
      withHistory(<UserCardPage />),
      mockState,
    );
    withStoreComponent = withStoreResult.withStoreComponent;
    mockAxiosAdapter = withStoreResult.mockAxiosAdapter;

    mockState.APP.authStatus = AuthStatus.Auth;
    mockState.APP.currentUser = { ...makeFakeUser(), role: UserRole.User };
  });

  test('should render correctly', async () => {
    mockAxiosAdapter.onGet(`${ApiRoute.User}/${faker.string.uuid()}`)
      .reply(200, makeFakeUser());

    await act(async () => render(withStoreComponent));

    expect(screen.queryByText('Карточка пользователя')).toBeInTheDocument();
  });

  test('should render with NotFoundPage when user not found', async () => {
    mockAxiosAdapter.onGet(`${ApiRoute.User}/${faker.string.uuid()}`)
      .reply(404);
    mockState.USER.user = null;

    await act(async () => render(withStoreComponent));

    expect(screen.queryByText('404')).toBeInTheDocument();
    expect(screen.queryByText('Вернуться на главную')).toBeInTheDocument();
  });

  test('should render with Loading component when fetch pending', async () => {
    mockState.USER.isLoading = true;

    await act(async () => render(withStoreComponent));

    expect(screen.queryByTestId('loading-spinner')).toBeInTheDocument();
  });
});
