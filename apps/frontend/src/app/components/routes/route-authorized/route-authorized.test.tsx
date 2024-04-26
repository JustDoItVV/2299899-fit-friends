import '@testing-library/jest-dom';

import MockAdapter from 'axios-mock-adapter';

import { ApiRoute } from '@2299899-fit-friends/consts';
import { makeFakeState, makeFakeUser, State } from '@2299899-fit-friends/frontend-core';
import { AuthStatus, User, UserRole } from '@2299899-fit-friends/types';
import { act, render, screen } from '@testing-library/react';

import { withHistory, withStore } from '../../../test-mocks/test-mocks-components';
import RouteAuthorized from './route-authorized';

describe('Component RouteAuthorized', () => {
  let mockState: State;
  let mockAxiosAdapter: MockAdapter;
  let withStoreComponent: JSX.Element;
  let mockUser: User;

  const expectedText = 'expectedText';
  const component = <span>{expectedText}</span>;

  beforeEach(() => {
    mockUser = makeFakeUser();
    mockState = makeFakeState();
    const withStoreResult = withStore(
      withHistory(<RouteAuthorized children={component} />),
      mockState,
    );
    withStoreComponent = withStoreResult.withStoreComponent;
    mockAxiosAdapter = withStoreResult.mockAxiosAdapter;

    mockState.APP.authStatus = AuthStatus.Auth;
    mockState.APP.currentUser = { ...mockUser };

    mockAxiosAdapter.onPost(`${ApiRoute.User}${ApiRoute.Check}`).reply(200, mockUser);
    mockAxiosAdapter.onGet(new RegExp(`${ApiRoute.User}/(.*)`)).reply(200, mockUser);
  });

  test('should render correctly when authorized', async () => {
    await act(async () => render(withStoreComponent));

    expect(screen.queryByText(expectedText)).toBeInTheDocument();
  });

  test('should not render when not authorized', async () => {
    mockState.APP.authStatus = AuthStatus.NoAuth;
    mockState.APP.currentUser = { ...mockUser, role: UserRole.Trainer };

    await act(async () => render(withStoreComponent));

    expect(screen.queryByText(expectedText)).not.toBeInTheDocument();
  });

  test('should render Loading when status unknown', async () => {
    mockState.APP.authStatus = AuthStatus.Unknown;

    await act(async () => render(withStoreComponent));

    expect(screen.queryByText(expectedText)).not.toBeInTheDocument();
    expect(screen.queryByTestId('loading-spinner')).toBeInTheDocument();
  });
});
