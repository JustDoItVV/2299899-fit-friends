import '@testing-library/jest-dom';

import MockAdapter from 'axios-mock-adapter';

import { ApiRoute } from '@2299899-fit-friends/consts';
import {
    makeFakeState, makeFakeTraining, makeFakeUser, State
} from '@2299899-fit-friends/frontend-core';
import { AuthStatus, UserRole } from '@2299899-fit-friends/types';
import { act, render, screen } from '@testing-library/react';

import { withHistory, withStore } from '../../test-mocks/test-mocks-components';
import TrainingsPage from './trainings.page';

describe('Component TrainingsPage', () => {
  let mockState: State;
  let mockAxiosAdapter: MockAdapter;
  let withStoreComponent: JSX.Element;

  beforeEach(() => {
    mockState = makeFakeState();
    const withStoreResult = withStore(
      withHistory(<TrainingsPage />),
      mockState,
    );
    withStoreComponent = withStoreResult.withStoreComponent;
    mockAxiosAdapter = withStoreResult.mockAxiosAdapter;

    mockState.APP.authStatus = AuthStatus.Auth;
    mockState.APP.currentUser = { ...makeFakeUser(), role: UserRole.User };

    mockAxiosAdapter.onGet(new RegExp(`${ApiRoute.Training}?(.*)`, 'g'))
      .reply(200, { entities: [makeFakeTraining()], totalPages: 1, totalItems: 1, itemsPerPage: 50, currentPage: 1 });
  });

  test('should render correctly', async () => {
    await act(async () => render(withStoreComponent));

    expect(screen.queryByText('Каталог тренировок')).toBeInTheDocument();
  });
});
