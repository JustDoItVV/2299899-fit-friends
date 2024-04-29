import '@testing-library/jest-dom';

import {
    extractActionsTypes, makeFakeState, redirectToRoute, State
} from '@2299899-fit-friends/frontend-core';
import { AuthStatus } from '@2299899-fit-friends/types';
import { MockStore } from '@jedmao/redux-mock-store';
import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { withHistory, withStore } from '../../test-mocks/test-mocks-components';
import IntroPage from './intro.page';

describe('Component IntroPage', () => {
  let mockState: State;
  let withStoreComponent: JSX.Element;
  let mockStore: MockStore;

  beforeEach(() => {
    mockState = makeFakeState();
    const withStoreResult = withStore(
      withHistory(<IntroPage />),
      mockState,
    );
    withStoreComponent = withStoreResult.withStoreComponent;
    mockStore = withStoreResult.mockStore;

    mockState.APP.authStatus = AuthStatus.NoAuth;
  });

  test('should render correctly with not authorized', async () => {
    await act(async () => render(withStoreComponent));

    expect(screen.queryByText('Регистрация')).toBeInTheDocument();
    expect(screen.queryByText('Есть аккаунт?')).toBeInTheDocument();
    expect(screen.queryByText('Вход')).toBeInTheDocument();
  });

  test('should render correctly with authorized', async () => {
    mockState.APP.authStatus = AuthStatus.Auth;

    await act(async () => render(withStoreComponent));

    expect(screen.queryByText('Регистрация')).toBeInTheDocument();
    expect(screen.queryByText('Есть аккаунт?')).toBeInTheDocument();
    expect(screen.queryByText('Вход')).toBeInTheDocument();
  });

  test('should dispatch "redirectToRoute" when registration button clicked', async () => {
    const user = userEvent.setup();

    await act(async () => render(withStoreComponent));
    await user.click(screen.getByText('Регистрация'));
    const actions = extractActionsTypes(mockStore.getActions());

    expect(actions).toEqual([
      redirectToRoute.type,
    ]);
  });
});
