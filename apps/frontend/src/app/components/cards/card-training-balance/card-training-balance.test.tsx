import '@testing-library/jest-dom';

import { ApiRoute } from '@2299899-fit-friends/consts';
import {
    makeFakeBalance, makeFakeState, makeFakeTraining
} from '@2299899-fit-friends/frontend-core';
import { act, render, screen } from '@testing-library/react';

import { withHistory, withStore } from '../../../test-mocks/test-mocks-components';
import CardTrainingBalance from './card-training-balance';

jest.mock('@2299899-fit-friends/frontend-core', () => ({
  ...jest.requireActual('@2299899-fit-friends/frontend-core'),
  useFetchFileUrl: () => ({ fileUrl: '', setFileUrl: jest.fn(), loading: false }),
}));
jest.mock('../../loading/loading', () => ({
  ...jest.requireActual('../../loading/loading'),
  __esModule: true,
  default: jest.fn(() => <div>Loading</div>),
}));
jest.mock('../card-training/card-training', () => ({
  ...jest.requireActual('../card-training/card-training'),
  __esModule: true,
  default: jest.fn(() => <div>CardTraining</div>),
}));

describe('Component CardTrainingBalance', () => {
  const item = makeFakeBalance();
  const mockState = makeFakeState();

  test('should render correctly', async () => {
    const { withStoreComponent, mockAxiosAdapter } = withStore(
      withHistory(<CardTrainingBalance item={item} />),
      mockState,
    );
    mockAxiosAdapter.onGet(`${ApiRoute.Training}/${item.trainingId}`).reply(200, makeFakeTraining());

    await act(async () => render(withStoreComponent));

    expect(screen.queryByText('CardTraining')).toBeInTheDocument();
  });

  test('should render Loading when training not set', async () => {
    const { withStoreComponent, mockAxiosAdapter } = withStore(
      withHistory(<CardTrainingBalance item={item} />),
      mockState,
    );
    mockAxiosAdapter.onGet(`${ApiRoute.Training}/${item.trainingId}`).reply(200, null);

    await act(async () => render(withStoreComponent));

    expect(screen.queryByText('CardTraining')).not.toBeInTheDocument();
    expect(screen.queryByText('Loading')).toBeInTheDocument();
  });
});
