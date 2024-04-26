import '@testing-library/jest-dom';

import MockAdapter from 'axios-mock-adapter';

import { ApiRoute } from '@2299899-fit-friends/consts';
import {
    extractActionsTypes, loginUser, makeFakeState, makeFakeUser, redirectToRoute, setResponseError,
    State
} from '@2299899-fit-friends/frontend-core';
import { AuthStatus } from '@2299899-fit-friends/types';
import { MockStore } from '@jedmao/redux-mock-store';
import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { withHistory, withStore } from '../../test-mocks/test-mocks-components';
import LoginPage from './login.page';

describe('Component LoginPage', () => {
  let mockState: State;
  let withStoreComponent: JSX.Element;
  let mockStore: MockStore;
  let mockAxiosAdapter: MockAdapter;

  beforeEach(() => {
    mockState = makeFakeState();
    const withStoreResult = withStore(
      withHistory(<LoginPage />),
      mockState,
    );
    withStoreComponent = withStoreResult.withStoreComponent;
    mockStore = withStoreResult.mockStore;
    mockAxiosAdapter = withStoreResult.mockAxiosAdapter;

    mockState.APP.authStatus = AuthStatus.NoAuth;
  });

  test('should render correctly', async () => {
    await act(async () => render(withStoreComponent));

    expect(screen.queryByText('Вход')).toBeInTheDocument();
    expect(screen.queryByText('E-mail')).toBeInTheDocument();
    expect(screen.queryByText('Пароль')).toBeInTheDocument();
    expect(screen.queryByText('Продолжить')).toBeInTheDocument();
  });

  test('should dispatch "loginUser.pending", "loginUser.fulfilled" when submit button clicked', async () => {
    const user = userEvent.setup();
    const user1 = makeFakeUser();
    const mockData = { ...user1, birthdate: user1.birthdate?.toDateString()};
    mockAxiosAdapter.onPost(`${ApiRoute.User}${ApiRoute.Login}`).reply(201, mockData);

    await act(async () => render(withStoreComponent));
    await user.click(screen.getByText('Продолжить'));
    const actions = extractActionsTypes(mockStore.getActions());

    expect(actions).toEqual([
      loginUser.pending.type,
      setResponseError.type,
      redirectToRoute.type,
      loginUser.fulfilled.type,
    ]);
  });
});
