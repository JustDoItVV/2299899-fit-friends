import '@testing-library/jest-dom';

import { makeFakeState, makeFakeUser, State } from '@2299899-fit-friends/frontend-core';
import { AuthStatus, User, UserRole } from '@2299899-fit-friends/types';
import { act, render, screen } from '@testing-library/react';

import { withHistory, withStore } from '../../../test-mocks/test-mocks-components';
import RouteAnonymous from './route-anonymous';

jest.mock('../../loading/loading', () => ({
  ...jest.requireActual('../../loading/loading'),
  __esModule: true,
  default: jest.fn(() => <div>Loading</div>),
}));
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  Navigate: jest.fn(() => <div>Navigate</div>),
}));

describe('Component RouteAnonymous', () => {
  let mockState: State;
  let withStoreComponent: JSX.Element;
  let mockUser: User;

  const expectedText = 'expectedText';
  const component = <span>{expectedText}</span>;

  beforeEach(() => {
    mockUser = makeFakeUser();
    mockState = makeFakeState();
    const withStoreResult = withStore(
      withHistory(<RouteAnonymous children={component} />),
      mockState,
    );
    withStoreComponent = withStoreResult.withStoreComponent;

    mockState.APP.authStatus = AuthStatus.NoAuth;
    mockState.APP.currentUser = { ...mockUser };
  });

  test('should render correctly when not authorized', async () => {
    await act(async () => render(withStoreComponent));

    expect(screen.queryByText(expectedText)).toBeInTheDocument();
  });

  test('should not render when authorized and role Trainer', async () => {
    mockState.APP.authStatus = AuthStatus.Auth;
    mockState.APP.currentUser = { ...mockUser, role: UserRole.Trainer };

    await act(async () => render(withStoreComponent));

    expect(screen.queryByText(expectedText)).not.toBeInTheDocument();
    expect(screen.queryByText('Navigate')).toBeInTheDocument();
  });

  test('should not render when authorized and role User', async () => {
    mockState.APP.authStatus = AuthStatus.Auth;
    mockState.APP.currentUser = { ...mockUser, role: UserRole.User };

    await act(async () => render(withStoreComponent));

    expect(screen.queryByText(expectedText)).not.toBeInTheDocument();
    expect(screen.queryByText('Navigate')).toBeInTheDocument();
  });

  test('should render Loading when status unknown', async () => {
    mockState.APP.authStatus = AuthStatus.Unknown;

    await act(async () => render(withStoreComponent));

    expect(screen.queryByText(expectedText)).not.toBeInTheDocument();
    expect(screen.queryByText('Loading')).toBeInTheDocument();
  });
});
