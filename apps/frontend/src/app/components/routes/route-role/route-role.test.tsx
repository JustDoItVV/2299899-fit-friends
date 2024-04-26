import '@testing-library/jest-dom';

import { makeFakeState, makeFakeUser, State } from '@2299899-fit-friends/frontend-core';
import { AuthStatus, User, UserRole } from '@2299899-fit-friends/types';
import { act, render, screen } from '@testing-library/react';

import { withHistory, withStore } from '../../../test-mocks/test-mocks-components';
import RouteRole from './route-role';

describe('Component RouteRole', () => {
  let mockState: State;
  let withStoreComponent: JSX.Element;
  let mockUser: User;

  const expectedText = 'expectedText';
  const component = <span>{expectedText}</span>;

  beforeEach(() => {
    mockUser = makeFakeUser();
    mockState = makeFakeState();
    const withStoreResult = withStore(
      withHistory(<RouteRole role={UserRole.Trainer} children={component} />),
      mockState,
    );
    withStoreComponent = withStoreResult.withStoreComponent;

    mockState.APP.authStatus = AuthStatus.Auth;
  });

  test('should render correctly when role matches', async () => {
    mockState.APP.currentUser = { ...mockUser, role: UserRole.Trainer };

    await act(async () => render(withStoreComponent));

    expect(screen.queryByText(expectedText)).toBeInTheDocument();
  });

  test('should not render when role does not match', async () => {
    mockState.APP.currentUser = { ...mockUser, role: UserRole.User };

    await act(async () => render(withStoreComponent));

    expect(screen.queryByText(expectedText)).not.toBeInTheDocument();
  });

  test('should render Loading when current user pending', async () => {
    mockState.APP.currentUser = null;

    await act(async () => render(withStoreComponent));

    expect(screen.queryByText(expectedText)).not.toBeInTheDocument();
    expect(screen.queryByTestId('loading-spinner')).toBeInTheDocument();
  });
});
