import '@testing-library/jest-dom';

import MockAdapter from 'axios-mock-adapter';

import { ApiRoute } from '@2299899-fit-friends/consts';
import {
    makeFakeState, makeFakeTraining, makeFakeUser, State
} from '@2299899-fit-friends/frontend-core';
import { AuthStatus, UserRole } from '@2299899-fit-friends/types';
import { act, render, screen } from '@testing-library/react';

import { withHistory, withStore } from '../../test-mocks/test-mocks-components';
import TrainingCardPage from './training-card.page';

jest.mock('react-pdf', () => ({
  pdfjs: { GlobalWorkerOptions: { workerSrc: 'abc' } },
  Outline: null,
  Page: () => <div>page</div>,
  Document: () => <div>page</div>,
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
// jest.mock('react-player/lazy');

describe('Component TrainingCardPage', () => {
  let mockState: State;
  let mockAxiosAdapter: MockAdapter;
  let withStoreComponent: JSX.Element;

  beforeEach(() => {
    mockState = makeFakeState();
    const withStoreResult = withStore(
      withHistory(<TrainingCardPage />),
      mockState,
    );
    withStoreComponent = withStoreResult.withStoreComponent;
    mockAxiosAdapter = withStoreResult.mockAxiosAdapter;

    mockState.APP.authStatus = AuthStatus.Auth;
    mockState.APP.currentUser = { ...makeFakeUser(), role: UserRole.User };

    mockAxiosAdapter.onGet(new RegExp(`${ApiRoute.User}/(.*)`))
      .reply(200, makeFakeUser());
    mockAxiosAdapter.onGet(new RegExp(`${ApiRoute.Training}/(.*)}`))
      .reply(200, makeFakeTraining());
  });

  // test('should render correctly', async () => {
  //   await act(async () => render(withStoreComponent));

  //   expect(screen.queryByText('Карточка тренировки')).toBeInTheDocument();
  // });

  test('should render with NotFoundPage when training not found', async () => {
    mockAxiosAdapter.onGet(new RegExp(`${ApiRoute.Training}/(.*)}`))
      .reply(404);
    mockState.TRAINING.training = null;

    await act(async () => render(withStoreComponent));

    expect(screen.queryByText('NotFound')).toBeInTheDocument();
  });

  test('should render with Loading component when fetch pending', async () => {
    mockState.TRAINING.isLoading = true;

    await act(async () => render(withStoreComponent));

    expect(screen.queryByText('Loading')).toBeInTheDocument();
  });
});
