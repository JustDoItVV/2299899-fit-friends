import '@testing-library/jest-dom';

import { ApiRoute } from '@2299899-fit-friends/consts';
import {
    extractActionsTypes, fetchUser, makeFakeBalance, makeFakeState, makeFakeTraining, makeFakeUser,
    setResponseError, State, updateBalance, updateTraining
} from '@2299899-fit-friends/frontend-core';
import { Balance, Training, User, UserRole } from '@2299899-fit-friends/types';
import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { withHistory, withStore } from '../../../test-mocks/test-mocks-components';
import CardTrainingInfo from './card-training-info';

jest.mock('@2299899-fit-friends/frontend-core', () => ({
  ...jest.requireActual('@2299899-fit-friends/frontend-core'),
  useFetchFileUrl: () => ({ fileUrl: '', setFileUrl: jest.fn(), loading: false }),
}));
jest.mock('../../popups/popup-buy/popup-buy', () => ({
  ...jest.requireActual('../../popups/popup-buy/popup-buy'),
  __esModule: true,
  default: jest.fn(() => <div>PopupBuy</div>),
}));

describe('Component CardTrainingInfo', () => {
  let mockState: State;
  let mockTraining: Training;
  let mockCurrentUser: User;
  let mockTrainer: User;
  let mockBalance: Balance;

  beforeEach(() => {
    mockState = makeFakeState();
    mockTraining = makeFakeTraining();
    mockCurrentUser = makeFakeUser();
    mockTrainer = makeFakeUser();
    mockTrainer.role = UserRole.Trainer;
    mockBalance = makeFakeBalance();
    mockBalance.available = 1;

    mockState.TRAINING.training = mockTraining;
    mockState.TRAINING.balance = mockBalance;
    mockState.USER.user = mockTrainer;
  });

  test('should render correctly with current user role User', async () => {
    mockState.APP.currentUser = { ...mockCurrentUser, role: UserRole.User };
    const { withStoreComponent } = withStore(
      withHistory(<CardTrainingInfo id={mockTraining.id} />),
      mockState,
    );

    await act(async () => render(withStoreComponent));

    expect(screen.queryByText('Информация о тренировке')).toBeInTheDocument();
    expect(screen.queryByTestId('card-avatar')).toBeInTheDocument();
    expect(screen.queryByText(mockTrainer.name)).toBeInTheDocument();
    expect(screen.queryByDisplayValue(mockTraining.title)).toBeInTheDocument();
    expect(screen.queryByDisplayValue(mockTraining.description)).toBeInTheDocument();
    expect(screen.getByDisplayValue(mockTraining.description)).toBeDisabled();
    expect(screen.queryByText('PopupBuy')).toBeInTheDocument();
    expect(screen.queryByText('Приступить')).toBeInTheDocument();
    expect(screen.queryByText('Приступить')).not.toBeDisabled();
    expect(screen.queryByText('Редактировать')).not.toBeInTheDocument();
  });

  test('should dispatch "updateBalance.pending", "updateBalance.fulfilled" when start training button click', async () => {
    const user = userEvent.setup();
    mockState.APP.currentUser = { ...mockCurrentUser, role: UserRole.User };
    const { withStoreComponent, mockStore, mockAxiosAdapter } = withStore(
      withHistory(<CardTrainingInfo id={mockTraining.id} />),
      mockState,
    );
    mockAxiosAdapter.onPatch(`${ApiRoute.Account}${ApiRoute.User}${ApiRoute.Balance}`)
      .reply(200, makeFakeBalance());

    await act(async () => render(withStoreComponent));
    await user.click(screen.getByText('Приступить'));
    const emittedActions = mockStore.getActions();
    const actionsTypes = extractActionsTypes(emittedActions);

    expect(actionsTypes).toEqual([
      fetchUser.pending.type,
      fetchUser.rejected.type,
      updateBalance.pending.type,
      updateBalance.fulfilled.type,
    ]);
    expect(screen.queryByText('Приступить')).not.toBeInTheDocument();
    expect(screen.queryByText('Закончить')).toBeInTheDocument();
  });

  test('should render correctly with current user role Trainer and owner', async () => {
    mockState.APP.currentUser = { ...mockCurrentUser, role: UserRole.Trainer };
    mockState.USER.user = mockState.APP.currentUser;
    const { withStoreComponent } = withStore(
      withHistory(<CardTrainingInfo id={mockTraining.id} />),
      mockState,
    );

    await act(async () => render(withStoreComponent));

    expect(screen.queryByText('Приступить')).not.toBeInTheDocument();
    expect(screen.queryByText('Редактировать')).toBeInTheDocument();
  });

  test('should dispatch "updateTraining.pending", "APP/setResponseError", "updateTraining.fulfilled" when start training button click', async () => {
    const user = userEvent.setup();
    mockState.APP.currentUser = { ...mockCurrentUser, role: UserRole.Trainer };
    mockState.USER.user = mockState.APP.currentUser;
    const { withStoreComponent, mockStore, mockAxiosAdapter } = withStore(
      withHistory(<CardTrainingInfo id={mockTraining.id} />),
      mockState,
    );
    mockAxiosAdapter.onPatch(new RegExp(`${ApiRoute.Training}/(.*)`)).reply(200, makeFakeTraining());

    await act(async () => render(withStoreComponent));
    await user.click(screen.getByText('Редактировать'));
    await user.click(screen.getByText('Сохранить'));
    const emittedActions = mockStore.getActions();
    const actionsTypes = extractActionsTypes(emittedActions);

    expect(actionsTypes).toEqual([
      fetchUser.pending.type,
      fetchUser.rejected.type,
      updateTraining.pending.type,
      setResponseError.type,
      updateTraining.fulfilled.type,
    ]);
  });
});
