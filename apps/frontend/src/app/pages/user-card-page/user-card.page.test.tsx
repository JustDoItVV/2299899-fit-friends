import '@testing-library/jest-dom';

import MockAdapter from 'axios-mock-adapter';

import { ApiRoute } from '@2299899-fit-friends/consts';
import { makeFakeState, makeFakeUser, State } from '@2299899-fit-friends/frontend-core';
import { AuthStatus, UserRole } from '@2299899-fit-friends/types';
import { act, render, screen } from '@testing-library/react';

import { withHistory, withStore } from '../../test-mocks/test-mocks-components';
import UserCardPage from './user-card.page';

jest.mock('../../components/cards/card-user-info/card-user-info', () => ({
  ...jest.requireActual('../../components/cards/card-user-info/card-user-info'),
  __esModule: true,
  default: jest.fn(() => <div>CardUserInfo</div>),
}));
jest.mock('../../components/header/header', () => ({
  ...jest.requireActual('../../components/header/header'),
  __esModule: true,
  default: jest.fn(() => <div>Header</div>),
}));
jest.mock('../../components/loading/loading', () => ({
  ...jest.requireActual('../../components/loading/loading'),
  __esModule: true,
  default: jest.fn(() => <div>Loading</div>),
}));
jest.mock('../not-found-page/not-found.page', () => ({
  ...jest.requireActual('../not-found-page/not-found.page'),
  __esModule: true,
  default: jest.fn(() => <div>NotFound</div>),
}));

describe('Component UserCardPage', () => {
  let mockState: State;
  let mockAxiosAdapter: MockAdapter;
  let withStoreComponent: JSX.Element;
  const mockUser = makeFakeUser();

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
    mockAxiosAdapter.onGet(`${ApiRoute.User}/${mockUser.id}`).reply(200, mockUser);

    await act(async () => render(withStoreComponent));

    expect(screen.queryByText('Header')).toBeInTheDocument();
    expect(screen.queryByText('CardUserInfo')).toBeInTheDocument();
  });

  test('should render with NotFoundPage when user not found', async () => {
    mockAxiosAdapter.onGet(`${ApiRoute.User}/${mockUser.id}`).reply(404);
    mockState.USER.user = null;

    await act(async () => render(withStoreComponent));

    expect(screen.queryByText('NotFound')).toBeInTheDocument();
  });

  test('should render with Loading component when fetch pending', async () => {
    mockState.USER.isLoading = true;

    await act(async () => render(withStoreComponent));

    expect(screen.queryByText('Loading')).toBeInTheDocument();
  });
});
