import '@testing-library/jest-dom';

import MockAdapter from 'axios-mock-adapter';

import { ApiRoute } from '@2299899-fit-friends/consts';
import {
    makeFakeState, makeFakeTraining, makeFakeUser, State
} from '@2299899-fit-friends/frontend-core';
import { AuthStatus, UserRole } from '@2299899-fit-friends/types';
import { act, render, screen } from '@testing-library/react';

import { withHistory, withStore } from '../../test-mocks/test-mocks-components';
import MainPage from './main.page';

describe('Component MainPage', () => {
  let mockState: State;
  let withStoreComponent: JSX.Element;
  let mockAxiosAdapter: MockAdapter;

  beforeEach(() => {
    mockState = makeFakeState();
    const withStoreResult = withStore(
      withHistory(<MainPage />),
      mockState,
    );
    withStoreComponent = withStoreResult.withStoreComponent;
    mockAxiosAdapter = withStoreResult.mockAxiosAdapter;

    mockState.APP.authStatus = AuthStatus.Auth;
    mockState.APP.currentUser = { ...makeFakeUser(), role: UserRole.User };

    mockAxiosAdapter.onGet(new RegExp(`${ApiRoute.Training}?(.*)`, 'g'))
      .reply(200, { entities: [makeFakeTraining()], totalPages: 1, totalItems: 1, itemsPerPage: 50, currentPage: 1 });
    mockAxiosAdapter.onGet(new RegExp(`${ApiRoute.User}?(.*)`, 'g'))
      .reply(200, { entities: [makeFakeUser()], totalPages: 1, totalItems: 1, itemsPerPage: 50, currentPage: 1 });
  });

  test('should render correctly', async () => {
    await act(async () => render(withStoreComponent));

    expect(screen.queryByTestId('main-slider-special-for-you')).toBeInTheDocument();
    expect(screen.queryByTestId('main-slider-special-offers')).toBeInTheDocument();
    expect(screen.queryByTestId('main-slider-popular-trainings')).toBeInTheDocument();
    expect(screen.queryByTestId('main-slider-look-for-company')).toBeInTheDocument();
  });
});
